import { useState, useEffect } from 'react';
import { meusEmprestimos } from '@/Services/emprestimoService';
import { IEmprestimo } from '@/types';

export const useMeusEmprestimos = () => {
  const [emprestimos, setEmprestimos] = useState<IEmprestimo[]>([]);
  const [filtro, setFiltro] = useState<'todos' | 'ativos' | 'devolvidos'>('todos');

  useEffect(() => {
    carregarMeusEmprestimos();
  }, []);

  const carregarMeusEmprestimos = async () => {
    try {
      const data = await meusEmprestimos();
      setEmprestimos(data);
    } catch (error) {
      alert('Erro ao carregar seus empréstimos');
    }
  };

  const emprestimosFiltrados = emprestimos.filter(emp => {
    if (filtro === 'todos') return true;
    if (filtro === 'ativos') return emp.status === 'ativo' || emp.status === 'atrasado';
    if (filtro === 'devolvidos') return emp.status === 'devolvido';
    return true;
  });

  return {
    state: { emprestimos: emprestimosFiltrados, filtro },
    actions: { setFiltro }
  };
};
