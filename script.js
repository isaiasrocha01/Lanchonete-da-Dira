// Dados dos Produtos
const products = [
    { id: 1, category: 'hamburgueres', name: 'X-Burger', price: 12.00, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80', ingredients: ['Pão', 'Carne', 'Queijo'] },
    { id: 2, category: 'hamburgueres', name: 'X-Salada', price: 15.00, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300&q=80', ingredients: ['Pão', 'Carne', 'Queijo', 'Alface', 'Tomate', 'Maionese'] },
    { id: 3, category: 'hamburgueres', name: 'X-Bacon', price: 18.00, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=300&q=80', ingredients: ['Pão', 'Carne', 'Queijo', 'Bacon'] },
    { id: 4, category: 'hamburgueres', name: 'X-Tudo', price: 22.00, image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=300&q=80', ingredients: ['Pão', 'Carne', 'Queijo', 'Bacon', 'Ovo', 'Alface', 'Tomate', 'Milho', 'Presunto'] },
     
    // Refri Lata
    { id: 5, category: 'bebidas-lata', name: 'Coca-Cola Lata', price: 6.00, image: 'img/coca-lata.jpg' },
    { id: 6, category: 'bebidas-lata', name: 'Coca-Cola Zero Lata', price: 6.00, image: 'img/coca-zero-lata.jpg' },
    { id: 7, category: 'bebidas-lata', name: 'Guaraná Antarctica Lata', price: 6.00, image: 'img/guarana-lata.jpg' },
    { id: 8, category: 'bebidas-lata', name: 'Guaraná Zero Lata', price: 6.00, image: 'img/guarana-zero-lata.jpg' },
    { id: 9, category: 'bebidas-lata', name: 'Fanta Laranja Lata', price: 6.00, image: 'img/fanta-laranja-lata.jpg' },
    { id: 10, category: 'bebidas-lata', name: 'Fanta Uva Lata', price: 6.00, image: 'img/fanta-uva-lata.jpg' },
    { id: 11, category: 'bebidas-lata', name: 'Sprite Lata', price: 6.00, image: 'img/sprite-lata.jpg' },
    { id: 12, category: 'bebidas-lata', name: 'Pepsi Lata', price: 6.00, image: 'img/pepsi-lata.jpg' },
    { id: 13, category: 'bebidas-lata', name: 'Sukita Lata', price: 6.00, image: 'img/sukita-lata.jpg' },

    // Refri 1L
    { id: 14, category: 'bebidas-1l', name: 'Coca-Cola 1L', price: 9.00, image: 'img/coca-1l.jpg' },
    { id: 15, category: 'bebidas-1l', name: 'Coca-Cola Zero 1L', price: 9.00, image: 'img/coca-zero-1l.jpg' },
    { id: 16, category: 'bebidas-1l', name: 'Guaraná Antarctica 1L', price: 8.00, image: 'img/guarana-1l.jpg' },
    { id: 17, category: 'bebidas-1l', name: 'Fanta Laranja 1L', price: 8.00, image: 'img/fanta-laranja-1l.jpg' },

    // Refri 2L
    { id: 18, category: 'bebidas-2l', name: 'Coca-Cola 2L', price: 13.00, image: 'img/coca-2l.jpg' },
    { id: 19, category: 'bebidas-2l', name: 'Guaraná Antarctica 2L', price: 11.00, image: 'img/guarana-2l.jpg' },
    { id: 20, category: 'bebidas-2l', name: 'Energético 2L', price: 15.00, image: 'img/energetico-2l.jpg' },

    // Águas
    { id: 21, category: 'aguas', name: 'Água Mineral sem gás 500ml', price: 3.00, image: 'img/agua.jpg' },
    { id: 22, category: 'aguas', name: 'Água Mineral com gás 500ml', price: 4.00, image: 'img/agua-gas.jpg' },
    { id: 23, category: 'aguas', name: 'Água de Coco', price: 6.00, image: 'img/agua-coco.jpg' },

    // Sucos
    { id: 24, category: 'sucos', name: 'Suco de Laranja', price: 8.00, image: 'img/suco-laranja.jpg' },
    { id: 25, category: 'sucos', name: 'Suco de Maracujá', price: 8.00, image: 'img/suco-maracuja.jpg' },
    { id: 26, category: 'sucos', name: 'Suco Detox', price: 10.00, image: 'img/suco-detox.jpg' },

    // Vitaminas
    { id: 27, category: 'vitaminas', name: 'Vitamina de Banana', price: 10.00, image: 'img/vitamina-banana.jpg' },
    { id: 28, category: 'vitaminas', name: 'Vitamina de Morango', price: 12.00, image: 'img/vitamina-morango.jpg' },

    // Cafés
    { id: 29, category: 'cafes', name: 'Café sem Leite', price: 3.00, image: 'img/cafe.jpg' },
    { id: 30, category: 'cafes', name: 'Café com Leite', price: 4.50, image: 'img/cafe-leite.jpg' },

    // Cremosas
    { id: 31, category: 'cremosas', name: 'Chocolate Quente', price: 8.00, image: 'img/chocolate-quente.jpg' },
    { id: 32, category: 'cremosas', name: 'Achocolatado Gelado', price: 7.00, image: 'img/achocolatado-gelado.jpg' },

    { id: 33, category: 'porcoes', name: 'Batata Frita P', price: 12.00, image: 'img/batata-frita.jpg', ingredients: ['Sal', 'Ketchup', 'Maionese'] },
    { id: 34, category: 'porcoes', name: 'Batata Frita M', price: 18.00, image: 'img/batata-frita.jpg', ingredients: ['Sal', 'Ketchup', 'Maionese'] },
    { id: 35, category: 'porcoes', name: 'Batata Frita G', price: 25.00, image: 'img/batata-frita.jpg', ingredients: ['Sal', 'Ketchup', 'Maionese'] },
];

// Opções de Adicionais com Preços
const extraOptions = [
    { name: 'Carne Extra', price: 5.00 },
    { name: 'Queijo Extra', price: 3.00 },
    { name: 'Bacon Extra', price: 4.00 },
];

let cart = [];
let shippingCost = 0;
let currentModalExtras = {}; // Armazena temporariamente os extras do modal aberto

// Tabela de preços de frete por bairro
const neighborhoodPrices = {
    'Centro': 5.00,
    'Liberdade': 7.00,
    'Cajazeiras': 10.00,
    'Outros': 12.00
};

// Função para buscar o endereço via CEP (API ViaCEP)
async function buscarCEP() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        return; // Não processa se o CEP estiver incompleto
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            alert('CEP não encontrado. Por favor, preencha manualmente.');
            return;
        }

        // Preenche os campos automaticamente
        document.getElementById('endereco').value = data.logradouro || '';
        const bairroApi = data.bairro || '';

        // Define o custo do frete baseado no bairro retornado
        shippingCost = neighborhoodPrices[bairroApi] || neighborhoodPrices['Outros'];
        document.getElementById('bairro').value = bairroApi;
        document.getElementById('frete-info').value = `Frete: R$ ${shippingCost.toFixed(2).replace('.', ',')}`;

        renderCart(); // Atualiza o total com o novo frete
    } catch (error) {
        console.error('Erro ao buscar o CEP:', error);
    }
}

// Função para alterar quantidade de extras no modal
function changeExtraQty(extraName, delta) {
    const qtySpan = document.getElementById(`extra-qty-${extraName}`);
    if (!qtySpan) return;
    
    let currentQty = currentModalExtras[extraName] || 0;
    currentQty = Math.max(0, currentQty + delta);
    
    currentModalExtras[extraName] = currentQty;
    qtySpan.innerText = currentQty;
}

// Inicializar Menu
function initMenu() {
    products.forEach(product => {
        const container = document.getElementById(product.category);
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
            </div>
            <button class="btn-add" onclick="openCustomModal(${product.id})">
                <i class="fas fa-plus"></i> Adicionar
            </button>
        `;
        container.appendChild(card);
    });
}

// Abrir modal de personalização
function openCustomModal(id) {
    const product = products.find(p => p.id === id);
    const modal = document.getElementById('custom-modal');
    const ingredientsContainer = document.getElementById('custom-ingredients-list');
    const extrasContainer = document.getElementById('custom-extras-list');
    
    document.getElementById('custom-product-name').innerText = product.name;
    ingredientsContainer.innerHTML = '';
    extrasContainer.innerHTML = '';

    // Renderiza ingredientes padrão (para remover)
    if (product.ingredients) {
        product.ingredients.forEach(ing => {
            ingredientsContainer.innerHTML += `
                <label class="ingredient-item">
                    <input type="checkbox" checked value="${ing}" class="standard-ing"> ${ing}
                </label>
            `;
        });
    } else {
        ingredientsContainer.innerHTML = '<p>Item sem ingredientes padrão.</p>';
    }

    // Renderiza Adicionais (apenas para hambúrgueres ou conforme regra de negócio)
    if (product.category === 'hamburgueres') {
        document.getElementById('extras-title').style.display = 'block';
        currentModalExtras = {}; // Reset
        extraOptions.forEach(extra => {
            currentModalExtras[extra.name] = 0;
            extrasContainer.innerHTML += `
                <div class="ingredient-item extra">
                    <div style="flex: 1;">
                        <span>${extra.name}</span><br>
                        <small>+ R$ ${extra.price.toFixed(2)}</small>
                    </div>
                    <div class="qty-controls">
                        <button class="qty-btn" type="button" onclick="changeExtraQty('${extra.name}', -1)">-</button>
                        <span id="extra-qty-${extra.name}">0</span>
                        <button class="qty-btn" type="button" onclick="changeExtraQty('${extra.name}', 1)">+</button>
                    </div>
                </div>
            `;
        });
    } else {
        document.getElementById('extras-title').style.display = 'none';
    }

    modal.style.display = 'block';
    modal.dataset.productId = id;
}

function closeCustomModal() {
    document.getElementById('custom-modal').style.display = 'none';
}

// Adicionar ao carrinho com as escolhas
function confirmAddToCart() {
    const id = parseInt(document.getElementById('custom-modal').dataset.productId);
    const product = products.find(p => p.id === id);
    
    // Pega ingredientes mantidos e extras adicionados
    const keptIngredients = Array.from(document.querySelectorAll('.standard-ing:checked')).map(i => i.value);
    const removedIngredients = product.ingredients ? product.ingredients.filter(i => !keptIngredients.includes(i)) : [];
    
    // Processa os extras selecionados (apenas os com qty > 0)
    const selectedExtras = [];
    for (const [name, qty] of Object.entries(currentModalExtras)) {
        if (qty > 0) {
            const opt = extraOptions.find(o => o.name === name);
            selectedExtras.push({ name, price: opt.price, qty });
        }
    }

    const extrasTotal = selectedExtras.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
    
    // Assinatura única baseada nas alterações para não agrupar itens com customizações diferentes
    const itemSignature = `${id}|R:${removedIngredients.join(',')}|E:${selectedExtras.map(e => `${e.qty}x${e.name}`).join(',')}`;

    const existing = cart.find(item => item.signature === itemSignature);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ 
            ...product, 
            qty: 1, 
            finalPrice: product.price + extrasTotal,
            removedIngredients,
            selectedExtras,
            signature: itemSignature 
        });
    }
    
    closeCustomModal();
    renderCart();
}

// Alterar quantidade
function changeQty(index, delta) {
    if (cart[index]) {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
    }
    renderCart();
}

// Renderizar HTML do Carrinho
function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping-price');
    const totalEl = document.getElementById('total-price');

    cartCount.innerText = cart.reduce((acc, i) => acc + i.qty, 0);

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>O carrinho está vazio...</p>';
        subtotalEl.innerText = 'R$ 0,00';
        totalEl.innerText = 'R$ 0,00';
        return;
    }

    cartContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong><br>
                ${item.removedIngredients.length > 0 ? `<small style="color:red">Sem: ${item.removedIngredients.join(', ')}</small><br>` : ''}
                ${item.selectedExtras.length > 0 ? `<small style="color:green">Extras: ${item.selectedExtras.map(e => `${e.qty}x ${e.name}`).join(', ')}</small><br>` : ''}
                <strong>R$ ${item.finalPrice.toFixed(2)}</strong>
            </div>
            <div class="qty-controls">
                <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
            </div>
        </div>
    `).join('');

    const subtotal = cart.reduce((acc, i) => acc + (i.finalPrice * i.qty), 0);
    subtotalEl.innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    shippingEl.innerText = `R$ ${shippingCost.toFixed(2).replace('.', ',')}`;
    totalEl.innerText = `R$ ${(subtotal + shippingCost).toFixed(2).replace('.', ',')}`;
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

// Finalizar Pedido e Enviar WhatsApp
function finishOrder() {
    // Validação Simples
    const campos = ['nome', 'telefone', 'endereco', 'numero', 'bairro'];
    for (let campo of campos) {
        if (!document.getElementById(campo).value) {
            alert('Por favor, preencha todos os dados de entrega!');
            return;
        }
    }

    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    // Coleta dados
    const nome = document.getElementById('nome').value;
    const tel = document.getElementById('telefone').value;
    const end = document.getElementById('endereco').value;
    const num = document.getElementById('numero').value;
    const bairro = document.getElementById('bairro').value;
    const comp = document.getElementById('complemento').value || 'N/A';
    const ref = document.getElementById('referencia').value || 'N/A';

    const subtotal = cart.reduce((acc, i) => acc + (i.finalPrice * i.qty), 0);
    const total = subtotal + shippingCost;

    // Formata itens do pedido
    let itensMsg = '';
    cart.forEach(item => {
        const removidos = item.removedIngredients.length > 0 ? `\n   - REMOVER: ${item.removedIngredients.join(', ')}` : '';
        const adicionais = item.selectedExtras.length > 0 ? `\n   + EXTRAS: ${item.selectedExtras.map(e => `${e.qty}x ${e.name}`).join(', ')}` : '';
        itensMsg += `* ${item.qty}x ${item.name}${removidos}${adicionais}\n`;
    });

    // Monta a mensagem (EncodeURIComponent cuida dos espaços e quebras de linha)
    const mensagem = encodeURIComponent(
`🍔 *NOVO PEDIDO - LANCHONETE DA DIRA*

👤 *Cliente:*
${nome}

📞 *Telefone:*
${tel}

📍 *Endereço:*
${end}, nº ${num}
Bairro: ${bairro}
Comp: ${comp}
Ref: ${ref}

🛒 *Pedido:*
${itensMsg}
💰 *Subtotal:* R$ ${subtotal.toFixed(2)}
🚚 *Frete:* R$ ${shippingCost.toFixed(2)}
💵 *Total:* R$ ${total.toFixed(2)}

Obrigado!`);

    const whatsappUrl = `https://wa.me/5571987792252?text=${mensagem}`;
    window.open(whatsappUrl, '_blank');
}

// Inicialização
initMenu();
