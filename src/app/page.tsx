"use client"

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Brain, FileText, Calendar, Loader2 } from 'lucide-react';
import ReactMarkdown from "react-markdown"
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QueryCard } from '@/components/QueryCard';
import { PageControl } from '@/components/PageControl';

const mockQueries = [
  {
    id: "q001",
    doeEdition: "245/2024",
    date: "15/09/2024",
    reference: "Art. 123, Lei 8.666/93",
    aiResponseExcerpt: "A análise indica que o processo licitatório deve seguir as modalidades previstas na Lei 8.666/93, especificamente para contratos de serviços continuados. O valor estimado de R$ 2.500.000,00 enquadra-se na modalidade concorrência...",
    fullResponse: `A análise detalhada do processo licitatório em questão revela que:\n\n1. ENQUADRAMENTO LEGAL:\nO processo deve seguir as modalidades previstas na Lei 8.666/93, especificamente para contratos de serviços continuados. O valor estimado de R$ 2.500.000,00 enquadra-se na modalidade concorrência, conforme art. 23, inciso I, alínea 'c'.\n\n2. DOCUMENTAÇÃO NECESSÁRIA:\n- Projeto básico detalhado\n- Orçamento estimativo\n- Cronograma de execução\n- Termo de referência\n- Parecer jurídico\n\n3. PRAZOS:\n- Publicação do edital: mínimo 30 dias\n- Prazo para impugnação: até 5 dias úteis\n- Prazo para esclarecimentos: até 3 dias úteis\n\n4. CRITÉRIOS DE JULGAMENTO:\nRecomenda-se o critério de menor preço, tendo em vista a natureza comum dos serviços.\n\n5. GARANTIAS:\nDeverá ser exigida garantia de execução no percentual de 5% do valor do contrato.\n\n6. CONSIDERAÇÕES ESPECIAIS:\n- Verificar necessidade de licenças ambientais\n- Confirmar disponibilidade orçamentária\n- Avaliar capacidade técnica dos potenciais licitantes\n\nEsta análise baseia-se na jurisprudência do TCU e nas orientações da AGU para processos similares.`,
    status: "processed" as const,
    topics: ["Licitação", "Lei 8.666/93", "Concorrência", "Serviços Continuados"],
    processingTime: "2.3s",
    model: "GPT-4 Turbo",
    confidence: 94
  },
  {
    id: "q002", 
    doeEdition: "244/2024",
    date: "14/09/2024",
    reference: "Decreto 10.024/2019",
    aiResponseExcerpt: "O Decreto 10.024/2019 estabelece diretrizes para a contratação de soluções de Tecnologia da Informação e Comunicação (TIC) pela administração pública federal. Para contratos de desenvolvimento de software...",
    fullResponse: `O Decreto 10.024/2019 estabelece diretrizes específicas para TIC:\n\n1. PLANEJAMENTO DA CONTRATAÇÃO:\n- Elaboração do Plano Diretor de TI (PDTI)\n- Análise de viabilidade técnica e econômica\n- Definição de arquitetura tecnológica\n\n2. METODOLOGIAS ÁGEIS:\n- Incentivo ao uso de metodologias ágeis\n- Entregas incrementais\n- Participação do usuário no desenvolvimento\n\n3. SUSTENTABILIDADE:\n- Critérios de sustentabilidade ambiental\n- Eficiência energética\n- Descarte adequado de equipamentos\n\n4. SEGURANÇA DA INFORMAÇÃO:\n- Conformidade com a LGPD\n- Implementação de controles de segurança\n- Auditoria de sistemas\n\nRecomenda-se seguir o Guia de Contratação de TI do MCTIC.`,
    status: "processed" as const,
    topics: ["TIC", "Decreto 10.024", "Software", "Metodologias Ágeis"],
    processingTime: "1.8s",
    model: "GPT-4 Turbo", 
    confidence: 97
  },
  {
    id: "q003",
    doeEdition: "243/2024", 
    date: "13/09/2024",
    reference: "Lei 14.133/2021",
    aiResponseExcerpt: "A Nova Lei de Licitações (Lei 14.133/2021) trouxe importantes mudanças no regime de contratações públicas. Entre as principais inovações está o diálogo competitivo...",
    fullResponse: `A Lei 14.133/2021 (Nova Lei de Licitações) apresenta as seguintes inovações:\n\n1. MODALIDADES DE LICITAÇÃO:\n- Concorrência\n- Concurso\n- Leilão\n- Pregão\n- Diálogo competitivo (nova modalidade)\n- Manifestação de interesse (nova modalidade)\n\n2. DIÁLOGO COMPETITIVO:\n- Para contratos complexos\n- Permite discussão com licitantes\n- Aplicável quando não for possível definir solução técnica prévia\n\n3. CRITÉRIOS DE SUSTENTABILIDADE:\n- Obrigatórios em todas as licitações\n- Preferência para produtos reciclados\n- Critérios socioambientais\n\n4. PREGÃO ELETRÔNICO:\n- Preferência absoluta\n- Processo totalmente digital\n- Maior transparência\n\n5. PRAZOS:\n- Redução de prazos em algumas modalidades\n- Maior eficiência nos processos\n\n6. COMPLIANCE:\n- Programa de integridade obrigatório\n- Canal de denúncias\n- Auditoria interna\n\nA lei entrou em vigor em abril de 2023.`,
    status: "processed" as const,
    topics: ["Nova Lei de Licitações", "Diálogo Competitivo", "Sustentabilidade"],
    processingTime: "3.1s",
    model: "GPT-4 Turbo",
    confidence: 91
  },
  {
    id: "q004",
    doeEdition: "242/2024",
    date: "12/09/2024", 
    reference: "IN SEGES 05/2017",
    aiResponseExcerpt: "A Instrução Normativa SEGES nº 05/2017 dispõe sobre as regras e diretrizes do procedimento de contratação de serviços sob o regime de execução indireta...",
    fullResponse: `A IN SEGES 05/2017 estabelece:\n\n1. CONTRATAÇÃO DE SERVIÇOS:\n- Regime de execução indireta\n- Serviços continuados e não continuados\n- Metodologia de gerenciamento de riscos\n\n2. ESTUDO TÉCNICO PRELIMINAR:\n- Análise da demanda\n- Requisitos da contratação\n- Estimativa de custos\n\n3. TERMO DE REFERÊNCIA:\n- Especificação técnica detalhada\n- Critérios de aceitação\n- Metodologia de avaliação\n\n4. FISCALIZAÇÃO:\n- Designação de fiscal técnico\n- Relatórios mensais\n- Controle de qualidade\n\n5. PAGAMENTO:\n- Vinculado à entrega\n- Medição objetiva\n- Glosas por inadequações`,
    status: "pending" as const,
    topics: ["SEGES", "Serviços", "Fiscalização"],
    processingTime: "1.5s", 
    model: "GPT-4 Turbo",
    confidence: 88
  },
  {
    id: "q005",
    doeEdition: "241/2024",
    date: "11/09/2024",
    reference: "Lei 8.429/1992",
    aiResponseExcerpt: "A Lei de Improbidade Administrativa sofreu alterações significativas com a Lei 14.230/2021. As mudanças afetam principalmente os prazos prescricionais...",
    fullResponse: `Alterações na Lei 8.429/1992 pela Lei 14.230/2021:\n\n1. PRAZOS PRESCRICIONAIS:\n- Enriquecimento ilícito: 8 anos\n- Dano ao erário: 8 anos\n- Violação aos princípios: 4 anos\n\n2. ELEMENTO SUBJETIVO:\n- Necessidade de dolo para algumas condutas\n- Diferenciação entre dolo e culpa\n- Gradação das sanções\n\n3. ACORDO DE NÃO PERSECUÇÃO CÍVEL:\n- Possibilidade de acordo\n- Reparação integral do dano\n- Suspensão da prescrição\n\n4. INDISPONIBILIDADE DE BENS:\n- Medidas cautelares\n- Proporcionalidade\n- Fundamentação específica`,
    status: "error" as const,
    topics: ["Improbidade", "Lei 8.429", "Prescrição"],
    processingTime: "0.8s",
    model: "GPT-4 Turbo", 
    confidence: 76
  }
];

interface respostaDoe {
  ano: number
  dia: string
  link: string
  numero: number
  referencia: string
  tipo: string
}

export default function App() {
  const [ultimoDoe, setUltimoDoe] = useState<respostaDoe | null>(null);
  const [listDoe, setListDoe] = useState<Array<respostaDoe>>([]);
  const [aiResponseLastDoe, setAiResponseLastDoe] = useState("")
  const [aiResponseSelectedDoe, setAiResponseSelectedDoe] = useState("")
  const [isLoadingLastDoe, setIsLoadingLastDoe] = useState(false)
  const [isLoadingSelectedDoe, setIsLoadingSelectedDoe] = useState(false)
  const [selectedDoe, setSelectedDoe] = useState("")
  const [activeTab, setActiveTab] = useState("last-doe")
  const [currentPage, setCurrentPage] = useState(1)

  const handleFetchLatest = () => {
    setIsLoadingLastDoe(true)
    fetch("http://localhost:8000/doepi/last/analyze", { method: "POST" })
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
    fetch("http://localhost:8000/doepi")
      .then(response => response.json())
      .then(data => {
        setListDoe(data.data)
        console.log(data)
      })
  }

  const handleFetchSelectedDoe = (ref: string) => {
    console.log("buscando doe", ref)
    const searcParams = new URLSearchParams({ref: ref})
    const url = `http://localhost:8000/doepi/analyze?${searcParams.toString()}`
    setIsLoadingSelectedDoe(true)
    fetch(url, { method: "POST" })
      .then(response => response.json())
      .then(data => {
        setAiResponseSelectedDoe(data.response)
        setIsLoadingSelectedDoe(false)
      })
  }

  useEffect(() => {
    if (activeTab === "last-doe") {
      fetch("http://localhost:8000/doepi/last")
        .then(response => response.json())
        .then(data => {
          console.log(data)
          setUltimoDoe(data)
        })
    }
  }, [activeTab])

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

          <Tabs defaultValue="last-doe" value={activeTab} onValueChange={(value) => setActiveTab(value)}>
            <TabsList className="w-full">
              <TabsTrigger value="last-doe">Consultar último DOE</TabsTrigger>
              <TabsTrigger value="select-doe">Selecionar DOE</TabsTrigger>
              <TabsTrigger value="history">Histórico de consultas</TabsTrigger>
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
                      <strong>Último DOE disponível:</strong> {ultimoDoe && ultimoDoe.dia && formatDate(ultimoDoe.dia)} {ultimoDoe && `(${ultimoDoe.tipo})`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Edição nº {`${ultimoDoe && ultimoDoe.numero}/${ultimoDoe && ultimoDoe.ano}`}
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
                  <Select
                    onOpenChange={(open) => { if (open) handleFetchAllDoe() }}
                    onValueChange={(value) => { setSelectedDoe(value) }}
                    value={selectedDoe}
                  >
                    <SelectTrigger className="w-[280px] mb-5">
                      <SelectValue placeholder="Selecione uma edição do DOE" />
                    </SelectTrigger>
                    <SelectContent>
                      {listDoe.map((doe) => {
                        return (
                          <SelectItem key={doe.referencia} value={doe.referencia}>
                            {`DOEPI_${doe.numero}_${doe.ano}`} - {formatDate(doe.dia)} ({doe.tipo})
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>

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
                    Vaja abaixo o histórico de cada consulta feita
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4 mb-8">
                    {mockQueries.map((query) => (
                      <QueryCard
                        key={query.id}
                        query={query}
                        onClick={() => {console.log("abrir modal")}}
                      />
                    ))}
                    <PageControl
                      totalPages={10}
                      currentPage={currentPage}
                      itemsPerPage={10}
                      setCurrentPage={setCurrentPage}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}