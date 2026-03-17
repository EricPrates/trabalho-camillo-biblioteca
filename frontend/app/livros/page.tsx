'use client';
import { useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useLivros } from './state&actions/useLivros';
import Navbar from '@/app/components/Menu/Navbar';

export default function LivrosPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { state, actions } = useLivros();

  const podeGerenciar = user?.tipo === 'admin' || user?.tipo === 'bibliotecario';

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Livros</h1>
          {podeGerenciar && (
            <button 
              onClick={() => state.showForm ? actions.handleCancelar() : actions.setShowForm(true)} 
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg"
            >
              {state.showForm ? 'Cancelar' : '+ Novo Livro'}
            </button>
          )}
        </div>

        {podeGerenciar && state.showForm && (
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {state.editandoId ? 'Editar Livro' : 'Novo Livro'}
            </h2>
            <form onSubmit={actions.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Título *"
                required
                value={state.formData.titulo}
                onChange={(e) => actions.setFormData({ ...state.formData, titulo: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Autor *"
                required
                value={state.formData.autor}
                onChange={(e) => actions.setFormData({ ...state.formData, autor: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Editora"
                value={state.formData.editora}
                onChange={(e) => actions.setFormData({ ...state.formData, editora: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              />
              <input
                type="number"
                placeholder="Ano de Publicação"
                value={state.formData.anoPublicacao}
                onChange={(e) => actions.setFormData({ ...state.formData, anoPublicacao: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Categoria"
                value={state.formData.categoria}
                onChange={(e) => actions.setFormData({ ...state.formData, categoria: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Localização (ex: Estante A, Prateleira 3)"
                value={state.formData.localizacao}
                onChange={(e) => actions.setFormData({ ...state.formData, localizacao: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              />
              {!state.editandoId && (
                <input
                  type="number"
                  placeholder="Quantidade Total *"
                  required
                  min="1"
                  value={state.formData.quantidadeTotal}
                  onChange={(e) => actions.setFormData({ ...state.formData, quantidadeTotal: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white md:col-span-2"
                />
              )}
              <button 
                type="submit" 
                disabled={state.loading}
                className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg md:col-span-2 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {state.loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                {state.loading ? 'Salvando...' : state.editandoId ? 'Atualizar' : 'Cadastrar'}
              </button>
            </form>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3">Título</th>
                <th className="text-left py-3">Autor</th>
                <th className="text-left py-3">Categoria</th>
                <th className="text-left py-3">Disponível</th>
                {podeGerenciar && <th className="text-left py-3">Total</th>}
                {podeGerenciar && <th className="text-left py-3">Ações</th>}
              </tr>
            </thead>
            <tbody>
              {state.livros.length === 0 ? (
                <tr>
                  <td colSpan={podeGerenciar ? 6 : 4} className="text-center py-8 text-gray-400">
                    Nenhum livro encontrado
                  </td>
                </tr>
              ) : (
                state.livros.map((livro) => (
                  <tr key={livro.id} className="border-b border-gray-700">
                    <td className="py-3">{livro.titulo}</td>
                    <td className="py-3">{livro.autor}</td>
                    <td className="py-3">{livro.categoria}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-sm ${livro.quantidadeDisponivel > 0 ? 'bg-green-600' : 'bg-red-600'}`}>
                        {livro.quantidadeDisponivel}
                      </span>
                    </td>
                    {podeGerenciar && <td className="py-3">{livro.quantidadeTotal}</td>}
                    {podeGerenciar && (
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button onClick={() => actions.handleEditar(livro)} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
                            Editar
                          </button>
                          <button onClick={() => actions.handleExcluir(livro.id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">
                            Excluir
                          </button>
                        </div>
                      </td>
                    )}
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
