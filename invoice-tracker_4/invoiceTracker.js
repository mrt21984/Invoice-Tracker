class Invoice {
    constructor(invoiceNum, company, date, amount, expectedSales) {
        this.invoiceNum = invoiceNum;
        this.company = company;
        this.date = date;
        this.amount = amount;
        this.expectedSales = expectedSales;
        this.grossProfit = ((expectedSales - amount) / expectedSales) * 100;
    }
}

class UI {

    static displayInvoices() {
        document.querySelector("#invDate").valueAsDate = new Date();
        const invoices = Store.getInvoices();
        invoices.forEach((invoice) => UI.addInvoice(invoice));
    }

    static addInvoice(invoice) {
        const list = document.querySelector("#invoice-table");
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${invoice.invoiceNum}</td>
        <td>${invoice.company}</td>
        <td>${invoice.date}</td>
        <td>${invoice.amount}</td>
        <td>${invoice.expectedSales}</td>
        <td>${invoice.grossProfit}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    }

    static getInvoiceTotal() {
        const invoices = Store.getInvoices();
        var invoiceTotal = 0;
        let invoiceCount = 0;
        let totalExpSales = 0;
        let grossPercent = 0;


        for (let i = 0; i < invoices.length; i++) {
            invoiceTotal += (parseFloat(invoices[i].amount));
            invoiceCount += 1;
            totalExpSales += (parseFloat(invoices[i].expectedSales));
        }

        grossPercent = ((totalExpSales - invoiceTotal) / totalExpSales) * 100;
        const list = document.querySelector("#totals-table");
        list.innerHTML = `
        <tr>
        <td>${invoiceCount}</td>
        <td>${invoiceTotal}</td>
        <td>${totalExpSales}</td>
        <td>${grossPercent}</td>
        </tr>
        `;

    }

    static deleteFood(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const header = document.querySelector('header');
        container.insertBefore(div, header);
        setTimeout(() => document.querySelector('.alert').remove(), 1000);
    }
    static clearFields() {
        document.querySelector("#invNum").value = "";
        document.querySelector("#invComp").value = "";
        document.querySelector("#invAmt").value = "";
        document.querySelector("#invSales").value = "";
    }
}

class Store {

    static getInvoices() {
        let invoices;
        if (localStorage.getItem('invoices') === null) {
            invoices = [];
        } else {
            invoices = JSON.parse(localStorage.getItem('invoices'));
        }
        return invoices;
    }

    static addInvoice(invoice) {
        const invoices = Store.getInvoices();
        invoices.push(invoice);
        localStorage.setItem('invoices', JSON.stringify(invoices));
    }

    static removeInvoice(invNum) {
        const invoices = Store.getInvoices();

        invoices.forEach((invoice, index) => {
            if (invoice.invoiceNum === invNum) {
                invoices.splice(index, 1);
            }
        });
        localStorage.setItem('invoices', JSON.stringify(invoices));

    }
}

document.addEventListener('DOMContentLoaded', () => {
    UI.displayInvoices();
    UI.getInvoiceTotal();
    warnings();

});

document.querySelector('#addBtn').addEventListener('click', (e) => {


    const invNum = document.querySelector("#invNum").value;
    const company = document.querySelector("#invComp").options[document.querySelector("#invComp").selectedIndex].value;
    const date = document.querySelector("#invDate").value;
    const amount = document.querySelector("#invAmt").value;
    const sales = document.querySelector("#invSales").value;


    if (invNum === '' || company === '' || amount === '' || sales === '') {

        UI.showAlert('Please fill in all fields', 'danger');
    }
    const theInvoice = new Invoice(invNum, company, date, amount, sales);

    UI.addInvoice(theInvoice);
    Store.addInvoice(theInvoice);
    UI.getInvoiceTotal();
    UI.showAlert('Invoice Added', 'success');
    UI.clearFields();
});


document.querySelector("#food-list").addEventListener('click', (e) => {

    UI.deleteFood(e.target);
    Store.removeInvoice(e.target.parentElement.parentElement.children[0].textContent)
    if (e.target.classList.contains('delete')) {
        UI.showAlert('Invoice Removed', 'success');
    }
})

function warnings() {
    let table2 = document.querySelector('#invoiceTable');
    console.log(table2.firstElementChild.nextElementSibling.firstElementChild.children[5]);
    if (table2.firstElementChild.nextElementSibling.firstElementChild.children[5].textContent < 50) {
        table2.firstElementChild.nextElementSibling.firstElementChild.children[5].className = "text-warning";
    }
}