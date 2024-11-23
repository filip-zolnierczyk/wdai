let products = [];
let originalProducts = [];

async function fetchData() {
    try {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();
        products = data.products
        originalProducts = [...products]; 
        renderTable(products);
    } catch (error) {
        console.error("Błąd podczas pobierania danych:", error);
    }
}

function renderTable(data) {
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = '';

    data.forEach(product => {
        const row = document.createElement('tr');
        
        const imageCell = document.createElement('td');
        const image = document.createElement('img');
        image.src = product.thumbnail;
        image.alt = product.title;
        imageCell.appendChild(image);
        
        const titleCell = document.createElement('td');
        titleCell.textContent = product.title;

        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = product.description;

        row.appendChild(imageCell);
        row.appendChild(titleCell);
        row.appendChild(descriptionCell);

        tableBody.appendChild(row);
    });
}

function filterData() {
    const filterText = document.getElementById('filterInput').value.toLowerCase();
    const filteredData = products.filter(product => 
        product.title.toLowerCase().includes(filterText) ||
        product.description.toLowerCase().includes(filterText)
    );
    renderTable(filteredData);
}

function sortData() {
    const sortValue = document.getElementById('sortSelect').value;
    
    if (sortValue === 'asc') {
        products.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortValue === 'desc') {
        products.sort((a, b) => b.title.localeCompare(a.title));
    } else {
        products = [...originalProducts];
    }
    renderTable(products);
}

fetchData();
