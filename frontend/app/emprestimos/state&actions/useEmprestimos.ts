import { useState, useEffect } from 'react';
import { listarEmprestimos, criarEmprestimo } from '@/Services/emprestimoService';
import { listarLivros } from '@/Services/livroService';
import { listarUsuarios } from '@/Services/usuarioService';
import { IEmprestimo, ILivro, IUsuario } from '@/types';

export const useEmprestimos = () => {
  const [emprestimos, setEmprestimos] = useState<IEmprestimo[]>([]);
  const [livros, setLivros] = useState<ILivro[]>([]);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ usuarioId: '', livroId: '', dataPrevistaDevolucao: '' });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [empData, livrosData, usuariosData] = await Promise.all([
        listarEmprestimos(),
        listarLivros(),
        listarUsuarios()
      ]);
      setEmprestimos(empData);
      setLivros(livrosData.filter(l => l.quantidadeDisponivel > 0));
      setUsuarios(usuariosData.filter(u => u.tipo === 'aluno'));
    } catch (error) {
      alert('Erro ao carregar dados');
    }
  };

  const resetarForm = () => {
    setShowForm(false);
    setFormData({ usuarioId: '', livroId: '', dataPrevistaDevolucao: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.usuarioId || !formData.livroId || !formData.dataPrevistaDevolucao) {
      alert('Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      await criarEmprestimo({
        usuarioId: parseInt(formData.usuarioId),
        livroId: parseInt(formData.livroId),
        dataPrevistaDevolucao: formData.dataPrevistaDevolucao
      });
      alert('Empréstimo registrado!');
      resetarForm();
      carregarDados();
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao registrar empréstimo';
      alert(mensagem);
    } finally {
      setLoading(false);
    }
  };

  return {
    state: { emprestimos, livros, usuarios, showForm, formData, loading },
    actions: { setShowForm, setFormData, handleSubmit, handleCancelar: resetarForm }
  };
};
