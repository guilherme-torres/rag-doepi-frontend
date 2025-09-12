import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import {
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

interface LegalChange {
  id: string;
  type: "lei" | "decreto" | "portaria" | "resolucao";
  number: string;
  title: string;
  date: string;
  changeType:
    | "nova"
    | "alteracao"
    | "revogacao"
    | "regulamentacao";
  summary: string;
  relevance: "alta" | "media" | "baixa";
  relatedLaws?: string[];
}

interface AnalysisResultsProps {
  changes: LegalChange[];
  documentName: string;
  analysisDate: string;
}

export function AnalysisResults({
  changes,
  documentName,
  analysisDate,
}: AnalysisResultsProps) {
  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case "nova":
        return "bg-green-100 text-green-800 border-green-200";
      case "alteracao":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "revogacao":
        return "bg-red-100 text-red-800 border-red-200";
      case "regulamentacao":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRelevanceIcon = (relevance: string) => {
    switch (relevance) {
      case "alta":
        return (
          <AlertTriangle className="h-4 w-4 text-red-500" />
        );
      case "media":
        return <Info className="h-4 w-4 text-yellow-500" />;
      case "baixa":
        return (
          <CheckCircle className="h-4 w-4 text-green-500" />
        );
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "lei":
        return "Lei";
      case "decreto":
        return "Decreto";
      case "portaria":
        return "Portaria";
      case "resolucao":
        return "Resolução";
      default:
        return type;
    }
  };

  const getChangeTypeLabel = (type: string) => {
    switch (type) {
      case "nova":
        return "Nova";
      case "alteracao":
        return "Alteração";
      case "revogacao":
        return "Revogação";
      case "regulamentacao":
        return "Regulamentação";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header da Análise */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Análise Concluída</CardTitle>
                <p className="text-muted-foreground">
                  {documentName}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{analysisDate}</span>
              </div>
              <p className="mt-1">
                <span className="font-medium">
                  {changes.length}
                </span>{" "}
                alterações encontradas
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Resumo por Tipo */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo das Alterações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "nova",
              "alteracao",
              "revogacao",
              "regulamentacao",
            ].map((type) => {
              const count = changes.filter(
                (change) => change.changeType === type,
              ).length;
              return (
                <div
                  key={type}
                  className="text-center p-3 rounded-lg bg-muted"
                >
                  <div className="text-2xl font-bold">
                    {count}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getChangeTypeLabel(type)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Alterações */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes das Alterações</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="p-6 space-y-4">
              {changes.map((change, index) => (
                <div key={change.id}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="border"
                        >
                          {getTypeLabel(change.type)}{" "}
                          {change.number}
                        </Badge>
                        <Badge
                          className={getChangeTypeColor(
                            change.changeType,
                          )}
                        >
                          {getChangeTypeLabel(
                            change.changeType,
                          )}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {getRelevanceIcon(change.relevance)}
                          <span className="text-sm text-muted-foreground capitalize">
                            {change.relevance} relevância
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {change.date}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">
                        {change.title}
                      </h4>
                      <p className="text-muted-foreground">
                        {change.summary}
                      </p>
                    </div>

                    {change.relatedLaws &&
                      change.relatedLaws.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-1">
                            Leis relacionadas:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {change.relatedLaws.map(
                              (law, lawIndex) => (
                                <Badge
                                  key={lawIndex}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {law}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                  </div>

                  {index < changes.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}