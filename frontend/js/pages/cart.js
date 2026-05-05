window.addEventListener('DOMContentLoaded', () => {
    createNav('cart');
    renderCart();
});

function renderCart() {
    const cartItems = getCart();
    const container = document.getElementById('cart-items');
    const summary = document.getElementById('cart-summary');
    const emptyMessage = document.getElementById('cart-empty');

    if (!container || !summary || !emptyMessage) return;
    container.innerHTML = '';
    summary.innerHTML = '';

    if (cartItems.length === 0) {
        emptyMessage.style.display = 'block';
        summary.style.display = 'none';
        return;
    }

    emptyMessage.style.display = 'none';
    summary.style.display = 'block';

    let totalAmount = 0;

    cartItems.forEach(item => {
        totalAmount += item.prix * item.quantity;
        const row = document.createElement('div');
        row.className = 'cart-row';
        const image = item.selectedImage || item.image || item.images?.[0] || 'https://via.placeholder.com/140x100?text=Jeu';
        const version = item.selectedVersion || item.version || item.caracteristiques?.plateformes?.[0] || 'Standard';
        row.innerHTML = `
            <img src="${image}" alt="${item.nom}" onerror="this.src='https://via.placeholder.com/140x100?text=Image+manquante'">
            <div class="cart-details">
                <a href="product.html?id=${encodeURIComponent(item.id)}"><h3>${item.nom}</h3></a>
                <p>${item.prix.toFixed(2)} ${item.devise}</p>
                <p class="cart-version">Version : ${version}</p>
                <div class="cart-quantity">
                    <label>Quantité</label>
                    <input type="number" min="1" max="99" value="${item.quantity}" data-id="${item.id}">
                </div>
            </div>
            <button type="button" class="button button-secondary button-small" data-remove="${item.id}">Supprimer</button>
        `;
        container.appendChild(row);
        row.querySelector('input')?.addEventListener('change', event => {
            const value = Number(event.target.value);
            updateCartQuantity(item.id, value);
            renderCart();
        });
        row.querySelector('[data-remove]')?.addEventListener('click', () => {
            removeFromCart(item.id);
            renderCart();
        });
    });

    summary.innerHTML = `
        <div class="cart-summary-card">
            <h2>Récapitulatif</h2>
            <p>Total : <strong>${totalAmount.toFixed(2)} €</strong></p>
            <a class="button button-primary" href="catalog.html">Continuer mes achats</a>
        </div>
    `;
}
