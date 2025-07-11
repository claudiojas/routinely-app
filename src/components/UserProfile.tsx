import React, { useState } from 'react';
import { User, Settings, Camera, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserProfile, useUpdateProfile, useUserStats } from '../hooks/useApi';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const UserProfile = () => {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading, error: profileError } = useUserProfile();
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const updateProfileMutation = useUpdateProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    avatar: profile?.avatar || '',
    preferences: {
      theme: profile?.preferences?.theme || 'dark',
      language: profile?.preferences?.language || 'pt-BR',
      notifications: profile?.preferences?.notifications ?? true
    }
  });

  const handleSave = async () => {
    try {
      await updateProfileMutation.mutateAsync(formData);
      toast.success('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      avatar: profile?.avatar || '',
      preferences: {
        theme: profile?.preferences?.theme || 'dark',
        language: profile?.preferences?.language || 'pt-BR',
        notifications: profile?.preferences?.notifications ?? true
      }
    });
    setIsEditing(false);
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="text-center p-8">
        <p className="text-red-400">Erro ao carregar perfil</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Perfil do Usuário</h1>
            <p className="text-gray-400">Gerencie suas informações pessoais</p>
          </div>
        </div>
        
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Settings className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Perfil Principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">Informações Pessoais</h2>
            
            {isEditing ? (
              <div className="space-y-4">
                {/* Avatar */}
                <div className="flex items-center space-x-4">
                  {formData.avatar ? (
                    <img 
                      src={formData.avatar} 
                      alt="Avatar" 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-semibold">
                        {formData.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      type="url"
                      placeholder="URL do avatar"
                      value={formData.avatar}
                      onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                {/* Email (somente leitura) */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <Input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="bg-white/5 border-white/10 text-gray-400"
                  />
                </div>

                {/* Preferências */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Preferências</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Tema</label>
                      <select
                        value={formData.preferences.theme}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, theme: e.target.value as 'light' | 'dark' | 'auto' }
                        }))}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2"
                      >
                        <option value="light">Claro</option>
                        <option value="dark">Escuro</option>
                        <option value="auto">Automático</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Idioma</label>
                      <select
                        value={formData.preferences.language}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, language: e.target.value as 'pt-BR' | 'en-US' | 'es' }
                        }))}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2"
                      >
                        <option value="pt-BR">Português</option>
                        <option value="en-US">English</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="notifications"
                      checked={formData.preferences.notifications}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, notifications: e.target.checked }
                      }))}
                      className="w-4 h-4 text-blue-600 bg-white/5 border-white/10 rounded"
                    />
                    <label htmlFor="notifications" className="text-sm text-gray-300">
                      Receber notificações
                    </label>
                  </div>
                </div>

                {/* Botões */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateProfileMutation.isPending ? 'Salvando...' : 'Salvar'}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Avatar */}
                <div className="flex items-center space-x-4">
                  {profile?.avatar ? (
                    <img 
                      src={profile.avatar} 
                      alt={profile.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-semibold">
                        {profile?.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-white">{profile?.name}</h3>
                    <p className="text-gray-400">{profile?.email}</p>
                  </div>
                </div>

                {/* Preferências */}
                {profile?.preferences && (
                  <div className="space-y-2">
                    <h4 className="text-md font-medium text-white">Preferências</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-400">Tema:</span>
                        <span className="text-white ml-2 capitalize">{profile.preferences.theme}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Idioma:</span>
                        <span className="text-white ml-2">{profile.preferences.language}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Notificações:</span>
                        <span className="text-white ml-2">
                          {profile.preferences.notifications ? 'Ativadas' : 'Desativadas'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">Estatísticas</h2>
            
            {statsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : stats ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total de Atividades</span>
                  <span className="text-white font-semibold">{stats.totalActivities}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Concluídas</span>
                  <span className="text-green-400 font-semibold">{stats.completedActivities}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Pendentes</span>
                  <span className="text-yellow-400 font-semibold">{stats.pendingActivities}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Sequência</span>
                  <span className="text-blue-400 font-semibold">{stats.streakDays} dias</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total de Horas</span>
                  <span className="text-purple-400 font-semibold">{stats.totalHours}h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Tipo Favorito</span>
                  <span className="text-white font-semibold capitalize">{stats.favoriteActivityType.toLowerCase()}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-center">Estatísticas não disponíveis</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 