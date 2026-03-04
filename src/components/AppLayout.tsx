import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield, BarChart3, Briefcase, LogOut, ChevronRight, LayoutDashboard, Users, PanelLeftClose, PanelLeft } from "lucide-react";
import { useState } from "react";
import { useClients } from "@/context/ClientContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AppLayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: "Dashboard General", icon: LayoutDashboard, path: "/analytics" },
  { label: "Mis Clientes", icon: Users, path: "/dashboard" },
  { label: "Partners", icon: Briefcase, path: "/partners" },
];

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { clients: mockClients } = useClients();
  const counts = {
    total: mockClients.length,
    aprobados: mockClients.filter(c => c.status === "aprobado").length,
    analisis: mockClients.filter(c => c.status === "en_analisis").length,
    rechazados: mockClients.filter(c => c.status === "rechazado").length,
    faltaDocs: mockClients.filter(c => c.documents.some(d => !d.uploaded)).length,
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col justify-between shrink-0 transition-all duration-300",
          collapsed ? "w-16" : "w-72"
        )}
        style={{ background: "linear-gradient(180deg, hsl(213, 60%, 16%) 0%, hsl(213, 50%, 8%) 100%)" }}
      >
        <div>
          {/* Logo */}
          <div className={cn("flex items-center gap-3 p-4", collapsed ? "justify-center py-5" : "p-6 pb-8")}>
            <div className="w-9 h-9 rounded-full border-2 border-accent flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-accent" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm font-bold tracking-widest text-sidebar-foreground">Bondly</p>
                <p className="text-[10px] tracking-[0.3em] text-accent">FINANZAS</p>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav className="px-2 space-y-1">
            {!collapsed && (
              <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 px-3 mb-3">Menu</p>
            )}
            {navItems.map(item => {
              const isActive = location.pathname === item.path ||
                (item.path === "/dashboard" && location.pathname.startsWith("/client"));
              
              const link = (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg text-sm font-medium transition-colors",
                    collapsed ? "justify-center p-3" : "px-4 py-3",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {!collapsed && item.label}
                  {!collapsed && isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.path}>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                );
              }
              return link;
            })}
          </nav>

          {/* Flow Summary - only when expanded */}
          {!collapsed && (
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
                  <span>En Analisis</span>
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
          )}
        </div>

        {/* Bottom section */}
        <div className="space-y-2">
          {/* Collapse toggle */}
          <div className={cn("px-2", collapsed ? "flex justify-center" : "px-4")}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent w-full justify-center"
            >
              {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
              {!collapsed && <span className="ml-2 text-xs">Colapsar</span>}
            </Button>
          </div>

          {/* User */}
          <div className="p-4 border-t border-sidebar-border">
            <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-3")}>
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground shrink-0">
                A
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-sidebar-foreground truncate">analista@pontifex.com</p>
                  <p className="text-xs text-sidebar-foreground/50">Analista de credito</p>
                </div>
              )}
              {!collapsed && (
                <button onClick={() => navigate("/")} className="text-sidebar-foreground/50 hover:text-sidebar-foreground">
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
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
