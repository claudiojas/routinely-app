
import React, { useState } from 'react';
import { Calendar, Check, AlertCircle } from 'lucide-react';

const GoogleSyncButton = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleSync = async () => {
    setIsConnecting(true);
    
    // Simular processo de conexão
    setTimeout(() => {
      setIsConnected(!isConnected);
      setIsConnecting(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <Calendar className="h-5 w-5 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Google Calendar</h3>
          <p className="text-sm text-gray-500">
            Sincronize com sua agenda do Google
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {isConnected ? (
          <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <Check className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              Conectado ao Google Calendar
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700">
              Não conectado ao Google Calendar
            </span>
          </div>
        )}

        <button
          onClick={handleSync}
          disabled={isConnecting}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            isConnected
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isConnecting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Conectando...</span>
            </div>
          ) : isConnected ? (
            'Desconectar'
          ) : (
            'Conectar com Google'
          )}
        </button>

        {isConnected && (
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Tarefas sincronizadas são marcadas com 🔔</p>
            <p>• Blocos de tempo são criados automaticamente</p>
            <p>• Alertas são enviados conforme configurado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleSyncButton;
