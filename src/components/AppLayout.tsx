import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield, BarChart3, FilePlus, Briefcase, LogOut, ChevronRight } from "lucide-react";
import { mockClients, statusLabels } from "@/data/mockData";

interface AppLayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: "Mis Clientes", icon: BarChart3, path: "/dashboard" },
  { label: "Nuevo Dictamen", icon: FilePlus, path: "/dashboard" },
  { label: "Partners", icon: Briefcase, path: "/partners" },
];

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const counts = {
    total: mockClients.length,
    aprobados: mockClients.filter(c => c.result === "exitoso").length,
    analisis: mockClients.filter(c => c.status === "analisis").length,
    rechazados: mockClients.filter(c => c.result === "declinado" || c.result === "rechazado_cliente").length,
    faltaDocs: mockClients.filter(c => c.documents.some(d => !d.uploaded)).length,
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-72 flex flex-col justify-between shrink-0"
        style={{ background: "linear-gradient(180deg, hsl(213, 60%, 16%) 0%, hsl(213, 50%, 8%) 100%)" }}>
        
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 pb-8">
            <div className="w-9 h-9 rounded-full border-2 border-accent flex items-center justify-center">
              <Shield className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-widest text-sidebar-foreground">Bondly</p>
              <p className="text-[10px] tracking-[0.3em] text-accent">FINANZAS</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="px-4 space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 px-3 mb-3">Menú</p>
            {navItems.map(item => {
              const isActive = location.pathname === item.path || 
                (item.path === "/dashboard" && location.pathname.startsWith("/dashboard") && item.path === "/dashboard");
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-accent text-accent-foreground" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* Flow Summary */}
          <div className="mx-4 mt-8 p-4 rounded-lg bg-sidebar-accent/50">
            <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/50 mb-3">Resumen del Flujo</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-sidebar-foreground/70">
                <span>Total clientes</span>
                <span className="font-semibold text-sidebar-foreground">{counts.total}</span>
              </div>
              <div className="flex justify-between text-sidebar-foreground/70">
                <span>Aprobados</span>
                <span className="font-semibold text-success">{counts.aprobados}</span>
              </div>
              <div className="flex justify-between text-sidebar-foreground/70">
                <span>En Análisis</span>
                <span className="font-semibold text-warning">{counts.analisis}</span>
              </div>
              <div className="flex justify-between text-sidebar-foreground/70">
                <span>Rechazados</span>
                <span className="font-semibold text-destructive">{counts.rechazados}</span>
              </div>
              <div className="flex justify-between text-sidebar-foreground/70">
                <span>Falta Docs.</span>
                <span className="font-semibold text-info">{counts.faltaDocs}</span>
              </div>
            </div>
          </div>
        </div>

        {/* User */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-sidebar-foreground truncate">analista@pontifex.com</p>
              <p className="text-xs text-sidebar-foreground/50">Analista de crédito</p>
            </div>
            <button onClick={() => navigate("/")} className="text-sidebar-foreground/50 hover:text-sidebar-foreground">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
