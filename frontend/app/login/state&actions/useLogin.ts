import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/Services/authService';
import { useAuth } from '@/app/contexts/AuthContext';
import validator from '@/validator/validator';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const decodificarToken = (token: string) => {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return JSON.parse(payload.user);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (carregando) return;

    const validacao = validator.validarLogin({ email, senha });
    if (!validacao.valido) {
      setMessage({ type: 'error', content: validacao.mensagem || 'Erro de validação' });
      return;
    }

    setCarregando(true);
    setMessage({ type: 'loading', content: 'Carregando...' });

    try {
      const data = await login(email, senha);
      const userData = decodificarToken(data.token);

      authLogin(data.token, userData);
      setMessage({ type: 'success', content: 'Login bem-sucedido!' });
      router.push('/dashboard');
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao fazer login';
      setMessage({ type: 'error', content: mensagem });
    } finally {
      setCarregando(false);
    }
  };

  const getMessageStyle = () => {
    switch (message.type) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'loading':
        return 'text-indigo-400 animate-pulse';
      default:
        return 'text-gray-400';
    }
  };

  return {
    state: { email, senha, showPassword, message, carregando },
    actions: { setEmail, setSenha, setShowPassword, onSubmit, getMessageStyle }
  };
};
