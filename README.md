# API-AtividadeFinal
Trabalho de API Rest - Sistema de loja de airsofts
# API de Produtos

API desenvolvida com Node.js, Express e SQLite.

## Funcionalidades

* CRUD completo
* Filtros por nome, tipo, funcionamento, país e preço
* Ordenação por preço
* Paginação
* Validações de dados
* Status HTTP corretos

## Tecnologias

* Node.js
* Express
* SQLite (better-sqlite3)

## Como rodar

```bash
npm install
node api.js
```

Servidor rodando em:

```
http://localhost:3000
```

## Rotas

### GET /api/produtos

Lista produtos com filtros e paginação

Exemplo:

```
/api/produtos?tipo=Pistola&ordem=desc&page=1&limit=5
```

---

### GET /api/produtos/:id

Busca produto por ID

---

### POST /api/produtos

Cria um produto

Body:

```json
{
  "nome": "Glock18",
  "tipo": "Pistola",
  "funcionamento": "Gbb",
  "pais": "Áustria",
  "preco": 800
}
```

---

### PUT /api/produtos/:id

Atualiza um produto

---

### DELETE /api/produtos/:id

Remove um produto

---

## Postman

Collection incluída no projeto.
