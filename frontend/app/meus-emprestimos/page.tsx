'use client';
import { useMeusEmprestimos } from './state&actions/useMeusEmprestimos';
import Navbar from '@/app/components/Menu/Navbar';

export default function MeusEmprestimosPage() {
  const { state, actions } = useMeusEmprestimos();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Meus Empréstimos</h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => actions.setFiltro('todos')}
            className={`px-4 py-2 rounded-lg ${state.filtro === 'todos' ? 'bg-indigo-600' : 'bg-gray-700'}`}
          >
            Todos
          </button>
          <button
            onClick={() => actions.setFiltro('ativos')}
            className={`px-4 py-2 rounded-lg ${state.filtro === 'ativos' ? 'bg-indigo-600' : 'bg-gray-700'}`}
          >
            Ativos
          </button>
          <button
            onClick={() => actions.setFiltro('devolvidos')}
            className={`px-4 py-2 rounded-lg ${state.filtro === 'devolvidos' ? 'bg-indigo-600' : 'bg-gray-700'}`}
          >
            Devolvidos
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3">Livro</th>
                <th className="text-left py-3">Data Empréstimo</th>
                <th className="text-left py-3">Previsão Devolução</th>
                <th className="text-left py-3">Data Devolução</th>
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
                    <td className="py-3">{emp.livroId}</td>
                    <td className="py-3">{new Date(emp.dataEmprestimo).toLocaleDateString()}</td>
                    <td className="py-3">{new Date(emp.dataPrevistaDevolucao).toLocaleDateString()}</td>
                    <td className="py-3">
                      {emp.dataDevolucao ? new Date(emp.dataDevolucao).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-sm ${
                        emp.status === 'ativo' ? 'bg-green-600' : 
                        emp.status === 'atrasado' ? 'bg-red-600' : 'bg-gray-600'
                      }`}>
                        {emp.status}
                        {emp.diasAtraso > 0 && ` (${emp.diasAtraso} dias)`}
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
