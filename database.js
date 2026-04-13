import Database from 'better-sqlite3';
const db = new Database('produtos.db');

const createTableSQL = `
    CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome VARCHAR(100) NOT NULL,
        tipo VARCHAR(50) NOT NULL,
        funcionamento VARCHAR(50) NOT NULL,
        pais VARCHAR(50) NOT NULL,
        preco DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

db.exec(createTableSQL);

const count = db.prepare('SELECT COUNT(*) as total FROM produtos').get().total;

if (count === 0) {
    console.log('Inserindo dados iniciais...');

    const insert = db.prepare(`
        INSERT INTO produtos (nome, tipo, funcionamento, pais, preco)
        VALUES (?, ?, ?, ?, ?)
    `);

    const produtos = [
    ['Glock 17 Airsoft', 'Pistola', 'Gbb', 'Áustria', 1200],
    ['Desert Eagle .50 AE', 'Pistola', 'Gbb', 'Israel', 1800],
    ['Colt 1911 Tactical', 'Pistola', 'Spring', 'EUA', 700],
    ['Beretta M9', 'Pistola', 'Gbb', 'Itália', 1100],
    ['AK-47 Airsoft', 'Rifle', 'Elétrica', 'Rússia', 2500],
    ['M4A1 Carbine', 'Rifle', 'Elétrica', 'EUA', 2700],
    ['HK416', 'Rifle', 'Elétrica', 'Alemanha', 3200],
    ['FN SCAR-L', 'Rifle', 'Elétrica', 'Bélgica', 3000],
    ['Remington 870', 'Escopeta', 'Spring', 'EUA', 900],
    ['Mossberg 500', 'Escopeta', 'Spring', 'EUA', 850],
    ['SPAS-12', 'Escopeta', 'Spring', 'Itália', 1500],
    ['AA-12 Airsoft', 'Escopeta', 'Elétrica', 'EUA', 4000],
    ['Barrett M82', 'Sniper', 'Spring', 'EUA', 4500],
    ['L96 AWP', 'Sniper', 'Spring', 'Reino Unido', 2000],
    ['Dragunov SVD', 'Sniper', 'Elétrica', 'Rússia', 3500],
    ['VSR-10', 'Sniper', 'Spring', 'Japão', 1800],
    ['MP5', 'Rifle', 'Elétrica', 'Alemanha', 2300],
    ['UMP45', 'Rifle', 'Elétrica', 'Alemanha', 2600],
    ['P90', 'Rifle', 'Elétrica', 'Bélgica', 2800],
    ['FAMAS', 'Rifle', 'Elétrica', 'França', 2400]
    ];

    const insertMany = db.transaction((produtos) => {
        for (const p of produtos) {
            insert.run(...p);
        }
    });

    insertMany(produtos);

    console.log('Dados iniciais inseridos!');
}

console.log('Tabela produtos criada!');

export default db;