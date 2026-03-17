import { useState, useEffect } from 'react';
import { listarMultas, minhasMultas, pagarMulta } from '@/Services/multaService';
import { IMulta } from '@/types';
import { useAuth } from '@/app/contexts/AuthContext';

export const useMultas = () => {
  const { user } = useAuth();
  const [multas, setMultas] = useState<IMulta[]>([]);
  const [filtro, setFiltro] = useState<'todas' | 'pendentes' | 'pagas'>('todas');

  useEffect(() => {
    carregarMultas();
  }, []);

  const carregarMultas = async () => {
    try {
      // Se for aluno, busca apenas suas multas
      const data = user?.tipo === 'aluno' 
        ? await minhasMultas() 
        : await listarMultas();
      setMultas(data);
    } catch (error) {
      alert('Erro ao carregar multas');
    }
  };

  const handlePagar = async (multaId: number) => {
    if (!confirm('Confirmar pagamento desta multa?')) return;

    try {
      await pagarMulta(multaId);
      alert('Pagamento registrado com sucesso!');
      carregarMultas();
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao registrar pagamento';
      alert(mensagem);
    }
  };

  const multasFiltradas = multas.filter(multa => {
    if (filtro === 'todas') return true;
    if (filtro === 'pendentes') return multa.status === 'pendente';
    if (filtro === 'pagas') return multa.status === 'paga';
    return true;
  });

  return {
    state: { multas: multasFiltradas, filtro, user },
    actions: { setFiltro, handlePagar }
  };
};
