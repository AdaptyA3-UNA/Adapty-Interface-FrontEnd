import "../styles/globals.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export default function Registro() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegistro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("Preencha todos os campos");
      return;
    }
    if (password !== confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }
    navigate("/home");
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
