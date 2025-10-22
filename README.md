##  Invoice Generator 

A simple and intuitive web application built with HTML, CSS, and JavaScript that allows users to create, preview, and export invoices easily.  
This project works entirely offline (no server or database required).



###  Features

### Interactive Invoice Creation  
Fill out company, client, and item details directly in the interface.  
### Live Editing  
Preview fields (name, address, prices, quantities, etc.) are editable directly on the invoice using contenteditable.  
### Local Save  
Store invoice data in the browser’s LocalStorage, so it persists even after refreshing the page.  
### PDF Export  
Generate and download professional invoices as PDF files using html2canvas and jsPDF.  
### JSON Export  
Download your invoice data as a JSON file for reuse or backup.  
### Print Support  
Print invoices directly from your browser with a single click.  

###  Technologies Used

| Technology | Purpose |
|-------------|----------|
| HTML5 | Page and form structure |
| CSS3 | Layout and responsive design |
| JavaScript (ES6) | Dynamic logic and user interactions |
| html2canvas | Capture the invoice for PDF export |
| jsPDF | Generate and download PDF files |



###  Project Structure

Invoice generator/ │ ├── index.html        # Main page (form + preview) 
├── styles.css        # Application styles 
├── app.js            



###  How to Use

1. Clone or download the repository:
   ```bash
   git clone https://github.com/YourUsername/Invoice-generator.git
   ```
2. Open the index.html file in your browser.
(No installation required)

3. Fill in company and client details, add items, then:
   
• Save locally

• Export as PDF

• Download as JSON

• Print the invoice

###  External Libraries

- [html2canvas v1.4.1](https://cdnjs.com/libraries/html2canvas)  
- [jsPDF v2.5.1](https://cdnjs.com/libraries/jspdf)
