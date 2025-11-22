import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Registro() {
    
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const handleRegistro = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            alert("As senhas não coincidem!");
            return;
        }

        // Validação futura
        if (email.length > 0 && password.length > 0) {
            navigate("/home"); // redireciona para a tela de login
        }

    };

    return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Cadastrar</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegistro} className="space-y-4">
            
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="seuemail@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Senha</label>
              <Input
                type="password"
                placeholder="•••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Confirmar Senha</label>
              <Input
                type="password"
                placeholder="•••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button variant="link" className="w-full text-lg" onClick={() => navigate("/")}>
              Já tem uma conta? Faça login
            </Button>

            <Button type="submit" className="w-full text-lg">
              Registrar
            </Button>
            
          </form>
        </CardContent>
      </Card>
    </div>
    );
}
