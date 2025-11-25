// pages/Registro.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/globals.css";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/Input";

export default function Registro() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("Preencha todos os campos.");
      return;
    }
    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    try {
      // --- CORREÇÃO AQUI ---
      // 1. Porta ajustada para 5024 (ou a que aparecer no seu terminal 'dotnet run')
      // 2. Rota ajustada para /api/auth/register
      const response = await fetch("http://localhost:5024/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            name, 
            email, 
            password,
            role: "Student" // Adicionado para evitar erro de validação
        }),
      });

      // Verifica se a resposta tem conteúdo antes de tentar ler JSON
      let data = {};
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
          data = await response.json();
      }

      if (response.ok) {
        alert("Conta criada com sucesso! Redirecionando para o login...");
        navigate("/"); 
      } else {
        // @ts-ignore
        alert(`Erro: ${data.message || "Falha ao registrar"}`);
      }
    } catch (error) {
      console.error("Erro técnico:", error);
      alert("Erro de conexão. Verifique se o Backend está rodando na porta 5024.");
    }
  };

  return (
    <div className="app-center">
      <div className="auth-card">
        <div className="auth-logo">Adapty</div>
        <div className="auth-sub">Crie sua conta de estudante</div>

        <form onSubmit={handleRegistro} className="form-inner">
          <div className="auth-field">
            <label>Nome</label>
            <Input type="text" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="auth-field">
            <label>E-mail</label>
            <Input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="auth-field">
            <label>Senha</label>
            <Input type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="auth-field">
            <label>Confirmar senha</label>
            <Input type="password" placeholder="Repita a senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <Button type="submit" className="btn-primary">Criar Conta</Button>
          <Button variant="link" className="btn-link" onClick={() => navigate("/")}>
            Voltar para Login
          </Button>
        </form>
      </div>
    </div>
  );
}