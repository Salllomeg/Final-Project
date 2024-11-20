let cart = [];
let favorites = [];
const pageSize = 9;
let currentPage = 1;
let products = [];

function fetchProducts() {
    fetch('https://dummyjson.com/products/category/smartphones')
        .then(res => res.json())
        .then(data => {
            products = data.products;
            document.getElementById('totalItems').innerHTML = `${products.length} items in <strong>Smartphones</strong>`;
            displayProducts(products.slice(0, pageSize));
            drawPagination(products);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

function toggleView(view) {
    const productContainer = document.getElementById('productContainer');
    const gridButton = document.querySelector('.view-toggle-grid');
    const listButton = document.querySelector('.view-toggle-list');

    if (view === 'grid') {
        productContainer.classList.add('grid-view');
        productContainer.classList.remove('list-view');
        gridButton.classList.add('active');
        listButton.classList.remove('active');
        currentView = 'grid';
    } else {
        productContainer.classList.add('list-view');
        productContainer.classList.remove('grid-view');
        listButton.classList.add('active');
        gridButton.classList.remove('active');
        currentView = 'list';
    }
}

document.getElementById('menuToggle').addEventListener('click', function() {
    const menuIcons = document.querySelector('.menu-icons');
    menuIcons.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.view-toggle-grid').addEventListener('click', () => {
        toggleView('grid');
    });

    document.querySelector('.view-toggle-list').addEventListener('click', () => {
        toggleView('list');
    });

    toggleView(currentView);
});

function toggleFavorite(productId) {
    const index = favorites.indexOf(productId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(productId);
    }
    displayProducts(products.slice((currentPage - 1) * pageSize, currentPage * pageSize));
}

function displayProducts(productsToDisplay) {
    const productContainer = document.getElementById('productContainer');
    productContainer.innerHTML = '';

    productsToDisplay.forEach(product => {
        const isFavorited = favorites.includes(product.id);
        const heartIcon = isFavorited 
            ? `<img src="./assets/icons/pr01 - filled heart.svg" alt="Filled heart" />` 
            : `<img src="./assets/icons/pr01 - empty heart.svg" alt="Empty heart" />`;
        
        const discountAmount = (product.price * product.discountPercentage) / 100;
        const discountedPrice = product.price - discountAmount;

        const productElement = document.createElement('div');
        productElement.className = 'product'; 

        productElement.innerHTML = `
        <div class="image-container">
            <img src="${product.thumbnail}" alt="${product.title}"/>
        </div>
        <div class="details-container">
            <div class="price-container">
                <span class="discounted-price">$${discountedPrice.toFixed(2)}</span>
                <span class="full-price">$${product.price.toFixed(2)}</span>
            </div>
            <p class="rating">${getStarRating(product.rating)} ${product.rating.toFixed(1)}</p>
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <button class="heart-button" onclick="toggleFavorite(${product.id})">${heartIcon}</button>
        </div>`;

        productContainer.appendChild(productElement);
    });
}

const drawPagination = (products) => {
    const paginationContainer = document.getElementById('paginationContainer');
    const pageNumbersContainer = document.getElementById('pageNumbers');
    pageNumbersContainer.innerHTML = '';

    const pageCount = Math.ceil(products.length / pageSize);
    
    for (let i = 1; i <= pageCount; i++) {
        const pageNumberButton = document.createElement('div');
        pageNumberButton.classList.add('single_item');
        pageNumberButton.innerText = i;
        pageNumberButton.addEventListener('click', () => {
            currentPage = i;
            displayProducts(products.slice((currentPage - 1) * pageSize, currentPage * pageSize));
            drawPagination(products);
        });

        if (i === currentPage) {
            pageNumberButton.classList.add('active');
        }

        pageNumbersContainer.appendChild(pageNumberButton);
    }

    document.getElementById('prevButton').disabled = currentPage === 1;
    document.getElementById('nextButton').disabled = currentPage === pageCount;

    document.getElementById('prevButton').onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            displayProducts(products.slice((currentPage - 1) * pageSize, currentPage * pageSize));
            drawPagination(products);
        }
    };

    document.getElementById('nextButton').onclick = () => {
        if (currentPage < pageCount) {
            currentPage++;
            displayProducts(products.slice((currentPage - 1) * pageSize, currentPage * pageSize));
            drawPagination(products);
        }
    };
}

function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;

    let starsHtml = '';
    starsHtml += '<img src="./assets/icons/pr02 - full star.svg" alt="Full star" />'.repeat(fullStars);
    starsHtml += '<img src="./assets/icons/pr02 - empty star.svg" alt="Empty star" />'.repeat(emptyStars);
    
    return starsHtml;
}


function sortByName() {
    products.sort((a, b) => a.title.localeCompare(b.title));
    currentPage = 1;
    displayProducts(products.slice(0, pageSize));
    drawPagination(products);
}

function sortByPrice() {
    products.sort((a, b) => a.price - b.price);
    currentPage = 1;
    displayProducts(products.slice(0, pageSize));
    drawPagination(products);
}

document.getElementById('filterOptions').addEventListener('change', function() {
    const selectedValue = this.value;
    if (selectedValue === 'price') {
        sortByPrice();
    } else if (selectedValue === 'name') {
        sortByName();
    }
});

const languageSelector = document.getElementById('languageSelector');
const options = document.getElementById('languageOptions');
const selectedLanguage = document.getElementById('selectedLanguage');

languageSelector.addEventListener('click', () => {
    options.style.display = options.style.display === 'block' ? 'none' : 'block';
});

const optionElements = document.querySelectorAll('.option');
optionElements.forEach(option => {
    option.addEventListener('click', () => {
        const value = option.getAttribute('data-value');
        const flagSrc = option.querySelector('img').src;
        selectedLanguage.textContent = option.textContent.trim();
        document.querySelector('.selected-language img').src = flagSrc;
        options.style.display = 'none';
    });
});

document.addEventListener('click', (event) => {
    if (!languageSelector.contains(event.target)) {
        options.style.display = 'none';
    }
});

window.onload = function() {
    fetchProducts();
};