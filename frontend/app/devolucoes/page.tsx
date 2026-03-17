'use client';
import { useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useDevolucoes } from './state&actions/useDevolucoes';
import Navbar from '@/app/components/Menu/Navbar';

export default function DevolucoesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { state, actions } = useDevolucoes();

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
        <h1 className="text-4xl font-bold mb-8">Devoluções</h1>

        <div className="bg-gray-800 rounded-lg p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3">Aluno</th>
                <th className="text-left py-3">Livro</th>
                <th className="text-left py-3">Data Empréstimo</th>
                <th className="text-left py-3">Previsão Devolução</th>
                <th className="text-left py-3">Dias de Atraso</th>
                <th className="text-left py-3">Ação</th>
              </tr>
            </thead>
            <tbody>
              {state.emprestimosAtivos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    Nenhum empréstimo ativo para devolução
                  </td>
                </tr>
              ) : (
                state.emprestimosAtivos.map((emp) => (
                  <tr key={emp.id} className="border-b border-gray-700">
                    <td className="py-3">{emp.usuarioId}</td>
                    <td className="py-3">{emp.livroId}</td>
                    <td className="py-3">{new Date(emp.dataEmprestimo).toLocaleDateString()}</td>
                    <td className="py-3">{new Date(emp.dataPrevistaDevolucao).toLocaleDateString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-sm ${emp.diasAtraso > 0 ? 'bg-red-600' : 'bg-green-600'}`}>
                        {emp.diasAtraso > 0 ? `${emp.diasAtraso} dias` : 'No prazo'}
                      </span>
                    </td>
                    <td className="py-3">
                      <button 
                        onClick={() => actions.handleDevolucao(emp.id!)} 
                        disabled={state.loading}
                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm disabled:bg-gray-600 disabled:cursor-not-allowed"
                      >
                        {state.loading ? 'Processando...' : 'Registrar Devolução'}
                      </button>
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
