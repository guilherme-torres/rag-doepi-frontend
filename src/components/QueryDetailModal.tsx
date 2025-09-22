import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Calendar, FileText, BookOpen, Hash } from "lucide-react";
import { QueryData } from "./QueryCard";
import ReactMarkdown from "react-markdown";

interface QueryDetailModalProps {
    isOpen: boolean
    onClose: () => void
    query: QueryData
}

export function QueryDetailModal({ isOpen, onClose, query }: QueryDetailModalProps) {
    if (!query) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[800px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Consulta {`DOEPI nº ${query.document.number}/${query.document.year}`}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-600" />
                                <span>Data: {query.document.dia}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-gray-600" />
                                <span>Referência: {query.document.ref}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Hash className="w-4 h-4 text-gray-600" />
                                <span>ID: {query.id}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {/* <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-600" />
                                <span>Modelo: {query.model}</span>
                            </div> */}
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h4 className="mb-3">Resposta da IA:</h4>
                        <ReactMarkdown>
                            {query.ai_response}
                        </ReactMarkdown>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}