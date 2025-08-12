// Importa os pacotes necessários teste
const express = require('express');
const mysql = require('mysql2/promise'); // Usamos a versão com Promises para código mais limpo (async/await)
const cors = require('cors');

// --- CONFIGURAÇÃO DA APLICAÇÃO EXPRESS ---
const app = express();
app.use(cors()); // Habilita o CORS para todas as rotas

// --- CONFIGURAÇÃO DO BANCO DE DADOS MYSQL ---
// Usar um "pool" de conexões é mais eficiente do que criar uma nova conexão a cada requisição
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
const pool = mysql.createPool(dbConfig);


// --- DEFINIÇÃO DOS ENDPOINTS (MÉTODOS) DA API ---

// Rota principal para obter todas as questões
app.get('/api/questoes', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM questoes_oab');
        console.log(`INFO: Retornando ${rows.length} questões.`);
        res.json(rows);
    } catch (error) {
        console.error("ERRO ao buscar todas as questões:", error);
        res.status(500).json({ erro: "Não foi possível buscar as questões." });
    }
});

// Rota para obter UMA questão aleatória (Movida para aqui)
app.get('/api/questoes/aleatoria', async (req, res) => {
    try {
        const sql = 'SELECT * FROM questoes_oab ORDER BY RAND() LIMIT 1';
        const [rows] = await pool.query(sql);
        if (rows.length > 0) {
            console.log(`INFO: Retornando questão aleatória ID ${rows[0].id}.`);
            res.json(rows[0]); // Retorna o objeto da questão, não uma lista
        } else {
            res.status(404).json({ erro: "Nenhuma questão encontrada no banco de dados." });
        }
    } catch (error) {
        console.error("ERRO ao buscar questão aleatória:", error);
        res.status(500).json({ erro: "Não foi possível buscar a questão." });
    }
});

// Rota para obter questões por DISCIPLINA (Movida para aqui)
app.get('/api/questoes/disciplina/:nome_disciplina', async (req, res) => {
    const { nome_disciplina } = req.params;
    try {
        const sql = 'SELECT * FROM questoes_oab WHERE disciplina = ?';
        const [rows] = await pool.query(sql, [nome_disciplina]);
        console.log(`INFO: Buscando por disciplina '${nome_disciplina}'. Encontradas ${rows.length} questões.`);
        res.json(rows);
    } catch (error) {
        console.error(`ERRO ao buscar por disciplina '${nome_disciplina}':`, error);
        res.status(500).json({ erro: "Não foi possível buscar as questões." });
    }
});

// Rota para obter questões por ASSUNTO (Movida para aqui)
app.get('/api/questoes/assunto/:nome_assunto', async (req, res) => {
    const { nome_assunto } = req.params;
    try {
        const sql = 'SELECT * FROM questoes_oab WHERE assunto = ?';
        const [rows] = await pool.query(sql, [nome_assunto]);
        console.log(`INFO: Buscando por assunto '${nome_assunto}'. Encontradas ${rows.length} questões.`);
        res.json(rows);
    } catch (error) {
        console.error(`ERRO ao buscar por assunto '${nome_assunto}':`, error);
        res.status(500).json({ erro: "Não foi possível buscar as questões." });
    }
});

// Rota para obter uma questão específica pelo ID (Agora vem depois das rotas mais específicas)
app.get('/api/questoes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'SELECT * FROM questoes_oab WHERE id = ?';
        const [rows] = await pool.query(sql, [id]);
        if (rows.length > 0) {
            console.log(`INFO: Questão com ID ${id} encontrada.`);
            res.json(rows[0]); // Retorna apenas o primeiro objeto
        } else {
            console.log(`AVISO: Questão com ID ${id} não encontrada.`);
            res.status(404).json({ erro: "Questão não encontrada" });
        }
    } catch (error) {
        console.error(`ERRO ao buscar questão por ID ${id}:`, error);
        res.status(500).json({ erro: "Não foi possível buscar a questão." });
    }
});


// --- EXECUÇÃO DO SERVIDOR ---
const PORT = 5000;
// '0.0.0.0' permite que a API seja acessível na sua rede locals
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Node.js rodando em http://localhost:${PORT}`);
    console.log('API pronta para receber chamadas do seu app React Native!');
});