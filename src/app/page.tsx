"use client"

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Brain, FileText, Calendar, Loader2 } from 'lucide-react';
import ReactMarkdown from "react-markdown"
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


interface respostaDoe {
  ano?: number
  dia?: string
  link?: string
  numero?: number
  referencia?: string
  tipo?: string
}

export default function App() {
  const [ultimoDoe, setUltimoDoe] = useState<respostaDoe>({});
  const [listDoe, setListDoe] = useState<Array<respostaDoe>>([]);
  const [aiResponse, setAiResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleFetchLatest = () => {
    setIsLoading(true)
    fetch("http://localhost:8000/doepi/last/analyze", { method: "POST" })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setAiResponse(data.response)
        setIsLoading(false)
      })
  };

  const handleFetchAllDoe = () => {
    fetch("http://localhost:8000/doepi")
      .then(response => response.json())
      .then(data => {
        setListDoe(data.data)
      })
  }

  useEffect(() => {
    fetch("http://localhost:8000/doepi/last")
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setUltimoDoe(data)
      })
  }, [])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("pt-BR")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">RAG Jurídico DOE</h1>
                <p className="text-sm text-muted-foreground">
                  Sistema de Análise Inteligente de Diários Oficiais
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <FileText className="h-5 w-5" />
                Análise Inteligente de Mudanças Legais
              </CardTitle>
              <CardDescription className="text-base">
                Utilize nossa IA avançada para identificar automaticamente alterações em leis,
                decretos e portarias publicadas no Diário Oficial do Estado
              </CardDescription>
            </CardHeader>
          </Card>

          <Tabs defaultValue="last-doe">
            <TabsList className="w-full">
              <TabsTrigger value="last-doe">Consultar último DOE</TabsTrigger>
              <TabsTrigger value="select-doe">Selecionar DOE</TabsTrigger>
            </TabsList>
            <TabsContent value="last-doe">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Buscar Último Diário Oficial
                  </CardTitle>
                  <CardDescription>
                    O sistema irá buscar automaticamente a edição mais recente do
                    Diário Oficial do Estado e realizar a análise
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg mb-4">
                    <p className="text-sm">
                      <strong>Último DOE disponível:</strong> {ultimoDoe.dia && formatDate(ultimoDoe.dia)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Edição nº {ultimoDoe.numero}/{ultimoDoe.ano}
                    </p>
                  </div>

                  <Button
                    onClick={handleFetchLatest}
                    size="lg"
                    className="w-full gap-2 mb-3"
                  >
                    <Download className="h-4 w-4" />
                    Analisar Último DOE
                  </Button>
                  {isLoading && <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />}
                  {aiResponse && <Card className='mt-3'>
                    <CardContent>
                      <ReactMarkdown>{aiResponse}</ReactMarkdown>
                    </CardContent>
                  </Card>}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="select-doe">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Selecione um DOE para fazer a consulta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* <div className="bg-muted p-4 rounded-lg mb-4">
                    <p className="text-sm">
                      <strong>Último DOE disponível:</strong> {ultimoDoe.dia && formatDate(ultimoDoe.dia)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Edição nº {ultimoDoe.numero}/{ultimoDoe.ano}
                    </p>
                    <button onClick={handleFetchAllDoe}>buscar does</button>
                  </div> */}
                  <Select>
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Selecione uma edição do DOE" onClick={handleFetchAllDoe} />
                    </SelectTrigger>
                    <SelectContent>
                      {listDoe.map((doe) => (
                        <SelectItem value={`DOEPI_${doe.numero}_${doe.ano}`}>{`DOEPI_${doe.numero}_${doe.ano}`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={handleFetchLatest}
                    size="lg"
                    className="w-full gap-2 mb-3"
                  >
                    <Download className="h-4 w-4" />
                    Analisar Último DOE
                  </Button>
                  {isLoading && <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />}
                  {aiResponse && <Card className='mt-3'>
                    <CardContent>
                      <ReactMarkdown>{aiResponse}</ReactMarkdown>
                    </CardContent>
                  </Card>}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}