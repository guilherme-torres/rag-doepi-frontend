"use client"

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUpload } from '@/components/FileUpload';
import { LoadingAnalysis } from '@/components/LoadingAnalysis';
import { AnalysisResults } from '@/components/AnalysisResults';
import { Download, Brain, FileText, Calendar, RefreshCw, Loader2 } from 'lucide-react';
import ReactMarkdown from "react-markdown"
import { toast } from 'sonner';

// Mock data para demonstração
const mockAnalysisResults = [
  {
    id: '1',
    type: 'lei' as const,
    number: '15.123/2024',
    title: 'Lei de Modernização do Sistema Tributário Estadual',
    date: '11/09/2024',
    changeType: 'nova' as const,
    summary: 'Nova lei que estabelece diretrizes para a modernização do sistema tributário estadual, incluindo digitalização de processos e implementação de novos mecanismos de cobrança.',
    relevance: 'alta' as const,
    relatedLaws: ['Lei 12.456/2018', 'Decreto 8.789/2020']
  },
  {
    id: '2',
    type: 'decreto' as const,
    number: '45.678/2024',
    title: 'Regulamentação do Programa de Incentivos Fiscais para Empresas Sustentáveis',
    date: '11/09/2024',
    changeType: 'regulamentacao' as const,
    summary: 'Decreto que regulamenta a Lei 14.890/2023, estabelecendo critérios e procedimentos para concessão de incentivos fiscais a empresas que adotarem práticas sustentáveis.',
    relevance: 'media' as const,
    relatedLaws: ['Lei 14.890/2023']
  },
  {
    id: '3',
    type: 'portaria' as const,
    number: '234/2024',
    title: 'Alteração nos Procedimentos de Licenciamento Ambiental',
    date: '11/09/2024',
    changeType: 'alteracao' as const,
    summary: 'Portaria que altera os procedimentos estabelecidos na Portaria 189/2022, simplificando o processo de licenciamento ambiental para empreendimentos de baixo impacto.',
    relevance: 'media' as const,
    relatedLaws: ['Portaria 189/2022', 'Lei 13.456/2021']
  },
  {
    id: '4',
    type: 'decreto' as const,
    number: '45.234/2024',
    title: 'Revogação do Decreto sobre Taxas de Expediente',
    date: '11/09/2024',
    changeType: 'revogacao' as const,
    summary: 'Decreto que revoga integralmente o Decreto 42.123/2019 que estabelecia taxas de expediente para diversos serviços públicos estaduais.',
    relevance: 'baixa' as const,
    relatedLaws: ['Decreto 42.123/2019']
  }
];

type AppState = 'initial' | 'loading' | 'results';

interface respostaDoe {
  ano?: number
  dia?: string
  link?: string
  numero?: number
  referencia?: string
  tipo?: string
}

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>('initial');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'fetch'>('upload');
  const [ultimoDoe, setUltimoDoe] = useState<respostaDoe>({});
  const [aiResponse, setAiResponse] = useState("")

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    toast.success(`Arquivo "${file.name}" selecionado com sucesso`);
  };

  const handleAnalyze = () => {
    if (activeTab === 'upload' && !selectedFile) {
      toast.error('Por favor, selecione um arquivo PDF do Diário Oficial');
      return;
    }

    setCurrentState('loading');
    toast.info('Iniciando análise do documento...');
  };

  const handleFetchLatest = () => {
    setActiveTab('fetch');
    setCurrentState('loading');
    fetch("http://localhost:5000/analyze-last-doe", { method: "POST" })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setAiResponse(data.response)
        setCurrentState('initial')
      })
  };

  const handleAnalysisComplete = () => {
    setCurrentState('results');
    toast.success('Análise concluída! Foram encontradas alterações importantes.');
  };

  const handleReset = () => {
    setCurrentState('initial');
    setSelectedFile(null);
    setActiveTab('upload');
  };

  const getDocumentName = () => {
    if (activeTab === 'upload' && selectedFile) {
      return selectedFile.name;
    }
    return 'Diário Oficial do Estado - 11/09/2024';
  };

  useEffect(() => {
    fetch("http://localhost:5000/fetch-last-doe", { method: "POST" })
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
      {/* Header */}
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

            {currentState === 'results' && (
              <Button onClick={handleReset} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Nova Análise
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* {currentState === 'initial' && ( */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Descrição do Sistema */}
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
              {currentState === "loading" && <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />}
              {aiResponse && <Card className='mt-3'>
                <CardContent>
                  <ReactMarkdown>{aiResponse}</ReactMarkdown>
                </CardContent>
              </Card>}
            </CardContent>
          </Card>

          {/* <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'upload' | 'fetch')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Anexar DOE
                </TabsTrigger>
                <TabsTrigger value="fetch" className="gap-2">
                  <Download className="h-4 w-4" />
                  Buscar Último DOE
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-6">
                <FileUpload onFileSelect={handleFileSelect} />
                
                <div className="flex justify-center">
                  <Button 
                    onClick={handleAnalyze}
                    disabled={!selectedFile}
                    size="lg"
                    className="gap-2"
                  >
                    <Brain className="h-4 w-4" />
                    Analisar Documento
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="fetch" className="space-y-6">
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
                      className="w-full gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Analisar Último DOE
                    </Button>

                    {aiResponse && <Card className='mt-3'>
                      <CardContent></CardContent>
                    </Card>}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs> */}
        </div>
        {/* )} */}

        {/* {currentState === 'loading' && (
          <div className="flex justify-center">
            <LoadingAnalysis onComplete={handleAnalysisComplete} />
          </div>
        )} */}

        {currentState === 'results' && (
          <div className="max-w-6xl mx-auto">
            <AnalysisResults
              changes={mockAnalysisResults}
              documentName={getDocumentName()}
              analysisDate="11 de setembro de 2024, 14:32"
            />
          </div>
        )}
      </main>
    </div>
  );
}