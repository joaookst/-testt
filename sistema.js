"use strict";
const cart = [];
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Elemento obrigatório não encontrado: #${id}`);
    }
    return element;
}
function renderCart() {
    const itemsElement = getElement("cart-items");
    const countElement = getElement("cart-count");
    const totalElement = getElement("cart-total");
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    countElement.textContent = String(totalItems);
    countElement.classList.toggle("visible", totalItems > 0);
    totalElement.textContent = currency.format(totalPrice);
    if (cart.length === 0) {
        itemsElement.innerHTML = "<p class=\"empty-cart\">Seu carrinho está vazio.<br>Escolha um hambúrguer para começar!</p>";
        return;
    }
    itemsElement.innerHTML = cart.map((item) => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${currency.format(item.price)}</div>
            </div>
            <div class="quantity-controls">
                <button type="button" data-action="decrease" data-id="${item.id}" aria-label="Diminuir ${item.name}">−</button>
                <strong>${item.quantity}</strong>
                <button type="button" data-action="increase" data-id="${item.id}" aria-label="Aumentar ${item.name}">+</button>
            </div>
        </div>
    `).join("");
}
function addToCart(product) {
    const item = cart.find((cartItem) => cartItem.id === product.id);
    if (item) {
        item.quantity += 1;
    }
    else {
        cart.push({ ...product, quantity: 1 });
    }
    renderCart();
}
function changeQuantity(id, amount) {
    const itemIndex = cart.findIndex((cartItem) => cartItem.id === id);
    if (itemIndex === -1) {
        return;
    }
    cart[itemIndex].quantity += amount;
    if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
    }
    renderCart();
}
function setCartOpen(open) {
    const panel = getElement("cart-panel");
    const overlay = getElement("cart-overlay");
    const toggle = getElement("cart-toggle");
    panel.classList.toggle("open", open);
    overlay.classList.toggle("visible", open);
    panel.setAttribute("aria-hidden", String(!open));
    toggle.setAttribute("aria-expanded", String(open));
}
document.querySelectorAll(".add-button").forEach((button) => {
    button.addEventListener("click", () => {
        const card = button.closest(".menu-card");
        if (!card || !card.dataset.id || !card.dataset.name || !card.dataset.price) {
            return;
        }
        addToCart({
            id: card.dataset.id,
            name: card.dataset.name,
            price: Number(card.dataset.price),
        });
        setCartOpen(true);
    });
});
getElement("cart-items").addEventListener("click", (event) => {
    const target = event.target;
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (action && id) {
        changeQuantity(id, action === "increase" ? 1 : -1);
    }
});
getElement("cart-toggle").addEventListener("click", () => setCartOpen(true));
getElement("close-cart").addEventListener("click", () => setCartOpen(false));
getElement("cart-overlay").addEventListener("click", () => setCartOpen(false));
getElement("checkout-button").addEventListener("click", () => {
    if (cart.length === 0) {
        window.alert("Adicione pelo menos um item ao carrinho.");
        return;
    }
    window.alert("Pedido recebido! Em breve entraremos em contato para confirmar.");
});
renderCart();
