import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useWeekPersistenceManager } from '../hooks/useWeekPersistenceManager';
import { useToast } from '../hooks/use-toast';

/**
 * Componente de demonstração que mostra como usar o hook de persistência.
 * Este componente pode ser usado opcionalmente para testar a persistência
 * sem afetar o sistema existente.
 */
export const WeekPersistenceDemo: React.FC = () => {
  const {
    weeks,
    activeWeek,
    completedWeeks,
    shouldShowFinalizeButton,
    canStartNewWeek,
    finalizeCurrentWeek,
    startNewWeek,
    getWeekDays,
    isLoading,
    error,
    hasBackendData,
    hasBackupData,
    refetchWeeks,
    resetBackup,
  } = useWeekPersistenceManager();

  const { toast } = useToast();

  const handleStartNewWeek = async () => {
    try {
      await startNewWeek();
      toast({
        title: "Nova semana criada!",
        description: "A semana foi criada e salva no backend.",
      });
    } catch (error) {
      toast({
        title: "Erro ao criar semana",
        description: "A semana foi criada localmente como backup.",
        variant: "destructive",
      });
    }
  };

  const handleFinalizeWeek = async () => {
    try {
      await finalizeCurrentWeek();
      toast({
        title: "Semana finalizada!",
        description: "A semana foi finalizada e salva no backend.",
      });
    } catch (error) {
      toast({
        title: "Erro ao finalizar semana",
        description: "A semana foi finalizada localmente como backup.",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    try {
      await refetchWeeks();
      toast({
        title: "Dados atualizados!",
        description: "Os dados foram sincronizados com o backend.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível sincronizar com o backend.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando dados de persistência...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Demo de Persistência de Semanas
            <div className="flex gap-2">
              {hasBackendData && (
                <Badge variant="default">Backend</Badge>
              )}
              {hasBackupData && (
                <Badge variant="secondary">Backup</Badge>
              )}
              {error && (
                <Badge variant="destructive">Erro</Badge>
              )}
            </div>
          </CardTitle>
          <CardDescription>
            Este componente demonstra o uso do hook de persistência.
            Os dados são salvos no backend e têm backup local.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Backend:</strong> {hasBackendData ? "Conectado" : "Desconectado"}
            </div>
            <div>
              <strong>Backup:</strong> {hasBackupData ? "Ativo" : "Inativo"}
            </div>
            <div>
              <strong>Semanas ativas:</strong> {weeks.filter(w => w.isActive).length}
            </div>
            <div>
              <strong>Semanas finalizadas:</strong> {completedWeeks.length}
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={handleStartNewWeek}
              disabled={!canStartNewWeek}
              variant="outline"
            >
              Iniciar Nova Semana
            </Button>
            
            <Button 
              onClick={handleFinalizeWeek}
              disabled={!shouldShowFinalizeButton}
              variant="outline"
            >
              Finalizar Semana
            </Button>
            
            <Button 
              onClick={handleRefresh}
              variant="outline"
            >
              Sincronizar
            </Button>
            
            <Button 
              onClick={resetBackup}
              variant="outline"
            >
              Resetar Backup
            </Button>
          </div>

          {/* Semana Ativa */}
          {activeWeek && (
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Semana Ativa</h4>
              <div className="text-sm space-y-1">
                <div><strong>ID:</strong> {activeWeek.id}</div>
                <div><strong>Número:</strong> {activeWeek.weekNumber}</div>
                <div><strong>Início:</strong> {activeWeek.startDate.toLocaleDateString()}</div>
                <div><strong>Fim:</strong> {activeWeek.endDate.toLocaleDateString()}</div>
                <div><strong>Status:</strong> {activeWeek.isActive ? "Ativa" : "Inativa"}</div>
              </div>
              
              {/* Dias da semana */}
              <div className="mt-3">
                <h5 className="font-medium mb-2">Dias da Semana:</h5>
                <div className="grid grid-cols-7 gap-1 text-xs">
                  {getWeekDays(activeWeek).map((day, index) => (
                    <div 
                      key={index}
                      className={`p-1 text-center rounded ${
                        day.isToday ? 'bg-blue-100 text-blue-800' : 'bg-gray-50'
                      }`}
                    >
                      <div className="font-medium">{day.dayOfWeek}</div>
                      <div>{day.date.getDate()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Erro */}
          {error && (
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <h4 className="font-semibold text-red-800 mb-2">Erro de Conexão</h4>
              <p className="text-sm text-red-600">{error.message}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 