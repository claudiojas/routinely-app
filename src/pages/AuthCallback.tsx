import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // Salva o token (ajuste para o método usado no seu app)
      localStorage.setItem('token', token);
      toast.success('Login com Google realizado com sucesso!');
      // Redireciona para a home
      navigate('/', { replace: true });
    } else {
      toast.error('Token de autenticação não encontrado.');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg text-gray-700">Processando login com Google...</div>
    </div>
  );
};

export default AuthCallback; 