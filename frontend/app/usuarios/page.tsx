'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useUsuarios } from './state&actions/useUsuarios';
import { CampoSenha } from '@/app/components/Senha/CampoSenha';
import Navbar from '@/app/components/Menu/Navbar';

export default function UsuariosPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { state, actions } = useUsuarios();
  const [showPassword, setShowPassword] = useState(false);
  const [showMatricula, setShowMatricula] = useState(false);

  const podeAcessar = user?.tipo === 'admin';

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
          <h1 className="text-4xl font-bold">Usuários</h1>
          <button onClick={() => state.showForm ? actions.handleCancelar() : actions.setShowForm(true)} className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg">
            {state.showForm ? 'Cancelar' : '+ Novo'}
          </button>
        </div>

        {state.showForm && (
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {state.editandoId ? 'Editar Usuário' : 'Novo Usuário'}
            </h2>
            <form onSubmit={actions.handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nome"
                required
                value={state.formData.nome}
                onChange={(e) => actions.setFormData({ ...state.formData, nome: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={state.formData.email}
                onChange={(e) => actions.setFormData({ ...state.formData, email: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              />
              <CampoSenha
                label={state.editandoId ? "Senha (deixe vazio para não alterar)" : "Senha"}
                value={state.formData.senha}
                onChange={(e) => actions.setFormData({ ...state.formData, senha: e.target.value })}
                required={!state.editandoId}
                show={showPassword}
                setShow={setShowPassword}
              />
              <select
                value={state.formData.tipo}
                onChange={(e) => actions.setFormData({ ...state.formData, tipo: e.target.value as 'admin' | 'bibliotecario' | 'aluno' })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              >
                <option value="aluno">Aluno</option>
                <option value="bibliotecario">Bibliotecário</option>
                <option value="admin">Admin</option>
              </select>
              {state.formData.tipo === 'aluno' && (
                <CampoSenha
                  label="Matrícula"
                  value={state.formData.matricula}
                  onChange={(e) => actions.setFormData({ ...state.formData, matricula: e.target.value })}
                  required={true}
                  show={showMatricula}
                  setShow={setShowMatricula}
                />
              )}
              <button 
                type="submit" 
                disabled={state.loading}
                className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                <th className="text-left py-3">Nome</th>
                <th className="text-left py-3">Email</th>
                <th className="text-left py-3">Tipo</th>
                <th className="text-left py-3">Matrícula</th>
                <th className="text-left py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {state.usuarios.map((u) => (
                <tr key={u.id} className="border-b border-gray-700">
                  <td className="py-3">{u.nome}</td>
                  <td className="py-3">{u.email}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-sm ${u.tipo === 'admin' ? 'bg-red-600' : u.tipo === 'bibliotecario' ? 'bg-blue-600' : 'bg-green-600'}`}>
                      {u.tipo}
                    </span>
                  </td>
                  <td className="py-3">{u.matricula}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button onClick={() => actions.handleEditar(u)} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">Editar</button>
                      <button onClick={() => actions.handleExcluir(u.id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
}
