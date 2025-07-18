import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('auth_token', token);
      
      // Extrair dados do usuário do JWT
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = {
          id: payload.userId,
          email: payload.email,
          name: payload.email.split('@')[0] // Nome temporário baseado no email
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Login com Google realizado com sucesso!');
        navigate('/', { replace: true });
      } catch (error) {
        toast.error('Erro ao processar dados do usuário.');
      }
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