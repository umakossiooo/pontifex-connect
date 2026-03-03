import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, BarChart3, CheckCircle, TrendingUp, XCircle, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from "@/components/AppLayout";
import ClientActionMenu from "@/components/ClientActionMenu";
import { mockClients, statusLabels, statusColors } from "@/data/mockData";
import type { Sector } from "@/types";

const sectors: Sector[] = ["Construcción", "Agricultura", "Transporte", "Comercio", "Industria", "Servicios", "Primario", "Tecnología", "Alimentos", "Manufactura"];

const sectorIcons: Record<string, string> = {
  "Construcción": "🏗️",
  "Agricultura": "🌾",
  "Transporte": "🚚",
  "Comercio": "🏪",
  "Industria": "🏭",
  "Servicios": "💼",
  "Primario": "⛏️",
  "Tecnología": "💻",
  "Alimentos": "🍽️",
  "Manufactura": "🔧",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientSector, setNewClientSector] = useState<string>("");
  const [newClientAmount, setNewClientAmount] = useState("");

  const filtered = mockClients.filter(c =>
    c.companyName.toLowerCase().includes(search.toLowerCase()) ||
    c.sector.toLowerCase().includes(search.toLowerCase()) ||
    c.id.includes(search)
  );

  const kpis = [
    { label: "TOTAL CLIENTES", value: mockClients.length, icon: BarChart3, color: "text-info" },
    { label: "APROBADOS", value: mockClients.filter(c => c.result === "exitoso").length, sub: "Sin restricciones", icon: CheckCircle, color: "text-success" },
    { label: "EN ANÁLISIS", value: mockClients.filter(c => c.status === "analisis").length, sub: "En proceso", icon: TrendingUp, color: "text-warning" },
    { label: "RECHAZADOS", value: mockClients.filter(c => c.result === "declinado" || c.result === "rechazado_cliente").length, sub: "No aprobados", icon: XCircle, color: "text-destructive" },
  ];

  const formatMoney = (n: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);

  return (
    <AppLayout>
      <div className="p-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Flujo de Clientes</h1>
            <p className="text-muted-foreground mt-1">Gestiona y analiza el riesgo crediticio de cada cliente</p>
          </div>
          <Button onClick={() => setShowNewClient(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
            <Plus className="w-4 h-4 mr-2" /> Agregar Nuevo Cliente
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map(kpi => (
            <Card key={kpi.label} className="border border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{kpi.label}</p>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${kpi.color} bg-current/10`}>
                    <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                  </div>
                </div>
                <p className="text-3xl font-bold mt-2 text-foreground">{kpi.value}</p>
                {kpi.sub && <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Client Table */}
        <Card className="border border-border">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Clientes Registrados</h2>
                <Badge variant="secondary" className="text-xs">{filtered.length}</Badge>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar empresa, sector o ID..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground p-4">ID</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground p-4">Nombre de Empresa</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground p-4">Sector</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground p-4">Monto Solicitado</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground p-4">Estatus</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((client, i) => {
                  const docsComplete = client.documents.every(d => d.uploaded);
                  return (
                    <tr 
                      key={client.id} 
                      className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
                      style={{ animationDelay: `${i * 50}ms` }}
                      onClick={() => navigate(`/client/${client.id}`)}
                    >
                      <td className="p-4 text-sm text-muted-foreground">#{client.id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                            {client.companyName[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{client.companyName}</p>
                            {docsComplete && client.score && (
                              <p className="text-xs text-success flex items-center gap-1">
                                <FileCheck className="w-3 h-3" /> Dictamen generado
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        <span className="flex items-center gap-2">
                          {sectorIcons[client.sector]} {client.sector}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-medium">{formatMoney(client.amountRequested)}</td>
                      <td className="p-4">
                        <Badge className={`${statusColors[client.status]} text-xs font-medium px-3 py-1`}>
                          {statusLabels[client.status]}
                        </Badge>
                      </td>
                      <td className="p-4" onClick={e => e.stopPropagation()}>
                        <ClientActionMenu clientId={client.id} clientName={client.companyName} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex items-center justify-between p-4 border-t border-border text-xs text-muted-foreground">
              <span>Mostrando {filtered.length} de {mockClients.length} clientes</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success" /> Aprobado</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning" /> En Análisis</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive" /> Rechazado</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Client Dialog */}
      <Dialog open={showNewClient} onOpenChange={setShowNewClient}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              🏢 Agregar Nuevo Cliente
            </DialogTitle>
            <DialogDescription>
              Completa los datos para registrar al cliente en el pipeline.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 mt-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                🏢 Nombre de la Empresa <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="Ej. Constructora Sonora S.A. de C.V."
                value={newClientName}
                onChange={e => setNewClientName(e.target.value)}
                className="h-11 border-accent/30 focus:border-accent"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                🏷️ Sector <span className="text-destructive">*</span>
              </Label>
              <Select value={newClientSector} onValueChange={setNewClientSector}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Seleccionar sector económico..." />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map(s => (
                    <SelectItem key={s} value={s}>{sectorIcons[s]} {s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                💲 Monto Solicitado (MXN) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input
                  type="number"
                  placeholder="0"
                  value={newClientAmount}
                  onChange={e => setNewClientAmount(e.target.value)}
                  className="h-11 pl-7"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 h-11" onClick={() => setShowNewClient(false)}>
                Cancelar
              </Button>
              <Button className="flex-1 h-11 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" onClick={() => setShowNewClient(false)}>
                Registrar Cliente
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Dashboard;
