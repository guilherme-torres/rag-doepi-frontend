import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Loader2, FileText, Brain, Search, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface LoadingAnalysisProps {
  onComplete: () => void;
}

export function LoadingAnalysis({ onComplete }: LoadingAnalysisProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { id: 0, label: 'Processando documento PDF', icon: FileText, duration: 2000 },
    { id: 1, label: 'Extraindo texto e estrutura', icon: Search, duration: 3000 },
    { id: 2, label: 'Analisando com IA (LLM)', icon: Brain, duration: 4000 },
    { id: 3, label: 'Identificando alterações legais', icon: CheckCircle, duration: 2000 },
  ];

  useEffect(() => {
    const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 100;
      const currentProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(currentProgress);

      // Determinar o step atual baseado no progresso
      let stepProgress = 0;
      let newCurrentStep = 0;
      
      for (let i = 0; i < steps.length; i++) {
        stepProgress += (steps[i].duration / totalDuration) * 100;
        if (currentProgress <= stepProgress) {
          newCurrentStep = i;
          break;
        } else {
          newCurrentStep = i + 1;
        }
      }
      
      setCurrentStep(Math.min(newCurrentStep, steps.length - 1));

      if (elapsed >= totalDuration) {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8 space-y-6">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Analisando Diário Oficial
          </h3>
          <p className="text-muted-foreground">
            Nosso sistema RAG está processando o documento para identificar alterações em leis e decretos
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Progresso da análise</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isPending = index > currentStep;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isCompleted
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : isCurrent
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <div className={`flex-shrink-0 ${
                  isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-muted-foreground'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : isCurrent ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span className="font-medium">{step.label}</span>
              </div>
            );
          })}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Utilizando modelo de linguagem avançado para análise jurídica
        </div>
      </CardContent>
    </Card>
  );
}