import { useNavigate } from "react-router-dom";
import {
  BarChart3, TrendingUp, Users, CheckCircle, XCircle, AlertTriangle,
  DollarSign, Building2, Clock, ArrowUpRight, ArrowDownRight, Briefcase,
  FileText, Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import AppLayout from "@/components/AppLayout";
import { useClients } from "@/context/ClientContext";
import { mockPartners, statusLabels } from "@/data/mockData";

const CHART_COLORS = [
  "hsl(38, 72%, 56%)",   // accent/gold
  "hsl(213, 60%, 16%)",  // primary/navy
  "hsl(152, 60%, 42%)",  // success
  "hsl(210, 80%, 56%)",  // info
  "hsl(0, 72%, 51%)",    // destructive
  "hsl(38, 92%, 50%)",   // warning
];

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const { clients: mockClients } = useClients();

  // KPI calculations
  const totalClients = mockClients.length;
  const aprobados = mockClients.filter(c => c.status === "aprobado").length;
  const rechazados = mockClients.filter(c => c.status === "rechazado").length;
  const enAnalisis = mockClients.filter(c => c.status === "en_analisis").length;
  const totalMonto = mockClients.reduce((a, c) => a + c.amountRequested, 0);
  const montoAprobado = mockClients.filter(c => c.status === "aprobado").reduce((a, c) => a + c.amountRequested, 0);
  const tasaAprobacion = totalClients > 0 ? ((aprobados / totalClients) * 100).toFixed(1) : "0";
  const docsCompletos = mockClients.filter(c => c.documents.every(d => d.uploaded)).length;

  // Sector distribution
  const sectorMap: Record<string, { count: number; monto: number }> = {};
  mockClients.forEach(c => {
    if (!sectorMap[c.sector]) sectorMap[c.sector] = { count: 0, monto: 0 };
    sectorMap[c.sector].count++;
    sectorMap[c.sector].monto += c.amountRequested;
  });
  const sectorData = Object.entries(sectorMap).map(([name, data]) => ({
    name,
    clientes: data.count,
    monto: data.monto,
  }));

  // Pipeline stages
  const stageMap: Record<string, number> = {};
  mockClients.forEach(c => {
    const label = statusLabels[c.status] || c.status;
    stageMap[label] = (stageMap[label] || 0) + 1;
  });
  const pipelineData = Object.entries(stageMap).map(([name, value]) => ({ name, value }));

  // Risk distribution
  const riskMap: Record<string, number> = { A: 0, B: 0, C: 0, "Sin evaluar": 0 };
  mockClients.forEach(c => {
    if (c.riskClass) riskMap[c.riskClass]++;
    else riskMap["Sin evaluar"]++;
  });
  const riskData = Object.entries(riskMap).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }));

  // Top prospects (sorted by score)
  const topProspects = [...mockClients]
    .filter(c => c.score)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 5);

  // Monthly trend (simulated)
  const monthlyTrend = [
    { month: "Sep", solicitudes: 8, aprobados: 5, monto: 18000000 },
    { month: "Oct", solicitudes: 12, aprobados: 7, monto: 25000000 },
    { month: "Nov", solicitudes: 10, aprobados: 6, monto: 22000000 },
    { month: "Dic", solicitudes: 15, aprobados: 9, monto: 35000000 },
    { month: "Ene", solicitudes: 11, aprobados: 8, monto: 28000000 },
    { month: "Feb", solicitudes: 14, aprobados: 10, monto: 32000000 },
  ];

  // Partners stats
  const partnersOro = mockPartners.filter(p => p.tier === "ORO").length;
  const partnersConContrato = mockPartners.filter(p => p.hasContract).length;

  const formatMoney = (n: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);

  const formatShortMoney = (n: number) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
    return `$${n}`;
  };

  return (
    <AppLayout>
      <div className="p-8 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard General</h1>
          <p className="text-muted-foreground mt-1">Vision integral del pipeline crediticio y metricas clave para la toma de decisiones</p>
        </div>

        {/* Main KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border border-border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Clientes</p>
                <Users className="w-5 h-5 text-info" />
              </div>
              <p className="text-3xl font-bold mt-2">{totalClients}</p>
              <p className="text-xs text-muted-foreground mt-1">{enAnalisis} en proceso activo</p>
            </CardContent>
          </Card>

          <Card className="border border-border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monto Total Solicitado</p>
                <DollarSign className="w-5 h-5 text-accent" />
              </div>
              <p className="text-3xl font-bold mt-2">{formatShortMoney(totalMonto)}</p>
              <p className="text-xs text-success mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> {formatShortMoney(montoAprobado)} colocado
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tasa de Aprobacion</p>
                <Target className="w-5 h-5 text-success" />
              </div>
              <p className="text-3xl font-bold mt-2">{tasaAprobacion}%</p>
              <p className="text-xs text-muted-foreground mt-1">{aprobados} aprobados de {totalClients}</p>
            </CardContent>
          </Card>

          <Card className="border border-border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Expedientes Completos</p>
                <FileText className="w-5 h-5 text-warning" />
              </div>
              <p className="text-3xl font-bold mt-2">{docsCompletos}/{totalClients}</p>
              <Progress value={(docsCompletos / totalClients) * 100} className="mt-2 h-1.5" />
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Pipeline + Risk */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pipeline funnel */}
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-accent" />
                Pipeline por Etapa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={pipelineData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" name="Clientes" fill="hsl(38, 72%, 56%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk distribution */}
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-accent" />
                Distribucion por Riesgo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={riskData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {riskData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {riskData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                      <span className="text-sm">
                        <span className="font-semibold">{item.name}</span>
                        <span className="text-muted-foreground ml-1">({item.value})</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 3: Trend + Sectors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly trend */}
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                Tendencia Mensual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="solicitudes" name="Solicitudes" stroke="hsl(213, 60%, 16%)" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="aprobados" name="Aprobados" stroke="hsl(152, 60%, 42%)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sector distribution */}
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-accent" />
                Distribucion por Sector
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={sectorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: number, name: string) => name === "monto" ? formatMoney(value) : value} />
                  <Legend />
                  <Bar dataKey="clientes" name="Clientes" fill="hsl(213, 60%, 16%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Row 4: Top Prospects + Partners Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top prospects */}
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-success" />
                Mejores Prospectos
              </CardTitle>
              <p className="text-xs text-muted-foreground">Clientes con mayor score crediticio</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topProspects.map((client, i) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => navigate(`/client/${client.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{client.companyName}</p>
                        <p className="text-xs text-muted-foreground">{client.sector} · {formatMoney(client.amountRequested)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{client.score}</p>
                      <Badge variant="outline" className="text-xs">
                        Clase {client.riskClass}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Partners summary */}
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-accent" />
                Resumen de Partners
              </CardTitle>
              <p className="text-xs text-muted-foreground">Instituciones financieras en el portafolio</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-2xl font-bold">{mockPartners.length}</p>
                  <p className="text-xs text-muted-foreground">Total partners</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-2xl font-bold text-accent">{partnersOro}</p>
                  <p className="text-xs text-muted-foreground">Tier Oro</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-2xl font-bold text-success">{partnersConContrato}</p>
                  <p className="text-xs text-muted-foreground">Con contrato</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-2xl font-bold">{mockPartners.filter(p => p.type === "BANCO").length}</p>
                  <p className="text-xs text-muted-foreground">Bancos</p>
                </div>
              </div>

              {/* Alertas */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Alertas del Pipeline</p>
                {mockClients.filter(c => c.documents.some(d => !d.uploaded) && c.status === "en_analisis").map(c => (
                  <div key={c.id} className="flex items-center gap-2 p-2 rounded bg-warning/10 text-sm">
                    <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
                    <span className="text-xs"><span className="font-semibold">{c.companyName}</span> — documentacion incompleta</span>
                  </div>
                ))}
                {mockClients.filter(c => c.deudaEbitda && c.deudaEbitda > 4).map(c => (
                  <div key={`risk-${c.id}`} className="flex items-center gap-2 p-2 rounded bg-destructive/10 text-sm">
                    <XCircle className="w-4 h-4 text-destructive shrink-0" />
                    <span className="text-xs"><span className="font-semibold">{c.companyName}</span> — Deuda/EBITDA {c.deudaEbitda}x (alto)</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AnalyticsDashboard;
