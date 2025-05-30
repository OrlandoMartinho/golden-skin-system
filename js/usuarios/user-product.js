// Funções para controlar os modais
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.querySelector('.overlay').classList.add('active');
    document.body.style.overflow = 'hidden'; // Impede scroll da página
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.querySelector('.overlay').classList.remove('active');
    document.body.style.overflow = 'auto'; // Restaura scroll da página
}

// Fechar modal ao clicar no overlay
document.querySelector('.overlay').addEventListener('click', function() {
    document.querySelectorAll('.modal.active').forEach(modal => {
        closeModal(modal.id);
    });
});

// Funções do carrinho
let cartItems = [];

function addToCart(productId, quantity = 1) {
    // Verifica se o produto já está no carrinho
    const existingItem = cartItems.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        // Adiciona novo item ao carrinho
        cartItems.push({
            id: productId,
            quantity: quantity,
            // Aqui você pode adicionar mais detalhes do produto
            name: `Produto ${productId}`,
            price: 89.90 // Exemplo - deveria vir do produto real
        });
    }
    
    updateCartCount(quantity);
    updateCartDropdown();
    openModal('add-to-cart-modal');
}

function addToCartFromModal() {
    const quantity = parseInt(document.getElementById('product-quantity').value);
    const productId = 1; // Isso deveria ser dinâmico, baseado no produto aberto
    
    addToCart(productId, quantity);
    closeModal('product-detail-modal');
}

function updateCartCount(quantityToAdd) {
    const cartCountElement = document.querySelector('.cart-count');
    let currentCount = parseInt(cartCountElement.textContent) || 0;
    const newCount = currentCount + quantityToAdd;
    cartCountElement.textContent = newCount > 0 ? newCount : 0;
}

function updateCartDropdown() {
    const cartDropdown = document.querySelector('.cart-dropdown');
    const cartTotal = document.querySelector('.cart-total p');
    
    // Limpa itens existentes
    cartDropdown.querySelectorAll('.cart-item:not(.cart-total)').forEach(item => item.remove());
    
    // Adiciona novos itens
    let total = 0;
    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="https://via.placeholder.com/50" alt="Produto">
            <div>
                <p>${item.name}</p>
                <small>${item.quantity}x R$ ${item.price.toFixed(2)}</small>
            </div>
            <i class="fas fa-times" onclick="removeCartItem(${item.id})"></i>
        `;
        cartDropdown.insertBefore(itemElement, cartTotal.parentElement);
        total += item.quantity * item.price;
    });
    
    // Atualiza total
    cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
}

function removeCartItem(productId) {
    const itemIndex = cartItems.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        const removedItem = cartItems.splice(itemIndex, 1)[0];
        updateCartCount(-removedItem.quantity);
        updateCartDropdown();
    }
}

// Funções de quantidade
function increaseQuantity() {
    const input = document.getElementById('product-quantity');
    input.value = parseInt(input.value) + 1;
}

function decreaseQuantity() {
    const input = document.getElementById('product-quantity');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// Navegação para o carrinho
function goToCart() {
    // Aqui você pode salvar os itens no localStorage antes de redirecionar
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    window.location.href = 'user-cart.html';
}

// Filtro por categoria
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const category = this.textContent.trim();
        filterProductsByCategory(category);
    });
});

function filterProductsByCategory(category) {
    console.log('Filtrando por categoria:', category);
    // Implemente a lógica real de filtragem aqui
    // Exemplo: esconder/mostrar produtos baseado na categoria
}

// Fechar modais com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Carregar itens do carrinho se existirem no localStorage
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        updateCartCount(0); // Atualiza contagem sem modificar
        updateCartDropdown();
    }
    
    // Configurar event listeners para os botões de detalhes
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function() {
            openModal('product-detail-modal');
            // Aqui você deveria carregar os detalhes do produto específico
        });
    });
});