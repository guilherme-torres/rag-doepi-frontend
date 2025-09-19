import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, FileText, BookOpen } from "lucide-react";

interface QueryCardProps {
  query: {
    id: string;
    doeEdition: string;
    date: string;
    reference: string;
    aiResponseExcerpt: string;
    fullResponse: string;
    topics: string[];
  };
  onClick: () => void;
}

export function QueryCard({ query, onClick }: QueryCardProps) {
//   const statusColors = {
//     processed: "bg-green-100 text-green-800",
//     pending: "bg-yellow-100 text-yellow-800", 
//     error: "bg-red-100 text-red-800"
//   };

//   const statusLabels = {
//     processed: "Processado",
//     pending: "Pendente",
//     error: "Erro"
//   };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow duration-200 border border-gray-200 hover:border-gray-300"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            DOE {query.doeEdition}
          </CardTitle>
          {/* <Badge className={`${statusColors[query.status]} border-0`}>
            {statusLabels[query.status]}
          </Badge> */}
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{query.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{query.reference}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-gray-700 line-clamp-3 leading-relaxed">
            {query.aiResponseExcerpt}
          </p>
          {/* <div className="flex flex-wrap gap-1">
            {query.topics.map((topic, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}