// Funções para manipulação do carrinho
function updateQuantity(button, change) {
    const quantityInput = button.parentElement.querySelector('.quantity-input');
    let newQuantity = parseInt(quantityInput.value) + change;
    
    if (newQuantity < 1) newQuantity = 1;
    
    quantityInput.value = newQuantity;
    updateSubtotal(quantityInput);
    updateCartTotal();
}

function updateSubtotal(quantityInput) {
    const cartItem = quantityInput.closest('.cart-item');
    const priceText = cartItem.querySelector('.cart-item-price').textContent;
    const price = parseFloat(priceText.replace('AOA ', '').replace(',', '.'));
    const quantity = parseInt(quantityInput.value);
    const subtotal = (price * quantity).toFixed(2);
    
    cartItem.querySelector('.cart-item-subtotal').textContent = `AOA ${subtotal.replace('.', ',')}`;
}

function removeItem(button) {
    openModal('remove-item-modal');
    // Armazena a referência do item a ser removido
    window.itemToRemove = button.closest('.cart-item');
}

function confirmRemoveItem() {
    if (window.itemToRemove) {
        window.itemToRemove.remove();
        updateCartTotal();
        updateCartCount(-1);
        closeModal('remove-item-modal');
    }
}

function clearCart() {
    openModal('clear-cart-modal');
}

function confirmClearCart() {
    const cartItems = document.querySelectorAll('.cart-item');
    const itemCount = cartItems.length;
    
    cartItems.forEach(item => item.remove());
    updateCartTotal();
    updateCartCount(-itemCount);
    closeModal('clear-cart-modal');
}

function updateCartTotal() {
    const subtotals = document.querySelectorAll('.cart-item-subtotal');
    let total = 0;
    
    subtotals.forEach(subtotal => {
        const value = parseFloat(subtotal.textContent.replace('AOA ', '').replace(',', '.'));
        total += value;
    });
    
    // Atualiza os totais no resumo (simplificado)
    document.querySelector('.summary-row.total span:last-child').textContent = `AOA ${total.toFixed(2).replace('.', ',')}`;
}

function updateCartCount(change) {
    const cartCountElement = document.querySelector('.cart-count');
    let currentCount = parseInt(cartCountElement.textContent);
    currentCount += change;
    
    if (currentCount < 0) currentCount = 0;
    
    cartCountElement.textContent = currentCount;
    
    // Atualiza o ícone do carrinho no header
    if (currentCount === 0) {
        document.querySelector('.cart-icon').classList.remove('active');
    } else {
        document.querySelector('.cart-icon').classList.add('active');
    }
}

function proceedToCheckout() {
    // Aqui você pode redirecionar para a página de checkout
    alert('Redirecionando para a página de checkout...');
    // window.location.href = 'user-checkout.html';
}

// Funções de modal (pode ser movido para global.js se for usado em várias páginas)
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.querySelector('.overlay').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Fecha o modal ao clicar fora dele
    window.addEventListener('click', function(event) {
        if (event.target === document.querySelector('.overlay')) {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
            document.querySelector('.overlay').style.display = 'none';
        }
    });
    
    // Atualiza o contador do carrinho baseado nos itens presentes
    const cartItemsCount = document.querySelectorAll('.cart-item').length;
    if (cartItemsCount === 0) {
        document.querySelector('.cart-icon').classList.remove('active');
    }
});