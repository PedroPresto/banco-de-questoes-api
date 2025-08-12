// Importa os pacotes necessários
const mysql = require('mysql2/promise');
const fs = require('fs').promises; // Usamos a versão com Promises do 'fs'

// --- CONFIGURAÇÃO DO BANCO DE DADOS ---
// Conecta-se diretamente ao banco. Lembre-se que o Docker deve estar rodando.
const dbConfig = {
    host: '127.0.0.1', // Use '127.0.0.1' ou 'localhost' para conectar da sua máquina
    port: 3306,        // A porta que você expôs no docker-compose.yml
    user: 'root',
    password: 'senha', // A senha que você definiu.
    database: 'BancoDeQuestoes'
};

async function migrarDados() {
    let connection;
    try {
        // 1. Ler o arquivo JSON
        console.log("INFO: Lendo o arquivo 'questoes_extraidas.json'...");
        const data = await fs.readFile('questoes_extraidas.json', 'utf-8');
        const questoes = JSON.parse(data);
        console.log(`INFO: ${questoes.length} questões encontradas no arquivo.`);

        // 2. Conectar ao banco de dados
        console.log("INFO: Conectando ao banco de dados MySQL...");
        connection = await mysql.createConnection(dbConfig);
        console.log("INFO: Conexão bem-sucedida.");

        // 3. Inserir cada questão no banco de dados d
        console.log("INFO: Iniciando a inserção dos dados...");
        let questoesInseridas = 0;
        for (const questao of questoes) {
            const sql = `
                INSERT INTO questoes_oab (
                    disciplina, assunto, material, enunciado,
                    alternativa_a, alternativa_b, alternativa_c, alternativa_d,
                    gabarito, comentario
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const valores = [
                questao.disciplina, questao.assunto, questao.material,
                questao.enunciado, questao.alternativa_a, questao.alternativa_b,
                questao.alternativa_c, questao.alternativa_d, questao.gabarito,
                questao.comentario
            ];

            await connection.execute(sql, valores);
            questoesInseridas++;
        }

        console.log(`\nSUCESSO! ${questoesInseridas} questões foram migradas para o banco de dados.`);

    } catch (error) {
        console.error("\nERRO DURANTE A MIGRAÇÃO:", error);
    } finally {
        if (connection) {
            await connection.end();
            console.log("INFO: Conexão com o banco de dados fechada.");
        }
    }
}

// Executa a função principal
migrarDados();
