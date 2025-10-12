#  Invoice Generator — Demo

A simple and intuitive web application built with HTML, CSS, and JavaScript that allows users to create, preview, and export invoices easily.  
This project works entirely offline (no server or database required).

---

##  Features

✓ Interactive Invoice Creation  
Fill out company, client, and item details directly in the interface.  

✓ Live Editing  
Preview fields (name, address, prices, quantities, etc.) are editable directly on the invoice using contenteditable.  

✓ Local Save  
Store invoice data in the browser’s LocalStorage, so it persists even after refreshing the page.  

✓ PDF Export  
Generate and download professional invoices as PDF files using html2canvas and jsPDF.  

✓ JSON Export  
Download your invoice data as a JSON file for reuse or backup.  

✓ Print Support  
Print invoices directly from your browser with a single click.  

---

##  Technologies Used

| Technology | Purpose |
|-------------|----------|
| HTML5 | Page and form structure |
| CSS3 | Layout and responsive design |
| JavaScript (ES6) | Dynamic logic and user interactions |
| html2canvas | Capture the invoice for PDF export |
| jsPDF | Generate and download PDF files |

---

##  Project Structure

Invoice generator/ │ ├── index.html        # Main page (form + preview) 
├── styles.css        # Application styles 
├── app.js            # Main JavaScript logic 
└── README.md         # Project documentation
