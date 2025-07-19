import React from 'react';
import { Calendar, Clock, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useActivities } from '@/hooks/useApi';
import { useWeekManagement } from '@/hooks/useWeekManagement';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';

const CompletedWeeks = () => {
  const { data: activities = [] } = useActivities();
  const { completedWeeks } = useWeekManagement();

  const getActivitiesForWeek = (weekStart: Date, weekEnd: Date) => {
    return activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= weekStart && activityDate <= weekEnd;
    });
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'PESSOAL':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'TRABALHO':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'SAUDE':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'ESTUDO':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'PESSOAL':
        return 'Pessoal';
      case 'TRABALHO':
        return 'Trabalho';
      case 'SAUDE':
        return 'Saúde';
      case 'ESTUDO':
        return 'Estudo';
      default:
        return type;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <span>Semanas Finalizadas</span>
            </h1>
            <p className="text-slate-400 mt-2">
              Histórico das últimas {completedWeeks.length} semanas concluídas
            </p>
          </div>
        </div>
      </div>

      {/* Semanas Finalizadas */}
      <div className="space-y-6">
        {completedWeeks.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Nenhuma semana finalizada ainda
              </h3>
              <p className="text-slate-400">
                As semanas finalizadas aparecerão aqui quando você usar o botão "Finalizar Semana".
              </p>
            </CardContent>
          </Card>
        ) : (
          completedWeeks.map((week, index) => {
            const weekActivities = getActivitiesForWeek(week.startDate, week.endDate);
            const weekStartFormatted = format(week.startDate, 'dd/MM/yyyy', { locale: ptBR });
            const weekEndFormatted = format(week.endDate, 'dd/MM/yyyy', { locale: ptBR });

            return (
              <Card key={week.id} className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          Semana {week.weekNumber}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          {weekStartFormatted} - {weekEndFormatted}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                      {weekActivities.length} atividades
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {weekActivities.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-400">Nenhuma atividade registrada nesta semana</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {weekActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/30"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-medium text-white">{activity.title}</h4>
                              <Badge 
                                variant="outline" 
                                className={`${getActivityTypeColor(activity.type)} text-xs`}
                              >
                                {getActivityTypeLabel(activity.type)}
                              </Badge>
                            </div>
                            {activity.description && (
                              <p className="text-slate-400 text-sm mb-2">
                                {activity.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-4 text-xs text-slate-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{format(new Date(activity.date), 'dd/MM/yyyy', { locale: ptBR })}</span>
                              </div>
                              {(activity.startTime || activity.endTime) && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    {activity.startTime && activity.endTime 
                                      ? `${activity.startTime} - ${activity.endTime}`
                                      : activity.startTime || activity.endTime
                                    }
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      {completedWeeks.length > 0 && (
        <div className="mt-8 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
          <div className="flex items-center space-x-2 text-slate-400 text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>
              Mostrando as últimas {completedWeeks.length} semanas finalizadas. 
              As semanas mais antigas são automaticamente removidas quando uma nova semana é finalizada.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedWeeks; 