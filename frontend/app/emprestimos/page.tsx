'use client';
import { useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEmprestimos } from './state&actions/useEmprestimos';
import Navbar from '@/app/components/Menu/Navbar';

export default function EmprestimosPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { state, actions } = useEmprestimos();

  const podeAcessar = user?.tipo === 'admin' || user?.tipo === 'bibliotecario';

  useEffect(() => {
    if (!podeAcessar) router.push('/dashboard');
  }, [podeAcessar, router]);

  if (!podeAcessar) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Empréstimos</h1>
          <button onClick={() => state.showForm ? actions.handleCancelar() : actions.setShowForm(true)} className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg">
            {state.showForm ? 'Cancelar' : '+ Novo Empréstimo'}
          </button>
        </div>

        {state.showForm && (
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">Novo Empréstimo</h2>
            <form onSubmit={actions.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={state.formData.usuarioId}
                onChange={(e) => actions.setFormData({ ...state.formData, usuarioId: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
                required
              >
                <option value="">Selecione o Aluno *</option>
                {state.usuarios.map(u => (
                  <option key={u.id} value={u.id}>{u.nome} - {u.matricula}</option>
                ))}
              </select>

              <select
                value={state.formData.livroId}
                onChange={(e) => actions.setFormData({ ...state.formData, livroId: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
                required
              >
                <option value="">Selecione o Livro *</option>
                {state.livros.map(l => (
                  <option key={l.id} value={l.id}>{l.titulo} - {l.autor} (Disponível: {l.quantidadeDisponivel})</option>
                ))}
              </select>

              <input
                type="date"
                value={state.formData.dataPrevistaDevolucao}
                onChange={(e) => actions.setFormData({ ...state.formData, dataPrevistaDevolucao: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
                required
              />

              <button 
                type="submit" 
                disabled={state.loading}
                className="bg-green-600 hover:bg-green-700 py-2 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {state.loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                {state.loading ? 'Registrando...' : 'Registrar Empréstimo'}
              </button>
            </form>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3">Aluno</th>
                <th className="text-left py-3">Livro</th>
                <th className="text-left py-3">Data Empréstimo</th>
                <th className="text-left py-3">Previsão Devolução</th>
                <th className="text-left py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {state.emprestimos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    Nenhum empréstimo encontrado
                  </td>
                </tr>
              ) : (
                state.emprestimos.map((emp) => (
                  <tr key={emp.id} className="border-b border-gray-700">
                    <td className="py-3">{emp.usuarioId}</td>
                    <td className="py-3">{emp.livroId}</td>
                    <td className="py-3">{new Date(emp.dataEmprestimo).toLocaleDateString()}</td>
                    <td className="py-3">{new Date(emp.dataPrevistaDevolucao).toLocaleDateString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-sm ${emp.status === 'ativo' ? 'bg-green-600' : emp.status === 'atrasado' ? 'bg-red-600' : 'bg-gray-600'}`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
}
