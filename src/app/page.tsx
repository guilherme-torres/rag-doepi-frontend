"use client"

import { CSSProperties, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Brain, FileText, Calendar, Loader2 } from 'lucide-react';
import ReactMarkdown from "react-markdown"
import { toast } from 'sonner';
import { List } from "react-virtualized"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QueryCard, QueryData } from '@/components/QueryCard';
import { PageControl } from '@/components/PageControl';
import { QueryDetailModal } from '@/components/QueryDetailModal';
import { dateStrToDateFormat, formatDate, isValidDate, maskOnlyNumber } from '@/lib/utils';
import { DatePicker } from '@/components/DatePicker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Combobox, respostaDoeKeyValue } from '@/components/combobox';


interface respostaDoe {
  ano: number
  dia: string
  link: string
  numero: number
  referencia: string
  tipo: string
}

interface Historico {
  total: number
  limit: number
  skip: number
  data: QueryData[]
}

const API_BASE_URL = "http://ti-guilherme:8080"

export default function App() {
  const [ultimoDoe, setUltimoDoe] = useState<respostaDoe | null>(null);
  const [listDoe, setListDoe] = useState<Array<respostaDoeKeyValue>>([]);
  const [historico, sethistorico] = useState<Historico | null>(null)
  const [aiResponseLastDoe, setAiResponseLastDoe] = useState("")
  const [aiResponseSelectedDoe, setAiResponseSelectedDoe] = useState("")
  const [isLoadingLastDoe, setIsLoadingLastDoe] = useState(false)
  const [isLoadingSelectedDoe, setIsLoadingSelectedDoe] = useState(false)
  const [activeTab, setActiveTab] = useState("last-doe")
  const [currentPage, setCurrentPage] = useState(1)
  const [modelOpen, setModalOpen] = useState(false)
  const [selectedQuery, setSelectedQuery] = useState<QueryData | null>(null)
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-pro")
  const [numeroFilter, setNumeroFilter] = useState("")
  const [edicaoFilter, setEdicaoFilter] = useState("")
  const [selectedDoe, setSelectedDoe] = useState("")
  const [selectedDoeOpen, setSelectedDoeOpen] = useState(false)

  const availableModels = [
    {
      label: "Gemini",
      models: [
        "gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.5-flash-lite",
        "gemini-2.0-flash", "gemini-2.0-flash-lite",
      ],
    },
  ]

  const handleFetchLatest = () => {
    setIsLoadingLastDoe(true)
    const searcParams = new URLSearchParams({ model: selectedModel })
    const url = `${API_BASE_URL}/doepi/last/analyze?${searcParams.toString()}`
    fetch(url, { method: "POST" })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setAiResponseLastDoe(data.response)
        setIsLoadingLastDoe(false)
      })
  };

  const handleFetchAllDoe = () => {
    if (listDoe.length > 0) return

    console.log("entrou aqui")
    fetch(`${API_BASE_URL}/doepi`)
      .then(response => response.json())
      .then(data => {
        setListDoe(data.data)
        console.log(data)
      })
  }

  const handleFetchSelectedDoe = (ref: string) => {
    console.log("buscando doe", ref)
    const searcParams = new URLSearchParams({ ref: ref, model: selectedModel })
    const url = `${API_BASE_URL}/doepi/analyze?${searcParams.toString()}`
    setIsLoadingSelectedDoe(true)
    fetch(url, { method: "POST" })
      .then(response => response.json())
      .then(data => {
        setAiResponseSelectedDoe(data.response)
        setIsLoadingSelectedDoe(false)
      })
  }

  const handleListHistory = (limit: number = 5, skip: number = 0, edicaoDoe?: string, numeroDoe?: number) => {
    const searcParams = new URLSearchParams({ limit: String(limit), skip: String(skip) })
    if (edicaoDoe)
      searcParams.set("edicao_doe", edicaoDoe)
    if (numeroDoe)
      searcParams.set("numero_doe", String(numeroDoe))
    const url = `${API_BASE_URL}/history?${searcParams.toString()}`
    console.log(url)
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        sethistorico(data)
      })
  }

  useEffect(() => {
    if (activeTab === "last-doe") {
      fetch(`${API_BASE_URL}/doepi/last`)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          setUltimoDoe(data)
        })
    }

    if (activeTab === "history") {
      handleListHistory(5, (currentPage - 1) * 5, dateStrToDateFormat(edicaoFilter), Number(numeroFilter))
    }
  }, [activeTab])

  useEffect(() => {
    handleListHistory(5, (currentPage - 1) * 5, dateStrToDateFormat(edicaoFilter), Number(numeroFilter))
  }, [currentPage])

  useEffect(() => {
    if (edicaoFilter && isValidDate(dateStrToDateFormat(edicaoFilter))) {
      handleListHistory(5, 0, dateStrToDateFormat(edicaoFilter), Number(numeroFilter))
    } else if (!edicaoFilter) {
      handleListHistory(5, 0, undefined, Number(numeroFilter))
    }
  }, [edicaoFilter, numeroFilter])

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
                  Sistema de Análise Inteligente de Atos Compilados
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-3 md:w-300">
        <div className="space-y-1 flex flex-col items-end">
          <div>
            <h4 className="text-sm text-gray-500">Modelo:</h4>
            <Select defaultValue="gemini-2.5-pro" onValueChange={setSelectedModel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o modelo de IA" />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map(model => (
                  <SelectGroup key={model.label}>
                    <SelectLabel>{model.label}</SelectLabel>
                    {model.models.map(modelName => (
                      <SelectItem key={modelName} value={modelName}>{modelName}</SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <FileText className="h-5 w-5" />
              Análise Inteligente de Atos Compilados
            </CardTitle>
            <CardDescription className="text-base">
              Utilize nossa IA avançada para identificar automaticamente alterações na planilha de Atos Compilados.
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="last-doe" value={activeTab} onValueChange={(value) => setActiveTab(value)}>
          <TabsList className="w-full mt-2">
            <TabsTrigger value="last-doe">Consultar último DOE</TabsTrigger>
            <TabsTrigger value="select-doe">Selecionar DOE</TabsTrigger>
            <TabsTrigger value="history">Histórico de consultas</TabsTrigger>
          </TabsList>
          <TabsContent value="last-doe">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Buscar último Diário Oficial
                </CardTitle>
                <CardDescription>
                  O sistema irá buscar automaticamente a edição mais recente do
                  Diário Oficial do Estado e realizar a análise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg mb-4">
                  <p className="text-sm">
                    <strong>Último DOE disponível:</strong> {ultimoDoe && ultimoDoe.dia && formatDate(ultimoDoe.dia)} {ultimoDoe && `(${ultimoDoe.tipo})`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Edição nº {`${ultimoDoe && ultimoDoe.numero}/${ultimoDoe && ultimoDoe.ano}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <a href={ultimoDoe ? ultimoDoe.link : "#"} className="text-blue-600 font-normal underline">Link para acesso</a>
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
                {isLoadingLastDoe && <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />}
                {aiResponseLastDoe && <Card className='mt-3'>
                  <CardContent>
                    <ReactMarkdown>{aiResponseLastDoe}</ReactMarkdown>
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
                <Combobox
                  items={listDoe}
                  open={selectedDoeOpen}
                  setOpen={(open) => {
                    if (open) {
                      console.log("abrindo select")
                      handleFetchAllDoe()
                      setSelectedDoeOpen(true)
                    } else {
                      console.log("fechando select")
                      setSelectedDoeOpen(false)
                    }
                  }}
                  value={selectedDoe}
                  setValue={setSelectedDoe}
                />

                <Button
                  onClick={() => { handleFetchSelectedDoe(selectedDoe) }}
                  size="lg"
                  className="w-full gap-2 mb-3"
                >
                  <Download className="h-4 w-4" />
                  Analisar
                </Button>
                {isLoadingSelectedDoe && <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />}
                {aiResponseSelectedDoe && <Card className='mt-3'>
                  <CardContent>
                    <ReactMarkdown>{aiResponseSelectedDoe}</ReactMarkdown>
                  </CardContent>
                </Card>}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Vaja abaixo o histórico de todas as consultas feitas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-5 mb-6">
                  <div>
                    <Label className="mb-2">Buscar por edição</Label>
                    <DatePicker value={edicaoFilter} onValueChange={setEdicaoFilter} />
                  </div>
                  <div>
                    <Label className="mb-2">Buscar por número</Label>
                    <Input type="text" placeholder="Ex: 120" value={maskOnlyNumber(numeroFilter)} onChange={(e) => { setNumeroFilter(e.target.value) }} />
                  </div>
                </div>

                <div className="flex flex-col gap-4 mb-8">
                  {historico && historico.data && historico.data.length > 0 && (() => {
                    return historico.data.map((query) => (
                      <QueryCard
                        key={query.id}
                        query={query}
                        onClick={() => {
                          setSelectedQuery(query);
                          setModalOpen(true);
                        }}
                      />
                    ));
                  })()}
                  {historico && historico.data && historico.data.length > 0 && (
                    <PageControl
                      totalPages={Math.max(1, Math.ceil(historico.total / historico.limit))}
                      currentPage={currentPage}
                      itemsPerPage={historico.limit}
                      setCurrentPage={setCurrentPage}
                      totalItems={historico.total}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {selectedQuery && (
        <QueryDetailModal
          isOpen={modelOpen}
          onClose={() => setModalOpen(false)}
          query={selectedQuery}
        />
      )}
    </div>
  );
}