import { useState } from "react";
import { Search, Building2, Globe, CheckCircle, Briefcase, CreditCard, Landmark, Cpu, Award, Medal, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from "@/components/AppLayout";
import { mockPartners } from "@/data/mockData";
import type { PartnerTier, PartnerType } from "@/types";

const tierColors: Record<PartnerTier, string> = {
  ORO: "bg-accent/10 text-accent border-accent/30",
  PLATA: "bg-muted text-muted-foreground border-muted-foreground/20",
  BRONCE: "bg-warning/10 text-warning border-warning/30",
  REVISION: "bg-info/10 text-info border-info/30",
};

const typeIcons: Record<PartnerType, React.ReactNode> = {
  BANCO: <Landmark className="w-5 h-5" />,
  FINANCIERA: <CreditCard className="w-5 h-5" />,
  FINTECH: <Cpu className="w-5 h-5" />,
  TPV: <CreditCard className="w-5 h-5" />,
  "BANCA DE INVERSION": <Building2 className="w-5 h-5" />,
};

const Partners = () => {
  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const filtered = mockPartners.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchTier = filterTier === "all" || p.tier === filterTier;
    const matchType = filterType === "all" || p.type === filterType;
    return matchSearch && matchTier && matchType;
  });

  return (
    <AppLayout>
      <div className="p-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Portafolio de Partners</h1>
          <p className="text-muted-foreground mt-1">Instituciones financieras disponibles para match crediticio</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar institucion..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filterTier} onValueChange={setFilterTier}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tiers</SelectItem>
              <SelectItem value="ORO"><span className="flex items-center gap-2"><Award className="w-3 h-3" /> Oro</span></SelectItem>
              <SelectItem value="PLATA"><span className="flex items-center gap-2"><Medal className="w-3 h-3" /> Plata</span></SelectItem>
              <SelectItem value="BRONCE"><span className="flex items-center gap-2"><Medal className="w-3 h-3" /> Bronce</span></SelectItem>
              <SelectItem value="REVISION"><span className="flex items-center gap-2"><RefreshCw className="w-3 h-3" /> Revision</span></SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="BANCO"><span className="flex items-center gap-2"><Landmark className="w-3 h-3" /> Banco</span></SelectItem>
              <SelectItem value="FINANCIERA"><span className="flex items-center gap-2"><CreditCard className="w-3 h-3" /> Financiera</span></SelectItem>
              <SelectItem value="FINTECH"><span className="flex items-center gap-2"><Cpu className="w-3 h-3" /> Fintech</span></SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <Badge variant="outline" className="px-3 py-1 text-sm">{filtered.length} instituciones</Badge>
          <Badge className={`${tierColors.ORO} px-3 py-1 text-sm`}>{mockPartners.filter(p => p.tier === "ORO").length} Oro</Badge>
          <Badge className={`${tierColors.PLATA} px-3 py-1 text-sm`}>{mockPartners.filter(p => p.tier === "PLATA").length} Plata</Badge>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(partner => (
            <Card key={partner.id} className="border hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-muted-foreground">
                      {typeIcons[partner.type]}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{partner.name}</p>
                      <p className="text-xs text-muted-foreground">{partner.type}</p>
                    </div>
                  </div>
                  <Badge className={`${tierColors[partner.tier]} text-xs border`}>{partner.tier}</Badge>
                </div>

                {/* Products */}
                <div className="mb-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-1.5">Productos</p>
                  <div className="flex flex-wrap gap-1">
                    {partner.products.creditoSimple && <Badge variant="secondary" className="text-xs">Credito Simple</Badge>}
                    {partner.products.creditoRevolvente && <Badge variant="secondary" className="text-xs">Revolvente</Badge>}
                    {partner.products.factoraje && <Badge variant="secondary" className="text-xs">Factoraje</Badge>}
                    {partner.products.arrendamiento && <Badge variant="secondary" className="text-xs">Arrendamiento</Badge>}
                  </div>
                </div>

                {/* Sectors */}
                <div className="mb-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-1.5">Sectores</p>
                  <div className="flex flex-wrap gap-1">
                    {partner.sectors.comercio && <Badge variant="outline" className="text-xs">Comercio</Badge>}
                    {partner.sectors.industria && <Badge variant="outline" className="text-xs">Industria</Badge>}
                    {partner.sectors.servicios && <Badge variant="outline" className="text-xs">Servicios</Badge>}
                    {partner.sectors.primario && <Badge variant="outline" className="text-xs">Primario</Badge>}
                  </div>
                </div>

                {/* Coverage & Contract */}
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
      </div>
    </AppLayout>
  );
};

export default Partners;
