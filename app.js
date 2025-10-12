// ---------- Etat local ----------
const state = {
  items: [ {desc:'Service Exemple', qty:1, price:2500, tax:0} ]
};

// ---------- Helpers ----------
function q(sel){return document.querySelector(sel)}
function qs(sel){return document.querySelectorAll(sel)}

function formatMoney(value){
  const sym = document.getElementById('previewCurrencySymbol').value || document.getElementById('currencySymbol').value || 'DA';
  return sym + ' ' + Number(value || 0).toLocaleString();
}

// ---------- Render items into the table ----------
function renderItems(){
  const tbody = document.getElementById('itemsBody');
  tbody.innerHTML = '';
  state.items.forEach((it, i) =>{
    const tr = document.createElement('tr');
     tr.innerHTML = `
      <td><input data-index="${i}" data-field="desc" type="text" value="${escapeHtml(it.desc)}"/></td>
      <td><input data-index="${i}" data-field="qty" type="number" min="0" value="${it.qty}"/></td>
      <td><input data-index="${i}" data-field="price" type="number" min="0" step="0.01" value="${it.price}"/></td>
      <td><input data-index="${i}" data-field="tax" type="number" min="0" step="0.01" value="${it.tax}"/></td>
      <td class="small">${formatMoney(calculateLineTotal(it))}</td>
      <td><button class="remove" data-index="${i}">✖</button></td>`
    ;
    tbody.appendChild(tr);
  });
  attachItemListeners();
  updateSummary();
}

function escapeHtml(str){ return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function calculateLineTotal(item){
  const sub = (Number(item.qty) || 0) * (Number(item.price) || 0);
  const tax = sub * (Number(item.tax||0))/100;
  return +(sub + tax).toFixed(2);
}

function calculateSummary(){
  let subtotal = 0; let taxTotal = 0;
  state.items.forEach(it=>{
    const sub = (Number(it.qty)|| 0) * (Number(it.price)||0);
    const tax = sub * (Number(it.tax||0))/100;
    subtotal += sub;
    taxTotal += tax;
  });
  const globalTax = Number(document.getElementById('globalTax').value) || 0;
  const extraTax = subtotal * (globalTax/100);
  return { subtotal: +subtotal.toFixed(2), taxTotal: +((taxTotal + extraTax).toFixed(2)), grandTotal: +(subtotal + taxTotal + extraTax).toFixed(2) };
}

function updateSummary(){
  const s = calculateSummary();
  document.getElementById('subtotalPreview').textContent = formatMoney(s.subtotal);
  document.getElementById('taxTotalPreview').textContent = formatMoney(s.taxTotal);
  document.getElementById('grandTotalPreview').textContent = formatMoney(s.grandTotal);
}

// ---------- Events for dynamic inputs in the items table ----------
function attachItemListeners(){
  document.querySelectorAll('#itemsBody input').forEach(inp=>{
    inp.oninput = (e)=>{
      const idx = Number(inp.dataset.index);
      const field = inp.dataset.field;
      if(field==='desc') state.items[idx].desc = inp.value;
      else if(field==='qty') state.items[idx].qty = Number(inp.value)||0;
      else if(field==='price') state.items[idx].price = Number(inp.value)||0;
      else if(field==='tax') state.items[idx].tax = Number(inp.value)||0;
      renderItems();
    }
  });
  document.querySelectorAll('#itemsBody .remove').forEach(btn=>{
    btn.onclick = (e)=>{
      const idx = Number(btn.dataset.index);
      state.items.splice(idx,1);
      renderItems();
    }
  });
}

// ---------- Add item ----------
document.getElementById('addItemBtn').addEventListener('click', ()=>{
  state.items.push({desc:'Nouvel article', qty:1, price:0, tax:0});
  renderItems();
});

// ---------- Sync preview/company fields with form fields ----------
function syncFields(){
  const mappings = [
    ['companyName','previewCompanyName'], ['companyAddress','previewCompanyAddress'], ['companyEmail','previewCompanyEmail'],
    ['clientName','previewClientName'], ['clientEmail','previewClientEmail'], ['currencySymbol','previewCurrencySymbol'], ['invoiceNumber','previewInvoiceNumber'], ['invoiceDate','previewInvoiceDate'], ['note','previewNote']
];
  mappings.forEach(([src,tgt])=>{
    const s = document.getElementById(src);
    const t = document.getElementById(tgt);
    if(!s || !t) return;
    const update = ()=>{
      if(t.tagName === 'INPUT') t.value = s.value;
      else t.textContent = s.value;
      updateSummary();
    };
    s.addEventListener('input', update);
    update();
  });

  ['previewInvoiceNumber','previewInvoiceDate','previewClientName','previewClientEmail','previewCurrencySymbol'].forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    el.addEventListener('input', ()=>{
      const targetMap = { previewInvoiceNumber:'invoiceNumber', previewInvoiceDate:'invoiceDate', previewClientName:'clientName', previewClientEmail:'clientEmail', previewCurrencySymbol:'currencySymbol'};
      const tgt = document.getElementById(targetMap[id]);
      if(tgt) tgt.value = el.value;
      updateSummary();
    });
  });

  document.getElementById('previewCompanyName').addEventListener('input', (e)=>{
    document.getElementById('companyName').value = e.target.textContent.trim();
  });
}

// ---------- Save / Download / Print / PDF ----------
document.getElementById('saveBtn').addEventListener('click', ()=>{
  const inv = collectInvoiceData();
  const all = JSON.parse(localStorage.getItem('invoices')||'[]');
  all.push(inv);
  localStorage.setItem('invoices', JSON.stringify(all));
  localStorage.setItem('lastInvoice', JSON.stringify(inv));
  alert('Facture enregistrée localement (localStorage)');
});

document.getElementById('downloadJsonBtn').addEventListener('click', ()=>{
  const inv = collectInvoiceData();
  const blob = new Blob([JSON.stringify(inv, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = (inv.number||'invoice') + '.json'; a.click(); URL.revokeObjectURL(url);
});

document.getElementById('printBtn').addEventListener('click', ()=>{
  window.print();
});

document.getElementById('pdfBtn').addEventListener('click', async ()=>{
  const invoiceEl = document.getElementById('invoice-preview');
  try{
    const canvas = await html2canvas(invoiceEl, {scale:2});
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p','mm','a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    const filename = (document.getElementById('invoiceNumber').value || 'invoice') + '.pdf';
    pdf.save(filename);
  }catch(err){
    console.error(err); alert('Erreur lors de la génération du PDF');
  }
});

function collectInvoiceData(){
  const inv = {
    company: { name: document.getElementById('companyName').value, address: document.getElementById('companyAddress').value, email: document.getElementById('companyEmail').value },
    client: { name: document.getElementById('clientName').value, email: document.getElementById('clientEmail').value },
    number: document.getElementById('invoiceNumber').value,
    date: document.getElementById('invoiceDate').value,
    due: document.getElementById('previewDueDate').value,
    currency: document.getElementById('currencySymbol').value,
    note: document.getElementById('note').value,
    items: state.items,
    summary: calculateSummary()
  };
  return inv;
}

// ---------- Load last invoice if present ----------
function loadLast(){
  const last = JSON.parse(localStorage.getItem('lastInvoice')||'null');
  if(!last) return;
  document.getElementById('companyName').value = last.company?.name || '';
  document.getElementById('companyAddress').value = last.company?.address || '';
  document.getElementById('companyEmail').value = last.company?.email || '';
  document.getElementById('clientName').value = last.client?.name || '';
  document.getElementById('clientEmail').value = last.client?.email || '';
  document.getElementById('invoiceNumber').value = last.number || '';
  document.getElementById('invoiceDate').value = last.date || '';
  document.getElementById('currencySymbol').value = last.currency || 'DA';
  document.getElementById('note').value = last.note || '';
  if(Array.isArray(last.items) && last.items.length>0) state.items = last.items;
}

// ---------- Init ----------
function init(){
  loadLast();
  renderItems();
  syncFields();
  if(!document.getElementById('invoiceDate').value){
    const d = new Date().toISOString().slice(0,10);
    document.getElementById('invoiceDate').value = d; document.getElementById('previewInvoiceDate').value = d;
  }
}

init();