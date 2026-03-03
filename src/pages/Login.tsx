import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, Mail, Lock, BarChart3, FileCheck, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ background: "linear-gradient(180deg, hsl(213, 60%, 16%) 0%, hsl(213, 50%, 8%) 100%)" }}>
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-accent flex items-center justify-center">
            <Shield className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-widest text-accent-foreground">BONDLY</p>
            <p className="text-xs tracking-[0.3em] text-accent">FINANZAS</p>
          </div>
        </div>

        {/* Center Content */}
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="w-24 h-24 rounded-2xl bg-primary/50 border border-accent/30 flex items-center justify-center">
            <Shield className="w-12 h-12 text-accent" />
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold text-accent-foreground">Bondly</h1>
            <h2 className="text-4xl font-display font-bold text-accent">Finanzas</h2>
            <div className="w-12 h-0.5 bg-accent mx-auto mt-4" />
          </div>
          <p className="text-sm text-accent-foreground/70 max-w-xs">
            Plataforma Inteligente de<br />Evaluación Crediticia
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            {["Análisis de Riesgo", "Score Crediticio", "Dictámenes", "Match Bancario"].map(tag => (
              <span key={tag} className="px-3 py-1 text-xs border border-accent/30 rounded-full text-accent/80">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          {[
            { icon: Users, stat: "150+", label: "Clientes analizados" },
            { icon: TrendingUp, stat: "98.2%", label: "Precisión en dictámenes" },
            { icon: BarChart3, stat: "$2.8B", label: "MXN en créditos evaluados" },
          ].map(({ icon: Icon, stat, label }) => (
            <div key={label} className="flex items-center gap-4 p-3 rounded-lg bg-primary/30">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-bold text-accent-foreground">{stat}</p>
                <p className="text-xs text-accent-foreground/60">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Bienvenido de nuevo</h2>
            <p className="mt-2 text-muted-foreground">
              Ingresa tus credenciales para acceder al sistema de análisis crediticio.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <Mail className="w-4 h-4" />
                Correo Electrónico corporativo
              </Label>
              <Input
                type="email"
                placeholder="analista@pontifex.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-border focus:ring-accent focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <Lock className="w-4 h-4" />
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-10 border-border focus:ring-accent focus:border-accent"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <a href="#" className="text-sm text-accent hover:underline">¿Olvidaste tu contraseña?</a>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Iniciar Sesión →
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            © 2026 Pontifex Financieros · Sistema de Evaluación Crediticia v2.1
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
