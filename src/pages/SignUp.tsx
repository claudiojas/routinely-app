import React, { useState } from 'react';
import { Calendar, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useSignUp } from '../hooks/useApi';
import { toast } from 'sonner';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const signUpMutation = useSignUp();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      await signUpMutation.mutateAsync({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      
      toast.success('Conta criada com sucesso!');
      navigate('/');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar conta';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c1c28] to-[#101018] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20 top-10 left-10 z-0" />
      <div className="absolute w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20 bottom-10 right-10 z-0" />

      <div className="w-full max-w-md z-10">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/10 p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Criar Conta
            </h1>
            <p className="text-gray-400">Junte-se à Routinely agora</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-4">
              {/* Nome */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-12 h-12 bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Senha */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Crie uma senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-12 bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Botão */}
            <Button
              type="submit"
              disabled={signUpMutation.isPending}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-semibold transition-transform duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signUpMutation.isPending ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Criando conta...
                </div>
              ) : (
                'Criar conta'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center space-y-4 text-sm text-gray-400">
            <p>
              Já tem uma conta?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-400 hover:underline font-medium"
              >
                Entrar
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

export default SignUp;
