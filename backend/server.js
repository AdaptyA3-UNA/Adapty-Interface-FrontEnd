import express from "express";
import cors from "cors";
import pkg from "pg";
import bcrypt from "bcryptjs";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 CONFIGURAÇÃO DE CONEXÃO FINAL (Localhost + Senha Padrão)
// A conexão DEVE ser feita LOCALMENTE com o Firebase Studio
const pool = new Pool({
  // *** PONTO CRÍTICO: DEVE SER LOCALHOST ***
  host: "localhost", 
  port: 5432,
  user: "postgres", 
  // Senha padrão mais provável. Se não funcionar, apenas aqui está o erro.
  password: "postgres", 
  database: "postgres",
  // Desativa o SSL para conexões locais
  ssl: false 
});

// Função de verificação de conexão do DB
async function checkDbConnection() {
    try {
        // Tenta executar uma query simples para verificar a conexão
        await pool.query('SELECT 1'); 
        console.log("✅ Conexão com o Banco de Dados PostgreSQL estabelecida com sucesso!");
    } catch (err) {
        // Se falhar, imprime o erro exato do DB no terminal
        console.error("❌ ERRO FATAL: Falha ao conectar ao Banco de Dados:", err.message);
        console.error("Verifique o Firebase Studio: a porta 5432 está ativa? A senha 'postgres' está correta para seu ambiente?");
    }
}

// 📌 Rota de registro
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
      return res.status(400).json({ error: "Nome, e-mail e senha são obrigatórios." });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
      [name, email, hashed]
    );

    res.json({ success: true, id: result.rows[0].id });

  } catch (err) {
    // Erro de violação de UNIQUE (email) ou outro erro de DB
    console.error("Erro no registro:", err.message);
    if (err.code === '23505') { 
        return res.status(400).json({ error: "Este e-mail já está em uso." });
    }
    // Retorna o erro interno caso a falha de conexão ou query persista
    res.status(500).json({ error: "Erro interno do servidor ao registrar." });
  }
});

// 📌 Rota de login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
  
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Email não encontrado ou inválido" });
    }
  
    const user = result.rows[0];
  
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Senha incorreta" });
    }
  
    // Remove a senha do objeto antes de enviar ao frontend
    delete user.password; 
    res.json({ success: true, user });

  } catch (err) {
      console.error("Erro no login:", err.message);
      res.status(500).json({ error: "Erro interno do servidor ao logar." });
  }
});

// Servidor rodando
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
  checkDbConnection(); // Verifica a conexão do DB ao iniciar o servidor
});