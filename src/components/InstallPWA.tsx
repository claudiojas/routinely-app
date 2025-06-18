
import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstall(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Verificar se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowInstall(false);
      }
      
      setDeferredPrompt(null);
    }
  };

  if (isInstalled || !showInstall) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Smartphone className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            Instalar Routinely
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Adicione o app à sua tela inicial para acesso rápido e experiência nativa.
          </p>
          <div className="flex space-x-2">
            <button
              onClick={handleInstall}
              className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-600 transition-colors flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>Instalar</span>
            </button>
            <button
              onClick={() => setShowInstall(false)}
              className="text-gray-500 px-3 py-1.5 rounded text-sm hover:text-gray-700 transition-colors"
            >
              Agora não
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowInstall(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default InstallPWA;
