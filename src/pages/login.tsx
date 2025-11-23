import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      navigate("/home");
    } else {
      alert("Preencha email e senha.");
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
