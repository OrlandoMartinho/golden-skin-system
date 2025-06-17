document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM fully loaded and parsed');
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access token retrieved from localStorage:', accessToken ? 'exists' : 'not found');
    
    let productsData = [];
    let userData = {};
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    console.log('Initial cart items:', cartItems);

    async function initializeData() {
        console.log('Initializing data...');
        try {
            // Initialize User Info
            userData = JSON.parse(localStorage.getItem('user')) || {};
            console.log('User data:', userData);
            document.getElementById('user-name').textContent = userData.name || 'Usuário';

            // Initialize Products
            console.log('Fetching products...');
            const productsResult = await getAllProducts(accessToken);
            console.log('Products API response status:', productsResult);
            
            if (productsResult === 200) {
                productsData = JSON.parse(localStorage.getItem('products')) || [];
                console.log('Products data loaded:', productsData.length, 'products');
                populateProductsSection(productsData);
                // updateCartCount(0); // Sync cart count with stored items
                updateCartDropdown();
            } else {
                console.error('Failed to load products, status:', productsResult);
                showMessageModal('error', 'Erro!', 'Falha ao carregar produtos', { buttonText: 'Entendido' });
            }
        } catch (error) {
            console.error('Erro ao inicializar dados:', error);
            showMessageModal('error', 'Erro!', 'Falha ao inicializar a página', { buttonText: 'Entendido' });
        }
    }

    function populateProductsSection(products) {
        console.log('Populating products section with', products.length, 'products');
        const section = document.querySelector('.section-products');
        if (!section) {
            console.warn('Products section element not found');
            return;
        }

        section.innerHTML = '';
        if (products.length === 0) {
            console.log('No products found to display');
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
        console.log('Calculating rating for:', rating);
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
        console.log('Opening modal:', modalId);
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('active');
        document.querySelector('.overlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function(modalId) {
        console.log('Closing modal:', modalId);
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
        document.querySelector('.overlay').classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    window.openProductModal = function(idProduct) {
        console.log('Opening product modal for product ID:', idProduct);
        const modal = document.getElementById('product-detail-modal');
        const product = productsData.find(p => p.idProduct === idProduct);
        
        if (!modal) {
            console.error('Product detail modal not found');
            return;
        }
        
        if (!product) {
            console.error('Product not found with ID:', idProduct);
            return;
        }
        
        console.log('Displaying product details:', product);
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
    };

    window.goToCart = function() {
        console.log('Navigating to cart with items:', cartItems);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        window.location.href = 'user-cart.html';
    };

    async function registerCartItem(idProduct) {
        await registerAnyCartItem(accessToken, { idProduct });
    }

    async function addToCart(productId, quantity) {
        console.log('Adding to cart - Product ID:', productId, 'Quantity:', quantity);
        const product = productsData.find(p => p.idProduct === productId);
        if (!product) {
            console.error('Product not found with ID:', productId);
            return;
        }
        try{
            for (let i = 0; i < quantity; i++) {
                await registerCartItem(productId);
            }
            showMessageModal('success', 'Sucesso!', `Produto ${product.name} adicionado ao carrinho`, { buttonText: 'Entendido' });
        }catch(error){
            console.error('Error adding to cart:', error);
            showMessageModal('error', 'Erro!', 'Falha ao adicionar ao carrinho', { buttonText: 'Entendido' });
            return;
        }
       

        console.log('Updated cart items:', cartItems);
        
        updateCartDropdown();
        openModal('add-to-cart-modal');
    }

    window.addToCartFromModal = function() {
        const quantity = parseInt(document.getElementById('product-quantity').value);
        const productId = parseInt(document.getElementById('product-detail-modal').dataset.idProduct);
        
        addToCart(productId, quantity);
        closeModal('product-detail-modal');
    };

    async function confirmAddToCart() {
        const productId = parseInt(document.getElementById('add-to-cart-modal').dataset.idProduct || 
                                 localStorage.getItem('lastAddedProductId'));
        const quantity = parseInt(document.getElementById('add-to-cart-modal').querySelector('input[name="quantity"]')?.value || 1);

        console.log('Confirming add to cart - Product ID:', productId, 'Quantity:', quantity);

        if (!productId) {
            console.error('No product ID found for cart addition');
            showMessageModal('error', 'Erro!', 'Nenhum produto selecionado', { buttonText: 'Entendido' });
            return;
        }

        const cartItemData = { idProduct: productId };
        console.log("Adding product to cart via API:", cartItemData);
        const response = await registerCartItem(accessToken, cartItemData);

        if (response.status === 200) {
            console.log("Product successfully added to cart via API:", productId);
            closeModal('add-to-cart-modal');
        } else {
            console.error("Error registering cart item:", response.status, response.error?.message);
            showMessageModal('error', 'Erro!', 'Falha ao adicionar ao carrinho', { buttonText: 'Entendido' });
        }
    }

    // function updateCartCount(quantityToAdd) {
    //     const cartCountElement = document.querySelector('.cart-count');
    //     let currentCount = parseInt(cartCountElement.textContent) || 0;
    //     const newCount = currentCount + quantityToAdd;
    //     console.log('Updating cart count:', currentCount, '->', newCount);
    //     cartCountElement.textContent = newCount > 0 ? newCount : 0;
    // }

    function updateCartDropdown() {
        console.log('Updating cart dropdown');
        const cartDropdown = document.querySelector('.cart-dropdown');
        const cartTotalElement = document.querySelector('.cart-total p');

        if (!cartDropdown || !cartTotalElement) {
            console.warn('Cart dropdown elements not found');
            return;
        }

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

        console.log('Cart total calculated:', total);
      
        cartTotalElement.textContent = `Total: AOA ${total.toFixed(2)}`;
    }

    function removeCartItem(productId) {
        console.log('Removing cart item with ID:', productId);
        const itemIndex = cartItems.findIndex(item => item.id === productId);
        if (itemIndex !== -1) {
            const removedItem = cartItems.splice(itemIndex, 1)[0];
            console.log('Removed item:', removedItem);
            // updateCartCount(-removedItem.quantity);
            updateCartDropdown();
        } else {
            console.warn('Item not found in cart:', productId);
        }
    }

    window.increaseQuantity = function() {
        const input = document.getElementById('product-quantity');
        const newValue = parseInt(input.value) + 1;
        console.log('Increasing quantity:', input.value, '->', newValue);
        input.value = newValue;
    };

    window.decreaseQuantity = function() {
        const input = document.getElementById('product-quantity');
        const currentValue = parseInt(input.value);
        if (currentValue > 1) {
            const newValue = currentValue - 1;
            console.log('Decreasing quantity:', currentValue, '->', newValue);
            input.value = newValue;
        }
    };

    function filterProducts() {
        const searchInput = document.getElementById('search-input').value.toLowerCase().trim();
        const categoryFilter = document.getElementById('category-filter').value;
        const sortFilter = document.getElementById('sort-filter').value;

        console.log('Filtering products - Search:', searchInput, 'Category:', categoryFilter, 'Sort:', sortFilter);

        let filteredProducts = productsData.filter(product => {
            const matchesSearch = (product.name || '').toLowerCase().includes(searchInput) ||
                                 (product.description || '').toLowerCase().includes(searchInput);
            const matchesCategory = categoryFilter === 'all' || (product.category || '').toLowerCase() === categoryFilter;
            return matchesSearch && matchesCategory;
        });

        console.log('Products after search/category filter:', filteredProducts.length);

        if (sortFilter !== 'default') {
            console.log('Applying sort:', sortFilter);
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

    // Event listeners
    document.getElementById('search-input').addEventListener('input', filterProducts);
    document.getElementById('category-filter').addEventListener('change', filterProducts);
    document.getElementById('sort-filter').addEventListener('change', filterProducts);

    // Handle overlay and escape key
    document.querySelector('.overlay').addEventListener('click', function() {
        console.log('Overlay clicked - closing all modals');
        document.querySelectorAll('.modal.active').forEach(modal => closeModal(modal.id));
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            console.log('Escape key pressed - closing all modals');
            document.querySelectorAll('.modal.active').forEach(modal => closeModal(modal.id));
        }
    });

    // Add event listener for confirm button in add-to-cart-modal
    document.getElementById('confirm-add-to-cart')?.addEventListener('click', confirmAddToCart);

    // Initialize the page
    console.log('Starting initialization...');
    await initializeData();
    console.log('Initialization complete');
});