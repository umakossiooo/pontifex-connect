import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, TrendingUp, DollarSign, AlertTriangle, CheckCircle, XCircle, Upload, FileText, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import AppLayout from "@/components/AppLayout";
import { mockClients, documentCategories, statusLabels, statusColors } from "@/data/mockData";
import type { DocumentCategory } from "@/types";

const riskColors: Record<string, string> = {
  A: "text-success",
  B: "text-warning",
  C: "text-destructive",
  Rechazado: "text-destructive",
};

const riskLabels: Record<string, string> = {
  A: "Riesgo Bajo (Clase A)",
  B: "Riesgo Medio (Clase B)",
  C: "Riesgo Alto (Clase C)",
  Rechazado: "Rechazado",
};

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const client = mockClients.find(c => c.id === id);

  if (!client) {
    return (
      <AppLayout>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Cliente no encontrado.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard")}>Volver</Button>
        </div>
      </AppLayout>
    );
  }

  const docsByCategory = Object.entries(documentCategories).map(([key, label]) => ({
    category: key as DocumentCategory,
    label,
    docs: client.documents.filter(d => d.category === key),
  }));

  const totalDocs = client.documents.length;
  const uploadedDocs = client.documents.filter(d => d.uploaded).length;
  const docProgress = totalDocs > 0 ? (uploadedDocs / totalDocs) * 100 : 0;

  const formatMoney = (n: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);

  const covenantIcon = (status: string) => {
    if (status === "saludable") return <CheckCircle className="w-5 h-5 text-success" />;
    if (status === "preventivo") return <AlertTriangle className="w-5 h-5 text-warning" />;
    return <XCircle className="w-5 h-5 text-destructive" />;
  };

  const covenantBadge = (status: string) => {
    if (status === "saludable") return <Badge className="bg-success/10 text-success text-xs">Saludable</Badge>;
    if (status === "preventivo") return <Badge className="bg-warning/10 text-warning text-xs">Preventivo</Badge>;
    return <Badge className="bg-destructive/10 text-destructive text-xs">Critico</Badge>;
  };

  const ratioStatusIcon = (status: string) => {
    if (status === "healthy") return <CheckCircle className="w-4 h-4 text-success" />;
    if (status === "warning") return <AlertTriangle className="w-4 h-4 text-warning" />;
    return <XCircle className="w-4 h-4 text-destructive" />;
  };

  return (
    <AppLayout>
      <div className="p-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="w-4 h-4" /> Volver a clientes
            </button>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Building2 className="w-3 h-3" /> {client.companyName} · #{client.id}
            </p>
            <h1 className="text-2xl font-bold">Dictamen de Riesgo Crediticio</h1>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Descargar Reporte PDF
          </Button>
        </div>

        <Tabs defaultValue="dictamen" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="dictamen">Dictamen</TabsTrigger>
            <TabsTrigger value="documentos">Documentos ({uploadedDocs}/{totalDocs})</TabsTrigger>
            <TabsTrigger value="info">Info General</TabsTrigger>
          </TabsList>

          {/* ===== DICTAMEN TAB ===== */}
          <TabsContent value="dictamen" className="space-y-6">
            {client.score ? (
              <>
                {/* Score Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border">
                    <CardContent className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Score Final</p>
                      <div className="flex items-end gap-1 mt-2">
                        <span className="text-4xl font-bold">{client.score}</span>
                        <span className="text-lg text-muted-foreground mb-1">/100</span>
                        <TrendingUp className={`w-5 h-5 ml-auto ${riskColors[client.riskClass || "B"]}`} />
                      </div>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {riskLabels[client.riskClass || "B"]}
                      </Badge>
                    </CardContent>
                  </Card>
                  <Card className="border">
                    <CardContent className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">DSCR</p>
                      <div className="flex items-end gap-1 mt-2">
                        <span className="text-4xl font-bold">{client.dscr}</span>
                        <span className="text-lg text-muted-foreground mb-1">x</span>
                        <TrendingUp className="w-5 h-5 ml-auto text-success" />
                      </div>
                      <p className="text-xs text-success mt-2 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Saludable
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border">
                    <CardContent className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Deuda / EBITDA</p>
                      <div className="flex items-end gap-1 mt-2">
                        <span className="text-4xl font-bold">{client.deudaEbitda}</span>
                        <span className="text-lg text-muted-foreground mb-1">x</span>
                        <DollarSign className="w-5 h-5 ml-auto text-warning" />
                      </div>
                      <p className="text-xs text-warning mt-2 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Sobreapalancado
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Covenants */}
                <div>
                  <h3 className="font-bold text-lg mb-3">Semaforo de Covenants</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {client.covenants.map((cov, i) => (
                      <Card key={i} className={`border-l-4 ${
                        cov.status === "saludable" ? "border-l-success" : cov.status === "preventivo" ? "border-l-warning" : "border-l-destructive"
                      }`}>
                        <CardContent className="p-4 flex items-start gap-3">
                          {covenantIcon(cov.status)}
                          <div className="flex-1">
                            <p className="text-sm font-semibold">{cov.name}</p>
                            <p className="text-xs text-muted-foreground">{cov.description}</p>
                          </div>
                          {covenantBadge(cov.status)}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Flujo de Efectivo Mensual</CardTitle>
                      <p className="text-xs text-muted-foreground">Ingresos vs Egresos</p>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={client.monthlyFlows}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="ingresos" name="Ingresos" fill="hsl(38, 72%, 56%)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="egresos" name="Egresos" fill="hsl(213, 60%, 16%)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Razones Financieras</CardTitle>
                      <p className="text-xs text-muted-foreground">Indicadores clave</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {client.financialRatios.map((ratio, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-sm">{ratio.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">
                              {ratio.name.includes("Margen") || ratio.name.includes("RO") ? `${ratio.value}%` : ratio.value}
                            </span>
                            {ratioStatusIcon(ratio.status)}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <Card className="border border-dashed">
                <CardContent className="p-12 text-center">
                  <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Dictamen no disponible</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    Se requiere completar la documentacion y el analisis financiero para generar el dictamen de riesgo crediticio.
                  </p>
                  <p className="text-sm mt-4">
                    <span className="font-semibold">Documentos subidos:</span> {uploadedDocs} de {totalDocs}
                  </p>
                  <Progress value={docProgress} className="mt-2 max-w-xs mx-auto" />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ===== DOCUMENTS TAB ===== */}
          <TabsContent value="documentos" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Checklist de Documentos</h3>
                <p className="text-sm text-muted-foreground">{uploadedDocs} de {totalDocs} documentos recibidos</p>
              </div>
              <Progress value={docProgress} className="w-48" />
            </div>

            {docsByCategory.map(({ category, label, docs }) => (
              <Card key={category} className="border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent" />
                    {label}
                    <Badge variant="secondary" className="text-xs ml-2">
                      {docs.filter(d => d.uploaded).length}/{docs.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {docs.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        {doc.uploaded ? (
                          <CheckCircle className="w-5 h-5 text-success" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          {doc.uploaded && (
                            <p className="text-xs text-muted-foreground">{doc.fileName} · {doc.uploadDate}</p>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1 text-xs">
                        <Upload className="w-3 h-3" />
                        {doc.uploaded ? "Reemplazar" : "Subir"}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* ===== INFO TAB ===== */}
          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border">
                <CardHeader><CardTitle className="text-base">Informacion General</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[
                    ["Razon Social", client.companyName],
                    ["RFC", client.rfc || "—"],
                    ["Sector", client.sector],
                    ["Anos operando", client.yearsOperating ? `${client.yearsOperating} anos` : "—"],
                    ["Empleados", client.employees || "—"],
                    ["Ingresos anuales", client.annualRevenue ? formatMoney(client.annualRevenue) : "—"],
                  ].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-medium">{v}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border">
                <CardHeader><CardTitle className="text-base">Solicitud de Credito</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[
                    ["Monto solicitado", formatMoney(client.amountRequested)],
                    ["Destino del credito", client.creditDestination || "—"],
                    ["Etapa actual", statusLabels[client.status]],
                    ["Resultado", client.result === "en_proceso" ? "En proceso" : client.result],
                    ["Fecha de registro", client.createdAt],
                    ["Analista asignado", client.analystEmail || "—"],
                  ].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-medium">{v}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ClientDetail;
