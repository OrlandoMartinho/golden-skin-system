document.addEventListener('DOMContentLoaded', async () => {
    const accessToken = localStorage.getItem('accessToken');
    let productsData = [];
    let userData = {};
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    async function initializeData() {
        try {
            // Initialize User Info
            userData = JSON.parse(localStorage.getItem('user')) || {};
            document.getElementById('user-name').textContent = userData.name || 'Usuário';

            // Initialize Products
            const productsResult = await getAllProducts(accessToken);
            if (productsResult === 200) {
                productsData = JSON.parse(localStorage.getItem('products')) || [];
                populateProductsSection(productsData);
                updateCartCount(0); // Sync cart count with stored items
                updateCartDropdown();
            } else {
                showMessageModal('error', 'Erro!', 'Falha ao carregar produtos', { buttonText: 'Entendido' });
            }
        } catch (error) {
            console.error('Erro ao inicializar dados:', error);
            showMessageModal('error', 'Erro!', 'Falha ao inicializar a página', { buttonText: 'Entendido' });
        }
    }

    function populateProductsSection(products) {
        const section = document.querySelector('.section-products');
        if (!section) return;

        section.innerHTML = '';
        if (products.length === 0) {
            section.innerHTML = '<p>Nenhum produto encontrado.</p>';
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            const rating = calculateRating(product.rating || 0);
            card.innerHTML = `
                <div class="product-image">
                    <img src="${product.photo || '../../assets/img/placeholder.png'}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name || '-'}</h3>
                    <div class="rating">
                        ${rating.stars}
                        <span>(${product.reviews || 0})</span>
                    </div>
                    <div class="price">AOA ${(product.priceInCents / 100).toFixed(2)}</div>
                    <button class="add-to-cart" onclick="openProductModal(${product.idProduct})">
                        <i class="fas fa-shopping-cart"></i> Adicionar
                    </button>
                </div>
            `;
            section.appendChild(card);
        });
    }

    function calculateRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;
        let stars = '';
        for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
        if (halfStar) stars += '<i class="fas fa-star-half-alt"></i>';
        for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star"></i>';
        return { stars, rating };
    }

    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('active');
        document.querySelector('.overlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
        document.querySelector('.overlay').classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    window.openProductModal = function(idProduct) {
        const modal = document.getElementById('product-detail-modal');
        const product = productsData.find(p => p.idProduct === idProduct);
        if (modal && product) {
            document.getElementById('product-image').src = product.photo || '../../assets/img/placeholder.png';
            document.getElementById('product-name').textContent = product.name || '-';
            document.getElementById('product-rating').innerHTML = calculateRating(product.rating || 0).stars + `<span>(${product.reviews || 0})</span>`;
            document.getElementById('product-price').textContent = `AOA ${(product.priceInCents / 100).toFixed(2)}`;
            document.getElementById('product-description').textContent = product.description || 'Sem descrição disponível';
            document.getElementById('product-brand').textContent = product.brand || '-';
            document.getElementById('product-volume').textContent = product.volume || '-';
            document.getElementById('product-skin-type').textContent = product.skinType || '-';
            document.getElementById('product-ingredients').textContent = product.ingredients || '-';
            modal.dataset.idProduct = idProduct;
            document.getElementById('product-quantity').value = 1;
            modal.classList.add('active');
        }
    };

    window.goToCart = function() {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        window.location.href = 'user-cart.html';
    };

    function addToCart(productId, quantity = 1) {
        const product = productsData.find(p => p.idProduct === productId);
        if (!product) return;

        const existingItem = cartItems.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cartItems.push({
                id: productId,
                quantity: quantity,
                name: product.name,
                price: product.priceInCents / 100
            });
        }

        updateCartCount(quantity);
        updateCartDropdown();
        openModal('add-to-cart-modal');
    }

    window.addToCartFromModal = function() {
        const quantity = parseInt(document.getElementById('product-quantity').value);
        const productId = parseInt(document.getElementById('product-detail-modal').dataset.idProduct);
        addToCart(productId, quantity);
        closeModal('product-detail-modal');
    };

    function updateCartCount(quantityToAdd) {
        const cartCountElement = document.querySelector('.cart-count');
        let currentCount = parseInt(cartCountElement.textContent) || 0;
        const newCount = currentCount + quantityToAdd;
        cartCountElement.textContent = newCount > 0 ? newCount : 0;
    }

    function updateCartDropdown() {
        const cartDropdown = document.querySelector('.cart-dropdown');
        const cartTotalElement = document.querySelector('.cart-total p');

        cartDropdown.querySelectorAll('.cart-item:not(.cart-total)').forEach(item => item.remove());

        let total = 0;
        cartItems.forEach(item => {
            const product = productsData.find(p => p.idProduct === item.id);
            if (product) {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <img src="${product.photo || 'https://via.placeholder.com/50'}" alt="${product.name}">
                    <div>
                        <p>${product.name}</p>
                        <small>${item.quantity}x AOA ${item.price.toFixed(2)}</small>
                    </div>
                    <i class="fas fa-times" onclick="removeCartItem(${item.id})"></i>
                `;
                cartDropdown.insertBefore(itemElement, cartTotalElement.parentElement);
                total += item.quantity * item.price;
            }
        });

        cartTotalElement.textContent = `Total: AOA ${total.toFixed(2)}`;
    }

    function removeCartItem(productId) {
        const itemIndex = cartItems.findIndex(item => item.id === productId);
        if (itemIndex !== -1) {
            const removedItem = cartItems.splice(itemIndex, 1)[0];
            updateCartCount(-removedItem.quantity);
            updateCartDropdown();
        }
    }

    window.increaseQuantity = function() {
        const input = document.getElementById('product-quantity');
        input.value = parseInt(input.value) + 1;
    };

    window.decreaseQuantity = function() {
        const input = document.getElementById('product-quantity');
        if (parseInt(input.value) > 1) {
            input.value = parseInt(input.value) - 1;
        }
    };

    function filterProducts() {
        const searchInput = document.getElementById('search-input').value.toLowerCase().trim();
        const categoryFilter = document.getElementById('category-filter').value;
        const sortFilter = document.getElementById('sort-filter').value;

        let filteredProducts = productsData.filter(product => {
            const matchesSearch = (product.name || '').toLowerCase().includes(searchInput) ||
                                 (product.description || '').toLowerCase().includes(searchInput);
            const matchesCategory = categoryFilter === 'all' || (product.category || '').toLowerCase() === categoryFilter;
            return matchesSearch && matchesCategory;
        });

        if (sortFilter !== 'default') {
            filteredProducts.sort((a, b) => {
                if (sortFilter === 'price-asc') return a.priceInCents - b.priceInCents;
                if (sortFilter === 'price-desc') return b.priceInCents - a.priceInCents;
                if (sortFilter === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
                if (sortFilter === 'newest') return new Date(b.updatedIn) - new Date(a.updatedIn);
                return 0;
            });
        }

        populateProductsSection(filteredProducts);
    }

    document.getElementById('search-input').addEventListener('input', filterProducts);
    document.getElementById('category-filter').addEventListener('change', filterProducts);
    document.getElementById('sort-filter').addEventListener('change', filterProducts);

    // Handle overlay and escape key
    document.querySelector('.overlay').addEventListener('click', function() {
        document.querySelectorAll('.modal.active').forEach(modal => closeModal(modal.id));
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => closeModal(modal.id));
        }
    });

    await initializeData();
});