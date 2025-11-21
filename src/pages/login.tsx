import { useState } from "react";
import { Button } from "../pages/components/ui/button";
import { Input } from "../pages/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../pages/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Aqui você colocaria validação real mais tarde
    if (email.length > 0 && password.length > 0) {
      navigate("/home"); // redireciona para a home
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            
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

            <Button type="submit" className="w-full text-lg">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
