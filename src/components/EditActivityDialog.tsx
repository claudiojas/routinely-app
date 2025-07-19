import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useUpdateActivity, Activity } from '../hooks/useApi';
import { UpdateActivityRequest } from '../types/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { useToast } from './ui/use-toast';

// Schema de validação
const editActivitySchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  type: z.enum(['PESSOAL', 'TRABALHO', 'ESTUDO', 'SAUDE', 'OUTRO']),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:MM)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:MM)'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
});

type EditActivityFormData = z.infer<typeof editActivitySchema>;

interface EditActivityDialogProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
}

const ACTIVITY_TYPES = [
  { value: 'PESSOAL', label: '🏠 Pessoal' },
  { value: 'TRABALHO', label: '💼 Trabalho' },
  { value: 'ESTUDO', label: '📚 Estudo' },
  { value: 'SAUDE', label: '💪 Saúde' },
  { value: 'OUTRO', label: '📝 Outro' },
] as const;

export function EditActivityDialog({ activity, isOpen, onClose }: EditActivityDialogProps) {
  const { toast } = useToast();
  const updateActivity = useUpdateActivity();
  
  const form = useForm<EditActivityFormData>({
    resolver: zodResolver(editActivitySchema),
    defaultValues: {
      title: activity?.title || '',
      description: activity?.description || '',
      type: activity?.type || 'PESSOAL',
      startTime: activity?.startTime || '',
      endTime: activity?.endTime || '',
      date: activity?.date || format(new Date(), 'yyyy-MM-dd'),
    },
  });

  // Reset form when activity changes
  React.useEffect(() => {
    if (activity) {
      form.reset({
        title: activity.title,
        description: activity.description || '',
        type: activity.type,
        startTime: activity.startTime,
        endTime: activity.endTime,
        date: activity.date,
      });
    }
  }, [activity, form]);

  const onSubmit = async (data: EditActivityFormData) => {
    if (!activity) return;

    try {
      const updateData: UpdateActivityRequest = {
        title: data.title,
        description: data.description,
        type: data.type,
        startTime: data.startTime,
        endTime: data.endTime,
        date: data.date,
      };

      await updateActivity.mutateAsync({
        id: activity.id,
        data: updateData,
      });

      toast({
        title: '✅ Atividade atualizada!',
        description: 'A atividade foi editada com sucesso.',
      });

      onClose();
    } catch (error) {
      console.error('Erro ao atualizar atividade:', error);
      toast({
        title: '❌ Erro ao atualizar',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Atividade</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="Nome da atividade"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={form.watch('type')}
                onValueChange={(value) => form.setValue('type', value as 'PESSOAL' | 'TRABALHO' | 'ESTUDO' | 'SAUDE' | 'OUTRO')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.type && (
                <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Descrição da atividade (opcional)"
              rows={3}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                {...form.register('date')}
              />
              {form.formState.errors.date && (
                <p className="text-sm text-red-500">{form.formState.errors.date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Início *</Label>
              <Input
                id="startTime"
                type="time"
                {...form.register('startTime')}
              />
              {form.formState.errors.startTime && (
                <p className="text-sm text-red-500">{form.formState.errors.startTime.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Fim *</Label>
              <Input
                id="endTime"
                type="time"
                {...form.register('endTime')}
              />
              {form.formState.errors.endTime && (
                <p className="text-sm text-red-500">{form.formState.errors.endTime.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updateActivity.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateActivity.isPending}
            >
              {updateActivity.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 