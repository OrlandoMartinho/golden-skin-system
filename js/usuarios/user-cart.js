async function fetchCartItems(accessToken, idCart) {
    try {
        if (!accessToken || !idCart) {
            throw new Error("Missing accessToken or idCart");
        }
        console.log("Requesting cart items from:", `${api_host}/api/cart-products/${idCart}`);
        const response = await fetch(`${api_host}/api/cart-products`, {
            headers: { 'token': accessToken }
        });
        const data = await response.json();
        console.log("Response status:", response.status, "data:", data);

        if (response.ok && Array.isArray(data)) {
            return { status: response.status, data };
        }
        console.warn("Error fetching cart items:", response.status, data.message);
        return { status: response.status, error: data };
    } catch (error) {
        console.error("Error in fetchCartItems:", error.message, error.stack);
        return { status: 500, error: { message: "Internal server error" } };
    }
}

async function registerAnyCartItem(accessToken, cartItemData) {
    try {
        const { idProduct } = cartItemData;
        if (!Number.isInteger(idProduct) || idProduct <= 0) {
            throw new Error("ID Product must be a positive integer");
        }
        const url = `${api_host}/api/cart-products/register`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': accessToken
            },
            body: JSON.stringify({ idProduct })
        });
        const result = await response.json();
        if (response.ok) {
            return { status: response.status, data: result };
        }
        console.warn("Error registering cart item:", response.status, result.message);
        return { status: response.status, error: result };
    } catch (error) {
        console.error("Error in registerCartItem:", error.message, error.stack);
        return { status: 500, error: { message: error.message || "Internal server error" } };
    }
}

async function deleteCartItem(accessToken, idCart, idProduct, reduceQuantity = false, newQuantity = 0) {
    try {
        const url = `${api_host}/api/cart-products`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'token': accessToken
            },
            body: JSON.stringify({ idCart, idProduct })
        });
        const result = await response.json();
        if (response.ok) {
            if (reduceQuantity && newQuantity > 0) {
                for (let i = 0; i < newQuantity; i++) {
                    const addResponse = await registerAnyCartItem(accessToken, { idProduct });
                    if (addResponse.status !== 200) {
                        console.warn("Error re-adding item:", addResponse.status, addResponse.error?.message);
                        return addResponse;
                    }
                }
            }
            return { status: response.status, data: result };
        }
        console.warn("Error deleting cart item:", response.status, result.message);
        return { status: response.status, error: result };
    } catch (error) {
        console.error("Error in deleteCartItem:", error.message, error.stack);
        return { status: 500, error: { message: "Internal server error" } };
    }
}

async function getProduct(accessToken, idProduct) {
    try {
        console.log("Fetching product with idProduct:", idProduct);
        const url = `${api_host}/api/products/${Number(idProduct)}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': accessToken
            }
        });
        const result = await response.json();
        if (response.ok) {
            return { status: response.status, data: result };
        }
        console.warn("Error getting product:", response.status, result.message);
        return { status: response.status, error: result };
    } catch (error) {
        console.error("Error in getProduct:", error.message, error.stack);
        return { status: 500, error: { message: "Internal server error" } };
    }
}

function removeItem(button) {
    try {
        window.itemToRemove = button.closest('.cart-item');
        if (!window.itemToRemove) {
            throw new Error("Cart item not found");
        }
        openModal('remove-item-modal');
        console.log("Item marked for removal:", window.itemToRemove.dataset.idProduct);
    } catch (error) {
        console.error("Error in removeItem:", error.message, error.stack);
        showMessageModal('error', 'Erro!', 'Falha ao marcar item para remoção', { buttonText: 'Entendido' });
    }
}

async function confirmRemoveItem(accessToken, idCart) {
    try {
        if (!window.itemToRemove) {
            throw new Error("No item selected for removal");
        }
        const idProduct = parseInt(window.itemToRemove.dataset.idProduct);
        const quantityElement = window.itemToRemove.querySelector('.cart-item-quantity');
        let currentQuantity = parseInt(quantityElement.dataset.quantity);

        if (!idProduct || !quantityElement) {
            throw new Error("Invalid product ID or quantity element");
        }

        if (currentQuantity > 1) {
            const response = await deleteCartItem(accessToken, idCart, idProduct, true, currentQuantity - 1);
            if (response.status === 200) {
                currentQuantity--;
                quantityElement.dataset.quantity = currentQuantity;
                quantityElement.textContent = `Quantidade: ${currentQuantity}`;
                const priceElement = window.itemToRemove.querySelector('.cart-item-price');
                const price = parseFloat(priceElement.textContent.replace('AOA ', '').replace(',', '.'));
                const subtotalElement = window.itemToRemove.querySelector('.cart-item-subtotal');
                subtotalElement.textContent = `AOA ${(price * currentQuantity).toFixed(2).replace('.', ',')}`;
                updateCartSummary();
                updateCartCount();
                closeModal('remove-item-modal');
                console.log("Quantity reduced for product:", idProduct, "to", currentQuantity);
            } else {
                console.warn("Error reducing quantity:", response.status, response.error?.message);
                showMessageModal('error', 'Erro!', 'Falha ao reduzir quantidade', { buttonText: 'Entendido' });
            }
        } else {
            const response = await deleteCartItem(accessToken, idCart, idProduct);
            if (response.status === 200) {
                window.itemToRemove.remove();
                updateCartCount();
                updateCartSummary();
                closeModal('remove-item-modal');
                await initializeCart(accessToken, idCart);
                console.log("Item removed:", idProduct);
            } else {
                console.warn("Error removing item:", response.status, response.error?.message);
                showMessageModal('error', 'Erro!', 'Falha ao remover item', { buttonText: 'Entendido' });
            }
        }
    } catch (error) {
        console.error("Error in confirmRemoveItem:", error.message, error.stack);
        showMessageModal('error', 'Erro!', 'Falha ao remover item', { buttonText: 'Entendido' });
    }
}

function clearCart() {
    try {
        openModal('clear-cart-modal');
        console.log("Clear cart modal opened.");
    } catch (error) {
        console.error("Error in clearCart:", error.message, error.stack);
        showMessageModal('error', 'Erro!', 'Falha ao abrir modal de limpeza', { buttonText: 'Entendido' });
    }
}

async function confirmClearCart(accessToken, idCart) {
    try {
        const items = document.querySelectorAll('.cart-item');
        let errors = [];
        for (let item of items) {
            const idProduct = parseInt(item.dataset.idProduct);
            const response = await deleteCartItem(accessToken, idCart, idProduct);
            if (response.status !== 200) {
                errors.push(`Error deleting item ${idProduct}: ${response.error?.message}`);
            }
        }
        if (errors.length === 0) {
            items.forEach(item => item.remove());
            updateCartCount();
            updateCartSummary();
            closeModal('clear-cart-modal');
            await initializeCart(accessToken, idCart);
            console.log("Cart cleared successfully.");
        } else {
            console.warn("Errors clearing cart:", errors);
            showMessageModal('error', 'Erro!', 'Falha ao limpar alguns itens do carrinho', { buttonText: 'Entendido' });
        }
    } catch (error) {
        console.error("Error in confirmClearCart:", error.message, error.stack);
        showMessageModal('error', 'Erro!', 'Falha ao limpar o carrinho', { buttonText: 'Entendido' });
    }
}

function updateCartSummary() {
    try {
        const subtotals = document.querySelectorAll('.cart-item-subtotal');
        let subtotal = 0;
        subtotals.forEach(subtotalElement => {
            const value = parseFloat(subtotalElement.textContent.replace('AOA ', '').replace(',', '.'));
            if (!isNaN(value)) {
                subtotal += value;
            }
        });
        const shipping = 15.00;
        const total = subtotal + shipping;
        document.getElementById('subtotal').textContent = `AOA ${subtotal.toFixed(2).replace('.', ',')}`;
        document.getElementById('total').textContent = `AOA ${total.toFixed(2).replace('.', ',')}`;
    } catch (error) {
        console.error("Error in updateCartSummary:", error.message, error.stack);
    }
}

function updateCartCount() {
    try {
        const cartCountElement = document.getElementById('cart-count');
        const itemCountElement = document.getElementById('item-count');
        const cartIcon = document.querySelector('.cart-icon');
        if (!cartCountElement || !itemCountElement || !cartIcon) {
            throw new Error("Cart count elements not found");
        }
        const count = document.querySelectorAll('.cart-item').length;
        cartCountElement.textContent = count;
        itemCountElement.textContent = `(${count} itens)`;
        cartIcon.classList.toggle('active', count > 0);
    } catch (error) {
        console.error("Error in updateCartCount:", error.message, error.stack);
    }
}

async function proceedToCheckout(accessToken, cartItems) {
    try {
        if (!cartItems || cartItems.length === 0) {
            showMessageModal('error', 'Erro!', 'O carrinho está vazio', { buttonText: 'Entendido' });
            return;
        }
        const response = await addAnyShopping(accessToken);
        console.log("Proceeding to checkout with response:", response);
        if (response.status === 200) {
            showMessageModal('success', 'Sucesso!', 'Compra realizada com sucesso!', { buttonText: 'Entendido' });
        } else {
            console.warn("Error in checkout:", response.status, response.error?.message);
            showMessageModal('error', 'Erro!', 'Falha ao realizar a compra', { buttonText: 'Entendido' });
        }
    } catch (error) {
        console.error("Error in proceedToCheckout:", error.message, error.stack);
        showMessageModal('error', 'Erro!', 'Falha ao realizar a compra', { buttonText: 'Entendido' });
    }
}

window.openModal = function(modalId) {
    try {
        const modal = document.getElementById(modalId);
        const overlay = document.querySelector('.overlay');
        if (!modal || !overlay) {
            throw new Error("Modal or overlay not found");
        }
        modal.style.display = 'block';
        overlay.style.display = 'block';
    } catch (error) {
        console.error("Error in openModal:", error.message, error.stack);
    }
};

window.closeModal = function(modalId) {
    try {
        const modal = document.getElementById(modalId);
        const overlay = document.querySelector('.overlay');
        if (!modal || !overlay) {
            throw new Error("Modal or overlay not found");
        }
        modal.style.display = 'none';
        overlay.style.display = 'none';
    } catch (error) {
        console.error("Error in closeModal:", error.message, error.stack);
    }
};

window.addEventListener('click', function(event) {
    try {
        if (event.target === document.querySelector('.overlay')) {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
            document.querySelector('.overlay').style.display = 'none';
        }
    } catch (error) {
        console.error("Error in overlay click handler:", error.message, error.stack);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const accessToken = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const idCart = user.Carts?.idCart || 0;
    let cartItems = [];

    if (!accessToken || !idCart) {
        showMessageModal('error', 'Erro!', 'Usuário não autenticado ou carrinho não encontrado', { buttonText: 'Entendido' });
        return;
    }

    async function initializeCart() {
        try {
            const response = await fetchCartItems(accessToken, idCart);
            if (response.status === 200 && Array.isArray(response.data)) {
                cartItems = response.data.reduce((acc, item) => {
                    const existing = acc.find(i => i.idProduct === item.idProduct);
                    if (existing) {
                        existing.quantity = (existing.quantity || 1) + 1;
                    } else {
                        acc.push({ ...item, quantity: 1 });
                    }
                    return acc;
                }, []);
                populateCartItems(cartItems);
                updateCartSummary();
                updateCartCount();
                console.log("Cart initialized with", cartItems.length, "items.");
            } else {
                console.warn("Error initializing cart:", response.status, response.error?.message);
                showMessageModal('error', 'Erro!', 'Falha ao carregar o carrinho', { buttonText: 'Entendido' });
            }
        } catch (error) {
            console.error("Error in initializeCart:", error.message, error.stack);
            showMessageModal('error', 'Erro!', 'Falha ao carregar o carrinho', { buttonText: 'Entendido' });
        }
    }

    function populateCartItems(items) {
        const container = document.getElementById('cart-items');
        if (!container) {
            console.error("Cart items container not found");
            return;
        }
        container.innerHTML = '';
        if (items.length === 0) {
            container.innerHTML = '<p>O carrinho está vazio.</p>';
            return;
        }
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.dataset.idProduct = item.idProduct;
            div.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.productPhoto || '../../assets/img/placeholder.png'}" alt="${item.productName}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.productName}</h3>
                    <div class="cart-item-price">AOA ${(item.priceInCents / 100).toFixed(2).replace('.', ',')}</div>
                    <div class="cart-item-quantity" data-quantity="${item.quantity}">Quantidade: ${item.quantity}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-btn" onclick="removeItem(this)">
                        <i class="fas fa-trash"></i> Remover
                    </button>
                    <div class="cart-item-subtotal">AOA ${(item.priceInCents / 100 * item.quantity).toFixed(2).replace('.', ',')}</div>
                </div>
            `;
            container.appendChild(div);
        });
        document.getElementById('item-count').textContent = `(${items.length} itens)`;
    }

    document.querySelector('.clear-cart').addEventListener('click', () => clearCart());
    document.querySelector('.checkout-btn').addEventListener('click', () => proceedToCheckout(accessToken, cartItems));
    document.querySelector('#remove-item-modal .confirm').addEventListener('click', () => confirmRemoveItem(accessToken, idCart));
    document.querySelector('#clear-cart-modal .confirm').addEventListener('click', () => confirmClearCart(accessToken, idCart));

    await initializeCart();
});