import express from 'express';
import db from './database.js';

const app = express();
const PORT = 3000;

app.use(express.json());

/* GET com filtro */
app.get('/api/produtos', (req, res) => {
    try {
        const {
            nome,
            tipo,
            funcionamento,
            pais,
            minPreco,
            maxPreco,
            id,
            ordem,
            page = 1,
            limit = 10
        } = req.query;

        let query = 'SELECT * FROM produtos WHERE 1=1';
        const params = [];

        if (id) {
            query += ' AND id = ?';
            params.push(id);
        }

        if (nome) {
            query += ' AND nome LIKE ?';
            params.push(`%${nome}%`);
        }

        if (tipo) {
            query += ' AND tipo = ?';
            params.push(tipo);
        }

        if (funcionamento) {
            query += ' AND funcionamento = ?';
            params.push(funcionamento);
        }

        if (pais) {
            query += ' AND LOWER(pais) = LOWER(?)';
            params.push(pais);
        }

        if (minPreco) {
            query += ' AND preco >= ?';
            params.push(Number(minPreco));
        }

        if (maxPreco) {
            query += ' AND preco <= ?';
            params.push(Number(maxPreco));
        }

        if (ordem === 'asc') {
            query += ' ORDER BY preco ASC';
        } else if (ordem === 'desc') {
            query += ' ORDER BY preco DESC';
        }

        const offset = (page - 1) * limit;

        query += ' LIMIT ? OFFSET ?';
        params.push(Number(limit), Number(offset));

        const produtos = db.prepare(query).all(...params);

        const total = db.prepare('SELECT COUNT(*) as count FROM produtos').get().count;

        res.json({
            total,
            page: Number(page),
            limit: Number(limit),
            data: produtos
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao buscar produtos' });
    }
});

/* GET por ID */
app.get('/api/produtos/:id', (req, res) => {
    try {
        const { id } = req.params;

        const produto = db.prepare(
            'SELECT * FROM produtos WHERE id = ?'
        ).get(id);

        if (!produto) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }

        res.json(produto);

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao buscar produto' });
    }
});

/* POST  */
app.post('/api/produtos', (req, res) => {
    try {
        const { nome, tipo, funcionamento, pais, preco } = req.body;

        if (!nome || nome.length < 2) {
            return res.status(400).json({ erro: 'Nome inválido' });
        }

        if (!tipo || !funcionamento || !pais || preco === undefined) {
            return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
        }

        const precoNumero = Number(preco);

        if (isNaN(precoNumero) || precoNumero <= 0) {
            return res.status(400).json({ erro: 'Preço inválido' });
        }

        const result = db.prepare(`
            INSERT INTO produtos (nome, tipo, funcionamento, pais, preco)
            VALUES (?, ?, ?, ?, ?)
        `).run(nome, tipo, funcionamento, pais, precoNumero);

        const produtoCriado = db.prepare(
            'SELECT * FROM produtos WHERE id = ?'
        ).get(result.lastInsertRowid);

        res.status(201).json(produtoCriado);

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao criar produto' });
    }
});

/* PUT */
app.put('/api/produtos/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { nome, tipo, funcionamento, pais, preco } = req.body;

        const produto = db.prepare(
            'SELECT * FROM produtos WHERE id = ?'
        ).get(id);

        if (!produto) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }

        if (!nome || !tipo || !funcionamento || !pais || preco === undefined) {
            return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
        }

        const precoNumero = Number(preco);

        if (isNaN(precoNumero) || precoNumero <= 0) {
            return res.status(400).json({ erro: 'Preço inválido' });
        }

        db.prepare(`
            UPDATE produtos
            SET nome = ?, tipo = ?, funcionamento = ?, pais = ?, preco = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(nome, tipo, funcionamento, pais, precoNumero, id);

        const atualizado = db.prepare(
            'SELECT * FROM produtos WHERE id = ?'
        ).get(id);

        res.json(atualizado);

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao atualizar produto' });
    }
});

/*DELETE*/
app.delete('/api/produtos/:id', (req, res) => {
    try {
        const { id } = req.params;

        const result = db.prepare(
            'DELETE FROM produtos WHERE id = ?'
        ).run(id);

        if (result.changes === 0) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }

        res.json({ mensagem: 'Produto deletado com sucesso' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao deletar produto' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 http://localhost:${PORT}`);
});