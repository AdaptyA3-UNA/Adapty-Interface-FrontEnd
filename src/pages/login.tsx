// pages/Login.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Assumindo que você tem os componentes necessários
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/Input";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Preencha email e senha.");
      return;
    }

    try {
      // Chamada de API para o Backend na porta 3001
      const response = await fetch("http://localhost:5024/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        // Login bem-sucedido
        alert(`Bem-vindo ao Adapty!`);
        // Navega para a tela Home (rota "/home")
        navigate("/home");
      } else {
        // Erro retornado pelo backend (ex: email não encontrado, senha incorreta)
        alert(`Erro no login: ${data.error || "Erro desconhecido"}`);
      }
    } catch (error) {
      // Erro de rede ou servidor inacessível
      console.error("Erro ao tentar conectar ao servidor:", error);
      alert("Não foi possível conectar ao servidor de login.");
    }
  };

  return (
    <div className="app-center">
      <div className="auth-card">
        <div className="auth-logo">Adapty</div>
        <div className="auth-sub">Sistema de Flashcards acessível para todos</div>

        <form onSubmit={handleLogin} className="form-inner">
          <div className="auth-field">
            <label>Login</label>
            <Input
              type="email"
              placeholder="Digite seu login"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Senha</label>
            <Input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="btn-primary w-full">Entrar</Button>
          <Button
            variant="outline"
            className="btn-outline-gradient w-full mt-2"
            onClick={() => navigate("/registro")}
          >
            Registrar
          </Button>

        </form>
      </div>
    </div>

  );
}