import React, { useState } from 'react';
import { Calendar, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogin } from '../hooks/useApi';
import { validateLogin } from '../utils/validation';
import { toast } from 'sonner';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const location = useLocation();
  
  const loginMutation = useLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulário
    const validationErrors = validateLogin({ email, password });
    const errorMap: Record<string, string> = {};
    
    validationErrors.forEach(error => {
      errorMap[error.field] = error.message;
    });
    
    setErrors(errorMap);
    
    if (validationErrors.length > 0) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    try {
      await loginMutation.mutateAsync({
        email: email.trim().toLowerCase(),
        password,
      });
      
      toast.success('Login realizado com sucesso!');
      
      // Redirecionar para a rota original ou para home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c1c28] to-[#101018] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20 top-10 left-10 z-0"></div>
      <div className="absolute w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20 bottom-10 right-10 z-0"></div>

      <div className="w-full max-w-md z-10">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/10 p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Routinely
            </h1>
            <p className="text-gray-400">Organize sua rotina com estilo</p>
          </div>

          {/* Illustration */}
          <div className="flex justify-center">
            <div className="w-32 h-32 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mx-auto flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="flex space-x-1 justify-center pt-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Botão Entrar com Google */}
            <button
              type="button"
              onClick={() => {
                window.location.href = '/api/auth/google';
              }}
              className="w-full flex items-center justify-center gap-3 h-12 mb-4 bg-white text-gray-800 border border-gray-200 rounded-xl font-semibold shadow hover:bg-gray-50 transition-colors"
            >
              <FcGoogle className="h-6 w-6" />
              Entrar com Google
            </button>
            <div className="flex items-center my-2">
              <span className="flex-1 h-px bg-gray-300" />
              <span className="px-2 text-xs text-gray-400">ou</span>
              <span className="flex-1 h-px bg-gray-300" />
            </div>
            {/* Email */}
            <div className="space-y-4">
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Seu email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  className={`pl-12 h-12 bg-white/5 border text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:outline-none ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-white/10 focus:ring-blue-500'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>
                )}
              </div>

              {/* Senha */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  className={`pl-12 pr-12 h-12 bg-white/5 border text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:outline-none ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-white/10 focus:ring-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Botão */}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-semibold transition-transform duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Entrando...
                </div>
              ) : (
                'Entrar na Routinely'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center space-y-4 text-sm text-gray-400">
            <p>
              Não tem uma conta?{' '}
              <button className="text-blue-400 hover:underline font-medium"onClick={() => navigate('/signup')} >
                Criar conta
              </button>
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs">
              <span>Privacidade</span>
              <span>•</span>
              <span>Termos</span>
              <span>•</span>
              <span>Suporte</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
