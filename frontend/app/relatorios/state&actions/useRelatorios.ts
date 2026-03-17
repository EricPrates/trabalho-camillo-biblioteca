import { useState, useEffect } from 'react';
import { emprestimosAtivos, emprestimosAtrasados } from '@/Services/relatorioService';
import { IEmprestimo } from '@/types';
import { useAuth } from '@/app/contexts/AuthContext';

export const useRelatorios = () => {
  const { user } = useAuth();
  const [ativos, setAtivos] = useState<IEmprestimo[]>([]);
  const [atrasados, setAtrasados] = useState<IEmprestimo[]>([]);
  const [tipoRelatorio, setTipoRelatorio] = useState<'ativos' | 'atrasados'>('ativos');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarRelatorios();
  }, []);

  const carregarRelatorios = async () => {
    setLoading(true);
    try {
      const [resAtivos, resAtrasados] = await Promise.all([
        emprestimosAtivos(),
        emprestimosAtrasados()
      ]);
      
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      setAtivos(resAtivos.emprestimos);
      setAtrasados(resAtrasados.emprestimos);
    } catch (error) {
      alert('Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  return {
    state: { ativos, atrasados, tipoRelatorio, user, loading },
    actions: { setTipoRelatorio, carregarRelatorios }
  };
};
