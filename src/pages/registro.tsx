// pages/Registro.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Assumindo que você tem os estilos e componentes necessários
import "../styles/globals.css";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export default function Registro() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validação local
    if (!name || !email || !password || !confirmPassword) {
      alert("Preencha todos os campos.");
      return;
    }
    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    try {
      // 2. Chamada de API para o Backend na porta 3001
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Envia name, email e password
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registro bem-sucedido
        alert("Usuário registrado com sucesso! Faça login.");
        // Navega para a tela de Login (rota "/")
        navigate("/"); 
      } else {
        // Erro retornado pelo backend (ex: email já existe, erro de DB)
        alert(`Erro no registro: ${data.error || "Erro desconhecido"}`);
      }
    } catch (error) {
      // Erro de rede ou servidor inacessível
      console.error("Erro ao tentar conectar ao servidor:", error);
      alert("Não foi possível conectar ao servidor de registro.");
    }
  };

  return (
    <div className="app-center">
      <div className="auth-card">
        <div className="auth-logo">Adapty</div>
        <div className="auth-sub">Crie sua conta e comece agora</div>

        <form onSubmit={handleRegistro} className="form-inner">
          <div className="auth-field">
            <label>Nome</label>
            <Input type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="auth-field">
            <label>E-mail</label>
            <Input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="auth-field">
            <label>Senha</label>
            <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="auth-field">
            <label>Confirmar senha</label>
            <Input type="password" placeholder="Confirmação de senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>

          <Button type="submit" className="btn-primary">Confirmar</Button>
          <Button variant="link" className="btn-link" onClick={() => navigate("/")}>
            Já tem uma conta? Faça login
          </Button>
        </form>
      </div>
    </div>
  );
}