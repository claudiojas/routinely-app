import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar, CheckCircle, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FinalizeWeekDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentWeekEnd: Date;
  nextWeekStart: Date;
  isLoading?: boolean;
}

const FinalizeWeekDialog: React.FC<FinalizeWeekDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentWeekEnd,
  nextWeekStart,
  isLoading = false,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <AlertDialogTitle className="text-lg font-semibold text-gray-900">
              Finalizar Semana
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-600">
            Você está finalizando a semana atual e iniciando uma nova semana de planejamento.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Semana Atual
              </span>
            </div>
            <span className="text-sm text-blue-600">
              {format(currentWeekEnd, 'dd/MM/yyyy', { locale: ptBR })}
            </span>
          </div>
          
          <div className="flex items-center justify-center my-2">
            <ArrowRight className="w-4 h-4 text-blue-400" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">
                Nova Semana
              </span>
            </div>
            <span className="text-sm text-emerald-600">
              {format(nextWeekStart, 'dd/MM/yyyy', { locale: ptBR })}
            </span>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-amber-800">
            <strong>Dica:</strong> A semana atual será movida para o histórico e você poderá planejar a próxima semana.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isLoading}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Finalizando...
              </div>
            ) : (
              'Finalizar Semana'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FinalizeWeekDialog; 