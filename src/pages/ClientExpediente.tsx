import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Upload, FileText, CheckCircle, AlertTriangle, Download,
  FileSpreadsheet, TrendingUp, DollarSign, BarChart3, Building2, Clock,
  X, Plus, File, FileImage
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/components/AppLayout";
import { documentCategories } from "@/data/mockData";
import { useClients } from "@/context/ClientContext";
import type { DocumentCategory } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface ExtractedFinancials {
  year: string;
  ventasNetas: number;
  costoVentas: number;
  utilidadBruta: number;
  gastosOperacion: number;
  utilidadOperacion: number;
  utilidadNeta: number;
  activoCirculante: number;
  activoFijo: number;
  activoTotal: number;
  pasivoCorto: number;
  pasivoLargo: number;
  pasivoTotal: number;
  capitalContable: number;
  inventarios: number;
  cuentasCobrar: number;
  cuentasPagar: number;
}

interface ExtractedRatio {
  name: string;
  category: string;
  values: { year: string; value: number | string }[];
  status: "healthy" | "warning" | "critical";
}

interface BankFlow {
  year: number;
  month: string;
  deposits: number;
  withdrawals: number;
  balance: number;
}

const sampleFinancials: ExtractedFinancials[] = [
  {
    year: "2019", ventasNetas: 35200000, costoVentas: 24640000, utilidadBruta: 10560000,
    gastosOperacion: 7040000, utilidadOperacion: 3520000, utilidadNeta: 2464000,
    activoCirculante: 12500000, activoFijo: 8200000, activoTotal: 20700000,
    pasivoCorto: 6800000, pasivoLargo: 4500000, pasivoTotal: 11300000,
    capitalContable: 9400000, inventarios: 3200000, cuentasCobrar: 5800000, cuentasPagar: 4200000,
  },
  {
    year: "2020", ventasNetas: 38500000, costoVentas: 26950000, utilidadBruta: 11550000,
    gastosOperacion: 7700000, utilidadOperacion: 3850000, utilidadNeta: 2695000,
    activoCirculante: 14200000, activoFijo: 9100000, activoTotal: 23300000,
    pasivoCorto: 7500000, pasivoLargo: 5200000, pasivoTotal: 12700000,
    capitalContable: 10600000, inventarios: 3800000, cuentasCobrar: 6400000, cuentasPagar: 4800000,
  },
  {
    year: "2021 (Parcial)", ventasNetas: 22000000, costoVentas: 15400000, utilidadBruta: 6600000,
    gastosOperacion: 4400000, utilidadOperacion: 2200000, utilidadNeta: 1540000,
    activoCirculante: 15800000, activoFijo: 9500000, activoTotal: 25300000,
    pasivoCorto: 8200000, pasivoLargo: 5800000, pasivoTotal: 14000000,
    capitalContable: 11300000, inventarios: 4100000, cuentasCobrar: 7200000, cuentasPagar: 5300000,
  },
];

const sampleRatios: ExtractedRatio[] = [
  { name: "Circulante / Liquidez", category: "De Liquidez", values: [{ year: "2019", value: 1.84 }, { year: "2020", value: 1.89 }, { year: "2021", value: 1.93 }], status: "healthy" },
  { name: "Prueba del Acido", category: "De Liquidez", values: [{ year: "2019", value: 1.37 }, { year: "2020", value: 1.39 }, { year: "2021", value: 1.43 }], status: "healthy" },
  { name: "Rotacion de Cuentas x Cobrar", category: "De Actividad", values: [{ year: "2019", value: 6.07 }, { year: "2020", value: 6.02 }, { year: "2021", value: 3.06 }], status: "warning" },
  { name: "Rotacion de Cuentas x Pagar", category: "De Actividad", values: [{ year: "2019", value: 5.87 }, { year: "2020", value: 5.61 }, { year: "2021", value: 2.91 }], status: "warning" },
  { name: "Rotacion de Inventarios", category: "De Actividad", values: [{ year: "2019", value: 7.7 }, { year: "2020", value: 7.09 }, { year: "2021", value: 3.76 }], status: "healthy" },
  { name: "Deuda Total", category: "De Apalancamiento", values: [{ year: "2019", value: 0.55 }, { year: "2020", value: 0.55 }, { year: "2021", value: 0.55 }], status: "warning" },
  { name: "Deuda Total a Capital Contable", category: "De Apalancamiento", values: [{ year: "2019", value: 1.2 }, { year: "2020", value: 1.2 }, { year: "2021", value: 1.24 }], status: "warning" },
  { name: "Deuda a Largo Plazo", category: "De Apalancamiento", values: [{ year: "2019", value: 0.48 }, { year: "2020", value: 0.49 }, { year: "2021", value: 0.51 }], status: "warning" },
  { name: "Margen de Utilidad", category: "De Rentabilidad", values: [{ year: "2019", value: 7.0 }, { year: "2020", value: 7.0 }, { year: "2021", value: 7.0 }], status: "healthy" },
  { name: "ROA", category: "De Rentabilidad", values: [{ year: "2019", value: 11.9 }, { year: "2020", value: 11.57 }, { year: "2021", value: 6.09 }], status: "healthy" },
  { name: "ROE", category: "De Rentabilidad", values: [{ year: "2019", value: 26.21 }, { year: "2020", value: 25.42 }, { year: "2021", value: 13.63 }], status: "healthy" },
];

const sampleBankFlows: BankFlow[] = [
  { year: 2020, month: "Enero", deposits: 3200000, withdrawals: 2800000, balance: 400000 },
  { year: 2020, month: "Febrero", deposits: 2900000, withdrawals: 2600000, balance: 300000 },
  { year: 2020, month: "Marzo", deposits: 3500000, withdrawals: 3100000, balance: 400000 },
  { year: 2020, month: "Abril", deposits: 2100000, withdrawals: 2400000, balance: -300000 },
  { year: 2020, month: "Mayo", deposits: 3800000, withdrawals: 3200000, balance: 600000 },
  { year: 2020, month: "Junio", deposits: 3400000, withdrawals: 3000000, balance: 400000 },
  { year: 2020, month: "Julio", deposits: 3100000, withdrawals: 2900000, balance: 200000 },
  { year: 2020, month: "Agosto", deposits: 3600000, withdrawals: 3300000, balance: 300000 },
  { year: 2020, month: "Septiembre", deposits: 3300000, withdrawals: 2800000, balance: 500000 },
  { year: 2020, month: "Octubre", deposits: 3700000, withdrawals: 3100000, balance: 600000 },
  { year: 2020, month: "Noviembre", deposits: 3900000, withdrawals: 3400000, balance: 500000 },
  { year: 2020, month: "Diciembre", deposits: 4200000, withdrawals: 3800000, balance: 400000 },
];

const ClientExpediente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clients, uploadDocument, removeFile } = useClients();
  const client = clients.find(c => c.id === id);
  const [extracting, setExtracting] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<boolean>(false);

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

  const handleFileUpload = (docId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.xlsx,.xls,.doc,.docx,.csv";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        uploadDocument(client.id, docId, file.name);
        toast({ title: "Archivo cargado", description: `${file.name} se subió correctamente.` });
      }
    };
    input.click();
  };

  const handleExtractAll = () => {
    setExtracting("all");
    setTimeout(() => {
      setExtractedData(true);
      setExtracting(null);
      toast({ title: "Datos extraidos", description: "La informacion financiera ha sido extraida automaticamente de los documentos." });
    }, 2500);
  };

  const formatMoney = (n: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);

  const ratioStatusIcon = (status: string) => {
    if (status === "healthy") return <CheckCircle className="w-4 h-4 text-success" />;
    if (status === "warning") return <AlertTriangle className="w-4 h-4 text-warning" />;
    return <AlertTriangle className="w-4 h-4 text-destructive" />;
  };

  const capacityResults = extractedData ? [
    { label: "Maximo por Capacidad Contable", value: formatMoney(11300000) },
    { label: "Maximo por Ventas", value: formatMoney(7700000) },
    { label: "Maximo por Palanca", value: formatMoney(5650000) },
    { label: "Maximo por Flujos", value: formatMoney(4800000) },
  ] : [];

  return (
    <AppLayout>
      <div className="p-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="w-4 h-4" /> Volver a clientes
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                {client.companyName[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold">Expediente: {client.companyName}</h1>
                <p className="text-xs text-muted-foreground">RFC: {client.rfc || "Sin registrar"} | ID: #{client.id}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={handleExtractAll} disabled={extracting !== null}>
              {extracting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" /> Extrayendo...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4" /> Extraer datos automaticamente
                </>
              )}
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> Exportar Excel
            </Button>
          </div>
        </div>

        {/* Progress summary */}
        <Card className="border mb-6">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold">Progreso del expediente</p>
                <p className="text-xs text-muted-foreground">{uploadedDocs} de {totalDocs} documentos recibidos</p>
              </div>
              <Badge variant={docProgress === 100 ? "default" : "secondary"} className="text-xs">
                {Math.round(docProgress)}% completo
              </Badge>
            </div>
            <Progress value={docProgress} className="h-2" />
          </CardContent>
        </Card>

        <Tabs defaultValue="documentos" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="documentos">Subir Documentos</TabsTrigger>
            <TabsTrigger value="estados">Estados Financieros</TabsTrigger>
            <TabsTrigger value="razones">Razones Financieras</TabsTrigger>
            <TabsTrigger value="flujos">Flujos Bancarios</TabsTrigger>
            <TabsTrigger value="capacidad">Capacidad de Pago</TabsTrigger>
          </TabsList>

          {/* === DOCUMENTOS TAB === */}
          <TabsContent value="documentos" className="space-y-4">
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
                            <p className="text-xs text-success">{doc.fileName} · {doc.uploadDate}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => handleFileUpload(doc.id)}
                      >
                        <Upload className="w-3 h-3" />
                        {doc.uploaded ? "Reemplazar" : "Subir"}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* === ESTADOS FINANCIEROS TAB === */}
          <TabsContent value="estados" className="space-y-6">
            {!extractedData ? (
              <Card className="border border-dashed">
                <CardContent className="p-12 text-center">
                  <FileSpreadsheet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Sin datos extraidos</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
                    Sube los estados financieros en la pestana de documentos y usa "Extraer datos automaticamente" para llenar esta seccion.
                  </p>
                  <Button onClick={handleExtractAll} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <FileSpreadsheet className="w-4 h-4 mr-2" /> Extraer ahora
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-sm font-semibold text-success">Datos extraidos automaticamente de los documentos subidos</span>
                </div>

                {/* Estado de Resultados */}
                <Card className="border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-accent" />
                      Estado de Resultados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Concepto</th>
                            {sampleFinancials.map(f => (
                              <th key={f.year} className="text-right p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{f.year}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { label: "Ventas Netas", key: "ventasNetas" },
                            { label: "Costo de Ventas", key: "costoVentas" },
                            { label: "Utilidad Bruta", key: "utilidadBruta", bold: true },
                            { label: "Gastos de Operacion", key: "gastosOperacion" },
                            { label: "Utilidad de Operacion", key: "utilidadOperacion", bold: true },
                            { label: "Utilidad Neta", key: "utilidadNeta", bold: true },
                          ].map(row => (
                            <tr key={row.key} className="border-b border-border last:border-0 hover:bg-muted/50">
                              <td className={`p-3 ${row.bold ? "font-semibold" : ""}`}>{row.label}</td>
                              {sampleFinancials.map(f => (
                                <td key={f.year} className={`p-3 text-right ${row.bold ? "font-semibold" : ""}`}>
                                  {formatMoney((f as any)[row.key])}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Balance General */}
                <Card className="border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-accent" />
                      Balance General
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Concepto</th>
                            {sampleFinancials.map(f => (
                              <th key={f.year} className="text-right p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{f.year}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { label: "Activo Circulante", key: "activoCirculante" },
                            { label: "Activo Fijo", key: "activoFijo" },
                            { label: "Activo Total", key: "activoTotal", bold: true },
                            { label: "Pasivo Corto Plazo", key: "pasivoCorto" },
                            { label: "Pasivo Largo Plazo", key: "pasivoLargo" },
                            { label: "Pasivo Total", key: "pasivoTotal", bold: true },
                            { label: "Capital Contable", key: "capitalContable", bold: true },
                          ].map(row => (
                            <tr key={row.key} className="border-b border-border last:border-0 hover:bg-muted/50">
                              <td className={`p-3 ${row.bold ? "font-semibold" : ""}`}>{row.label}</td>
                              {sampleFinancials.map(f => (
                                <td key={f.year} className={`p-3 text-right ${row.bold ? "font-semibold" : ""}`}>
                                  {formatMoney((f as any)[row.key])}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* === RAZONES FINANCIERAS TAB === */}
          <TabsContent value="razones" className="space-y-6">
            {!extractedData ? (
              <Card className="border border-dashed">
                <CardContent className="p-12 text-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Razones financieras no disponibles</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
                    Las razones se calculan automaticamente al extraer los estados financieros.
                  </p>
                  <Button onClick={handleExtractAll} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <FileSpreadsheet className="w-4 h-4 mr-2" /> Extraer ahora
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-sm font-semibold text-success">Razones calculadas automaticamente</span>
                </div>

                {["De Liquidez", "De Actividad", "De Apalancamiento", "De Rentabilidad"].map(cat => {
                  const ratios = sampleRatios.filter(r => r.category === cat);
                  if (ratios.length === 0) return null;
                  return (
                    <Card key={cat} className="border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{cat}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Razon</th>
                              <th className="text-right p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">2019</th>
                              <th className="text-right p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">2020</th>
                              <th className="text-right p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">2021</th>
                              <th className="text-center p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ratios.map(ratio => (
                              <tr key={ratio.name} className="border-b border-border last:border-0 hover:bg-muted/50">
                                <td className="p-3 font-medium">{ratio.name}</td>
                                {ratio.values.map(v => (
                                  <td key={v.year} className="p-3 text-right font-mono">
                                    {typeof v.value === "number" ? v.value.toFixed(2) : v.value}
                                  </td>
                                ))}
                                <td className="p-3 text-center">{ratioStatusIcon(ratio.status)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </CardContent>
                    </Card>
                  );
                })}
              </>
            )}
          </TabsContent>

          {/* === FLUJOS BANCARIOS TAB === */}
          <TabsContent value="flujos" className="space-y-6">
            {!extractedData ? (
              <Card className="border border-dashed">
                <CardContent className="p-12 text-center">
                  <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Flujos bancarios no disponibles</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
                    Sube los estados de cuenta bancarios para extraer los flujos automaticamente.
                  </p>
                  <Button onClick={handleExtractAll} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <FileSpreadsheet className="w-4 h-4 mr-2" /> Extraer ahora
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-sm font-semibold text-success">Flujos extraidos de estados de cuenta</span>
                </div>

                <Card className="border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Resumen de Flujos de Efectivo Bancarios - 2020</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mes</th>
                            <th className="text-right p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Depositos</th>
                            <th className="text-right p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Retiros</th>
                            <th className="text-right p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Saldo Neto</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sampleBankFlows.map(flow => (
                            <tr key={flow.month} className="border-b border-border last:border-0 hover:bg-muted/50">
                              <td className="p-3">{flow.month}</td>
                              <td className="p-3 text-right font-mono">{formatMoney(flow.deposits)}</td>
                              <td className="p-3 text-right font-mono">{formatMoney(flow.withdrawals)}</td>
                              <td className={`p-3 text-right font-mono font-semibold ${flow.balance >= 0 ? "text-success" : "text-destructive"}`}>
                                {formatMoney(flow.balance)}
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-muted/50 font-bold">
                            <td className="p-3">TOTAL</td>
                            <td className="p-3 text-right font-mono">{formatMoney(sampleBankFlows.reduce((a, b) => a + b.deposits, 0))}</td>
                            <td className="p-3 text-right font-mono">{formatMoney(sampleBankFlows.reduce((a, b) => a + b.withdrawals, 0))}</td>
                            <td className="p-3 text-right font-mono text-success">{formatMoney(sampleBankFlows.reduce((a, b) => a + b.balance, 0))}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* === CAPACIDAD DE PAGO TAB === */}
          <TabsContent value="capacidad" className="space-y-6">
            {!extractedData ? (
              <Card className="border border-dashed">
                <CardContent className="p-12 text-center">
                  <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Analisis de capacidad no disponible</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
                    Se requiere la extraccion de datos financieros para calcular la capacidad de pago.
                  </p>
                  <Button onClick={handleExtractAll} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <FileSpreadsheet className="w-4 h-4 mr-2" /> Extraer ahora
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-sm font-semibold text-success">Resultados de analisis de capacidad</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {capacityResults.map(item => (
                    <Card key={item.label} className="border">
                      <CardContent className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</p>
                        <p className="text-2xl font-bold mt-2">{item.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="border border-accent/30 bg-accent/5">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold">Monto maximo recomendado</p>
                        <p className="text-2xl font-bold text-accent mt-1">{formatMoney(4800000)}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Basado en el menor de los 4 criterios de capacidad. El cliente solicita {formatMoney(client.amountRequested)}.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ClientExpediente;
