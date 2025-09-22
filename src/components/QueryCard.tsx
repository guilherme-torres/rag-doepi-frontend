import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, FileText, BookOpen } from "lucide-react";


export interface Documento {
  id: number
  tipo: string
  ref: string
  link: string
  year: number
  number: number
  dia: string
}

export interface QueryData {
  ai_response: string
  ai_response_short: string
  document_id: number
  id: number
  document: Documento
}

export interface QueryCardProps {
  query: QueryData
  onClick: () => void
}

export function QueryCard({ query, onClick }: QueryCardProps) {

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow duration-200 border border-gray-200 hover:border-gray-300"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            {`DOEPI nº ${query.document.number}/${query.document.year}`}
            <a href={query.document.link} className="text-blue-600 font-normal underline">link para acesso</a>
          </CardTitle>
          {/* <Badge className={`${statusColors[query.status]} border-0`}>
            {statusLabels[query.status]}
          </Badge> */}
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{query.document.dia}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{query.document.ref}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-gray-700 line-clamp-3 leading-relaxed">
            {query.ai_response_short}
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