import { useNavigate } from "react-router-dom";
import { FolderPlus, FileBarChart, ThumbsUp, ThumbsDown, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClientActionMenuProps {
  clientId: string;
  clientName: string;
}

const ClientActionMenu = ({ clientId, clientName }: ClientActionMenuProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAction = (action: string) => {
    switch (action) {
      case "expediente":
        navigate(`/client/${clientId}/expediente`);
        break;
      case "dictamen":
        navigate(`/client/${clientId}`);
        break;
      case "aprobar":
        toast({ title: "Cliente aprobado", description: `${clientName} ha sido aprobado.` });
        break;
      case "rechazar":
        toast({ title: "Cliente rechazado", description: `${clientName} ha sido rechazado.`, variant: "destructive" });
        break;
      case "eliminar":
        toast({ title: "Cliente eliminado", description: `${clientName} ha sido eliminado.`, variant: "destructive" });
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted transition-colors"
          onClick={e => e.stopPropagation()}
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleAction("expediente")} className="gap-2 cursor-pointer">
          <FolderPlus className="w-4 h-4" />
          Crear Expediente
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction("dictamen")} className="gap-2 cursor-pointer">
          <FileBarChart className="w-4 h-4" />
          Generar Dictamen
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleAction("aprobar")} className="gap-2 cursor-pointer text-success focus:text-success">
          <ThumbsUp className="w-4 h-4" />
          Aprobar cliente
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction("rechazar")} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
          <ThumbsDown className="w-4 h-4" />
          Rechazar cliente
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleAction("eliminar")} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
          <Trash2 className="w-4 h-4" />
          Eliminar cliente
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ClientActionMenu;
