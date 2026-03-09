import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, TrendingUp, DollarSign, AlertTriangle, CheckCircle, XCircle, Upload, FileText, Building2, Landmark, CreditCard, Cpu, Globe, Shield, HardHat, Tractor, Truck, ShoppingCart, Factory, Briefcase, Leaf, Utensils, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import AppLayout from "@/components/AppLayout";
import { documentCategories, statusLabels, statusColors } from "@/data/mockData";
import { allPartners } from "@/data/partnersData";
import { useClients } from "@/context/ClientContext";
import type { DocumentCategory, Partner, Client } from "@/types";

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

const tierColors: Record<string, string> = {
  ORO: "bg-accent/10 text-accent border-accent/30",
  PLATA: "bg-muted text-muted-foreground border-muted-foreground/20",
  BRONCE: "bg-warning/10 text-warning border-warning/30",
  REVISION: "bg-info/10 text-info border-info/30",
};

const typeIcons: Record<string, React.ReactNode> = {
  BANCO: <Landmark className="w-4 h-4" />,
  FINANCIERA: <CreditCard className="w-4 h-4" />,
  FINTECH: <Cpu className="w-4 h-4" />,
  TPV: <CreditCard className="w-4 h-4" />,
  "BANCA DE INVERSION": <Building2 className="w-4 h-4" />,
};

const sectorIcons: Record<string, React.ReactNode> = {
  "Construcción": <HardHat className="w-4 h-4 text-muted-foreground" />,
  "Agricultura": <Tractor className="w-4 h-4 text-muted-foreground" />,
  "Transporte": <Truck className="w-4 h-4 text-muted-foreground" />,
  "Comercio": <ShoppingCart className="w-4 h-4 text-muted-foreground" />,
  "Industria": <Factory className="w-4 h-4 text-muted-foreground" />,
  "Servicios": <Briefcase className="w-4 h-4 text-muted-foreground" />,
  "Primario": <Leaf className="w-4 h-4 text-muted-foreground" />,
  "Tecnología": <Cpu className="w-4 h-4 text-muted-foreground" />,
  "Alimentos": <Utensils className="w-4 h-4 text-muted-foreground" />,
  "Manufactura": <Wrench className="w-4 h-4 text-muted-foreground" />,
};

const sectorMap: Record<string, keyof Partner["sectors"]> = {
  "Construcción": "industria",
  "Agricultura": "primario",
  "Transporte": "servicios",
  "Comercio": "comercio",
  "Industria": "industria",
  "Servicios": "servicios",
  "Primario": "primario",
  "Tecnología": "servicios",
  "Alimentos": "comercio",
  "Manufactura": "industria",
};

function matchPartners(client: Client): { partner: Partner; score: number; reasons: string[] }[] {
  return allPartners.map(partner => {
    let score = 0;
    const reasons: string[] = [];

    const sectorKey = sectorMap[client.sector];
    if (sectorKey && partner.sectors[sectorKey]) { score += 20; reasons.push("Sector compatible"); }

    if (client.buroStatus) {
      const buroKey = client.buroStatus as keyof Partner["buró"];
      if (partner.buró[buroKey]) { score += 25; reasons.push(`Acepta buro ${client.buroStatus}`); }
    }

    const years = client.yearsOperating || 0;
    if (years >= 2 && partner.experience.twoOrMoreYears) { score += 15; reasons.push("Experiencia suficiente"); }
    else if (years >= 1 && partner.experience.oneYear) { score += 10; reasons.push("Experiencia minima aceptada"); }
    else if (years < 1 && partner.experience.lessThan1Year) { score += 5; reasons.push("Acepta empresas nuevas"); }

    if (client.productType && partner.products[client.productType as keyof Partner["products"]]) { score += 20; reasons.push("Producto disponible"); }

    if (client.solvencyStatus) {
      const solKey = client.solvencyStatus as keyof Partner["solvency"];
      if (partner.solvency[solKey]) { score += 10; reasons.push("Solvencia aceptada"); }
    }

    if (partner.hasContract) { score += 5; reasons.push("Contrato vigente"); }
    if (partner.isProfitable) { score += 5; reasons.push("Rentable para Pontifex"); }

    return { partner, score, reasons };
  })
  .filter(m => m.score >= 40)
  .sort((a, b) => b.score - a.score);
}

const PartnerMatchSection = ({ client }: { client: Client }) => {
  const matches = matchPartners(client);

  // Require score (dictamen completed) to show matches
  if (!client.score) {
    return (
      <Card className="border border-dashed">
        <CardContent className="p-12 text-center">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Match no disponible</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Se requiere completar el dictamen de riesgo para generar el match con instituciones financieras.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">Instituciones Compatibles</h3>
          <p className="text-sm text-muted-foreground">
            {matches.length} instituciones identificadas con base en el perfil crediticio del cliente
          </p>
        </div>
        <Badge variant="outline" className="text-xs">{matches.length} resultados</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map(({ partner, score, reasons }) => (
          <Card key={partner.id} className="border hover:shadow-md transition-all">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-muted-foreground">
                    {typeIcons[partner.type] || <Building2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{partner.name}</p>
                    <p className="text-xs text-muted-foreground">{partner.type}</p>
                  </div>
                </div>
                <Badge className={`${tierColors[partner.tier] || ""} text-xs border`}>{partner.tier}</Badge>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Compatibilidad</span>
                  <span className="font-semibold">{score}%</span>
                </div>
                <Progress value={score} className="h-1.5" />
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {reasons.map((r, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{r}</Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {partner.products.creditoSimple && <Badge variant="outline" className="text-xs">Credito Simple</Badge>}
                {partner.products.creditoRevolvente && <Badge variant="outline" className="text-xs">Revolvente</Badge>}
                {partner.products.factoraje && <Badge variant="outline" className="text-xs">Factoraje</Badge>}
                {partner.products.arrendamiento && <Badge variant="outline" className="text-xs">Arrendamiento</Badge>}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Globe className="w-3 h-3" />
                  {partner.coverage.join(", ")}
                </div>
                {partner.hasContract && (
                  <span className="flex items-center gap-1 text-xs text-success">
                    <CheckCircle className="w-3 h-3" /> Contrato
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {matches.length === 0 && (
        <Card className="border border-dashed">
          <CardContent className="p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Sin instituciones compatibles</h3>
            <p className="text-muted-foreground text-sm">No se encontraron instituciones que cumplan con los criterios del perfil crediticio actual.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients } = useClients();
  const client = clients.find(c => c.id === id);

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

  // Dictamen is available if client has score OR if enough docs are uploaded (>= 50%)
  const dictamenAvailable = !!client.score || docProgress >= 50;

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
              {sectorIcons[client.sector] || <Building2 className="w-3 h-3" />} {client.companyName} · #{client.id}
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
            <TabsTrigger value="match">Instituciones Compatibles</TabsTrigger>
          </TabsList>

          {/* ===== DICTAMEN TAB ===== */}
          <TabsContent value="dictamen" className="space-y-6">
            {dictamenAvailable && client.score ? (
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
                    {docProgress < 50 
                      ? " Sube al menos el 50% de los documentos requeridos en el Expediente."
                      : " Completa el expediente y ejecuta la extraccion de datos."}
                  </p>
                  <p className="text-sm mt-4">
                    <span className="font-semibold">Documentos subidos:</span> {uploadedDocs} de {totalDocs}
                  </p>
                  <Progress value={docProgress} className="mt-2 max-w-xs mx-auto" />
                  <Button variant="outline" className="mt-4" onClick={() => navigate(`/client/${client.id}/expediente`)}>
                    Ir al Expediente
                  </Button>
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
                    <div key={doc.id} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        {doc.uploaded ? (
                          <CheckCircle className="w-5 h-5 text-success" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          {doc.files.length > 0 && (
                            <p className="text-xs text-muted-foreground">{doc.files.length} archivo{doc.files.length > 1 ? "s" : ""} subido{doc.files.length > 1 ? "s" : ""}</p>
                          )}
                        </div>
                      </div>
                      {doc.files.length > 0 && (
                        <div className="mt-2 ml-8 space-y-1">
                          {doc.files.map(file => (
                            <div key={file.id} className="flex items-center gap-2 py-1 px-2 rounded bg-background border text-xs">
                              <FileText className="w-3 h-3 text-muted-foreground" />
                              <span className="font-medium">{file.fileName}</span>
                              <span className="text-muted-foreground">{file.uploadDate}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* ===== INFO TAB ===== */}
          <TabsContent value="info" className="space-y-6">
            {client.description && (
              <Card className="border">
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Building2 className="w-4 h-4 text-accent" /> Descripcion de la Empresa</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{client.description}</p>
                </CardContent>
              </Card>
            )}

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
                    ["Estatus de Buro", client.buroStatus ? client.buroStatus.charAt(0).toUpperCase() + client.buroStatus.slice(1) : "—"],
                  ].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-medium">{String(v)}</span>
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
                    ["Tipo de producto", client.productType ? client.productType.replace(/([A-Z])/g, ' $1').trim() : "—"],
                    ["Etapa actual", statusLabels[client.status]],
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

          {/* ===== MATCH TAB ===== */}
          <TabsContent value="match" className="space-y-6">
            <PartnerMatchSection client={client} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ClientDetail;
