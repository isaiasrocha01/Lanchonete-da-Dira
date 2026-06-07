// ============================================
// LANCHONETE DA DIRA - SCRIPT PRINCIPAL
// ============================================

// Inicialização do EmailJS
emailjs.init("xaFurKAu6y-pkVsqe");

// Constantes
const API_URL = "http://localhost:3000/api";
const token = localStorage.getItem('token');

// Variáveis Globais
let currentModalExtras = {};
let products = [];
let cart = [];
let shippingCost = 0;

// Opções de Adicionais
const extraOptions = [
    { name: 'Carne Extra', price: 5.00 },
    { name: 'Queijo Extra', price: 3.00 },
    { name: 'Bacon Extra', price: 4.00 }
];

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
        document.getElementById('bairro').value = bairroApi;

        // Busca frete dinâmico no backend
        const shipRes = await fetch(`${API_URL}/shipping?bairro=${bairroApi}`);
        const shipData = await shipRes.json();
        shippingCost = shipData.price || 12.00;
        
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
async function initMenu() {
    const res = await fetch(`${API_URL}/products`);
    products = await res.json();
    
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user && user.role === 'ADMIN';
    
    products.forEach(product => {
        const container = document.getElementById(product.category);
        if (!container) return;
        const card = document.createElement('div');
        card.className = 'product-card';
        
        let adminButtons = '';
        if (isAdmin) {
            adminButtons = `
                <div style="display: flex; gap: 5px; margin-top: 5px;">
                    <button class="btn-add" onclick="editProduct(${product.id})" style="flex: 1; background: var(--secondary); color: var(--dark);">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-add" onclick="deleteProduct(${product.id})" style="flex: 1; background: #d32f2f;">
                        <i class="fas fa-trash"></i> Deletar
                    </button>
                </div>
            `;
        }
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
            </div>
            <button class="btn-add" onclick="openCustomModal(${product.id})">
                <i class="fas fa-plus"></i> Adicionar
            </button>
            ${adminButtons}
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
        const removidos = item.removedIngredients.length > 0 ? `\n   - REMOVER: ${item.removedIngredientes.join(', ')}` : '';
        const adicionais = item.selectedExtras.length > 0 ? `\n   + EXTRAS: ${item.selectedExtras.map(e => `${e.qty}x ${e.name}`).join(', ')}` : '';
        itensMsg += `* ${item.qty}x ${item.name}${removidos}${adicionais}\n`;
    });

    // Envio de Cópia de Segurança para o E-mail (Anti-Fraude)
    const emailParams = {
        cliente_nome: nome,
        cliente_contato: tel,
        endereco_entrega: `${end}, nº ${num} - ${bairro}`,
        resumo_pedido: itensMsg.replace(/\*/g, ''),
        valor_total: total.toFixed(2),
        destinatario: 'isaiasrocha.dev@outlook.com'
    };

    const SERVICE_ID = "service_ch627pj";
    const TEMPLATE_ID = "template_0sxh2pk";

    emailjs.send(SERVICE_ID, TEMPLATE_ID, emailParams)
        .then(() => console.log("Cópia de segurança enviada ao e-mail com sucesso!"))
        .catch(err => {
            console.error("Erro detalhado do EmailJS:", err);
            alert("Erro no envio do e-mail: " + (err.text || "Verifique os IDs no script.js"));
        });

    fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cart, subtotal, shippingCost, total, addressData: { end, num, bairro } })
    }).then(res => {
        if (res.status === 401 || res.status === 403) {
            alert("Sua sessão expirou. Por favor, faça login novamente.");
            logout();
        }
    }).catch(err => console.error("Erro ao salvar pedido:", err));

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

// Atualizar interface com nome do usuário logado
async function updateAuthUI() {
    const userMenu = document.getElementById('user-menu');
    let user = JSON.parse(localStorage.getItem('user'));
    
    if (user && userMenu) {
        let adminButton = '';
        if (user.role === 'ADMIN') {
            adminButton = `<button onclick="openProductModal()" class="btn-add" style="background: var(--secondary); color: var(--dark); margin-right:10px;">
                    <i class="fas fa-plus"></i> Novo Produto
                </button>`;
        }
        
        userMenu.innerHTML = `
            ${adminButton}
            <span style="color: white; margin-right: 10px;">Olá, ${user.name.split(' ')[0]}</span>
            <button onclick="logout()" class="btn-add" style="margin: 0; padding: 5px 10px; background: var(--dark);">Sair</button>
        `;

        // Preenche automaticamente o formulário de entrega
        if (document.getElementById('nome')) {
            document.getElementById('nome').value = user.name || '';
            document.getElementById('telefone').value = user.phone || '';
            document.getElementById('cep').value = user.cep || '';
            document.getElementById('endereco').value = user.address || '';
            document.getElementById('numero').value = user.number || '';
            document.getElementById('bairro').value = user.neighborhood || '';
            document.getElementById('complemento').value = user.complement || '';
            document.getElementById('referencia').value = user.reference || '';
            
            if (user.neighborhood) buscarCEP();
        }
    }
}

function logout() {
    localStorage.clear();
    window.location.reload();
}

// ===== FUNÇÕES DE GERENCIAMENTO DE PRODUTOS (ADMIN) =====

function openProductModal(id = null) {
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form');
    const titleEl = document.getElementById('product-modal-title');
    
    titleEl.innerText = id ? 'Editar Produto' : 'Novo Produto';
    
    if (id) {
        const product = products.find(p => p.id === id);
        if (!product) {
            alert('Produto não encontrado!');
            return;
        }
        document.getElementById('prod-id').value = product.id;
        document.getElementById('prod-category').value = product.category_id || 1;
        document.getElementById('prod-name').value = product.name;
        document.getElementById('prod-description').value = product.description || '';
        document.getElementById('prod-price').value = product.price;
        document.getElementById('prod-ingredients').value = Array.isArray(product.ingredients) ? product.ingredients.join(', ') : '';
        document.getElementById('prod-image').value = product.image || '';
    } else {
        form.reset();
        document.getElementById('prod-id').value = '';
    }
    
    modal.style.display = 'block';
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
}

function editProduct(id) {
    openProductModal(id);
}

async function saveProduct() {
    const id = document.getElementById('prod-id').value;
    const productData = {
        category_id: parseInt(document.getElementById('prod-category').value),
        name: document.getElementById('prod-name').value,
        description: document.getElementById('prod-description').value,
        price: parseFloat(document.getElementById('prod-price').value),
        ingredients: document.getElementById('prod-ingredients').value
            .split(',')
            .map(i => i.trim())
            .filter(i => i !== ''),
        image_url: document.getElementById('prod-image').value
    };

    if (!productData.name || !productData.price || !productData.category_id) {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/products/${id}` : `${API_URL}/products`;

    try {
        const res = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });

        if (res.ok) {
            alert(id ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
            closeProductModal();
            location.reload();
        } else {
            const error = await res.json();
            alert(`Erro: ${error.error || 'Erro ao salvar produto'}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao salvar produto: ' + error.message);
    }
}

async function deleteProduct(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (res.ok) {
            alert('Produto excluído com sucesso!');
            location.reload();
        } else {
            const error = await res.json();
            alert(`Erro: ${error.error || 'Erro ao excluir produto'}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir produto: ' + error.message);
    }
}

// Inicialização
(async () => {
    await initMenu();
    await updateAuthUI();

    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveProduct();
        });
    }
})();