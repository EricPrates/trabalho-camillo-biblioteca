import { useState, useEffect } from 'react';
import { listarEmprestimos } from '@/Services/emprestimoService';
import { registrarDevolucao } from '@/Services/devolucaoService';
import { IEmprestimo } from '@/types';

export const useDevolucoes = () => {
  const [emprestimosAtivos, setEmprestimosAtivos] = useState<IEmprestimo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarEmprestimosAtivos();
  }, []);

  const carregarEmprestimosAtivos = async () => {
    try {
      const data = await listarEmprestimos();
      // Filtra apenas empréstimos ativos (não devolvidos)
      const ativos = data.filter(emp => emp.status === 'ativo' || emp.status === 'atrasado');
      setEmprestimosAtivos(ativos);
    } catch (error) {
      alert('Erro ao carregar empréstimos ativos');
    }
  };

  const handleDevolucao = async (emprestimoId: number) => {
    if (!confirm('Confirmar devolução deste livro?')) return;

    setLoading(true);
    try {
      const resultado = await registrarDevolucao(emprestimoId);
      
      if (resultado.multaAplicada) {
        alert(`Devolução registrada! Multa gerada: R$ ${resultado.valorMulta.toFixed(2)} (${resultado.diasAtraso} dias de atraso)`);
      } else {
        alert('Devolução registrada com sucesso!');
      }
      
      carregarEmprestimosAtivos();
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao registrar devolução';
      alert(mensagem);
    } finally {
      setLoading(false);
    }
  };

  return {
    state: { emprestimosAtivos, loading },
    actions: { handleDevolucao }
  };
};
