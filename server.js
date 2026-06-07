const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

// Configura o driver do PG para converter tipos NUMERIC/DECIMAL automaticamente para Float
const pg = require('pg');
pg.types.setTypeParser(1700, val => parseFloat(val));

const app = express();
app.use(cors());
app.use(express.json());

// Configuração da conexão com o Banco de Dados
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'lanchonete_dira',
    port: process.env.DB_PORT || 5432
});

// Garante que a comunicação com o banco use UTF8
pool.on('connect', (client) => {
    client.query("SET client_encoding TO 'UTF8'");
});

// Middleware de Autenticação JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Middleware para verificar se é ADMIN
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') next();
    else res.status(403).json({ error: 'Acesso negado. Requer privilégios de administrador.' });
};

// Servir arquivos estáticos do Frontend
app.use(express.static(path.join(__dirname)));

// Rota raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- ROTAS DE PRODUTOS ---
app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*, c.name as category 
            FROM products p 
            JOIN categories c ON p.category_id = c.id 
            WHERE p.active = true
        `);
        res.json(result.rows.map(p => ({
            ...p,
            price: Number(p.price),
            ingredients: p.ingredients || [],
            image: p.image_url,
            category: p.category.toLowerCase().replace(/\s+/g, '-')
        })));
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/api/products', authenticateToken, isAdmin, async (req, res) => {
    const { category_id, name, description, price, ingredients, image_url } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO products (category_id, name, description, price, ingredients, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [category_id, name, description, price, JSON.stringify(ingredients), image_url]
        );
        const product = result.rows[0];
        res.status(201).json({
            ...product,
            price: Number(product.price),
            ingredients: product.ingredients || []
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para Editar Produto
app.put('/api/products/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { category_id, name, description, price, ingredients, image_url } = req.body;
    try {
        await pool.query(
            'UPDATE products SET category_id = $1, name = $2, description = $3, price = $4, ingredients = $5, image_url = $6 WHERE id = $7',
            [category_id, name, description, price, JSON.stringify(ingredients), image_url, id]
        );
        res.json({ message: 'Produto atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exclusão lógica de produto
app.delete('/api/products/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await pool.query('UPDATE products SET active = false WHERE id = $1', [req.params.id]);
        res.json({ message: 'Produto removido com sucesso (exclusão lógica).' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- ROTAS DE FRETE ---
app.get('/api/shipping', async (req, res) => {
    const { bairro } = req.query;
    try {
        const result = await pool.query('SELECT price FROM shipping_rates WHERE neighborhood = $1', [bairro]);
        if (result.rows.length > 0) res.json(result.rows[0]);
        else res.json({ price: 12.00 });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// --- ROTA DE PERFIL ---
app.get('/api/users/profile', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT name, email, phone, cep, address, number, neighborhood, complement, reference FROM users WHERE id = $1', [req.user.id]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- ROTAS DE AUTENTICAÇÃO ---
app.post('/api/auth/register', async (req, res) => {
    const { name, username, email, password, phone, cep, address, number, neighborhood } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (name, username, email, password, phone, cep, address, number, neighborhood) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [name, username, email, hashedPassword, phone, cep, address, number, neighborhood]
        );
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao cadastrar. E-mail ou usuário já existem.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { identifier, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $2', [identifier, identifier]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Senha incorreta' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        const { password: _, ...userWithoutPassword } = user;
        res.json({ token, user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- ROTA DE PEDIDOS ---
app.post('/api/orders', authenticateToken, async (req, res) => {
    const { cart, subtotal, shippingCost, total } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO orders (user_id, subtotal, shipping_cost, total) VALUES ($1, $2, $3, $4) RETURNING id',
            [req.user.id, subtotal, shippingCost, total]
        );
        const orderId = result.rows[0].id;

        for (const item of cart) {
            await pool.query(
                'INSERT INTO order_items (order_id, product_id, quantity, unit_price, customization) VALUES ($1, $2, $3, $4, $5)',
                [orderId, item.id, item.qty, item.finalPrice, { removed: item.removedIngredients, extras: item.selectedExtras }]
            );
        }
        res.status(201).json({ message: 'Pedido salvo!', orderId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});