'use client';
import { useAuth } from '@/app/contexts/AuthContext';
import PageContainer from '@/app/components/Layout/PageContainer';
import StatusBadge from '@/app/components/Badge/StatusBadge';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  const isAdmin = user.tipo === 'admin';
  const isBibliotecario = user.tipo === 'bibliotecario';
  const isAluno = user.tipo === 'aluno';

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Olá, {user.nome.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-400">
          {isAdmin && 'Controlador e Gerente do Sistema'}
          {isBibliotecario && 'Gerencie empréstimos e devoluções'}
          {isAluno && 'Consulte seus empréstimos e multas'}
        </p>
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-lg mb-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Seu Perfil</h2>
            <p className="text-indigo-100 mb-1">📧 {user.email}</p>
            {user.matricula && <p className="text-indigo-100">🎓 Matrícula: {user.matricula}</p>}
          </div>
          <div className="text-right">
            <StatusBadge status={user.tipo} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/livros" className="bg-gray-800 hover:bg-gray-750 p-6 rounded-lg border border-gray-700 hover:border-indigo-500 transition-all cursor-pointer">
          <div className="text-4xl mb-2">📚</div>
          <h3 className="text-lg font-semibold mb-1">Livros</h3>
          <p className="text-gray-400 text-sm">Consultar acervo</p>
        </Link>

        {(isAdmin || isBibliotecario) && (
          <Link href="/emprestimos" className="bg-gray-800 hover:bg-gray-750 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition-all cursor-pointer">
            <div className="text-4xl mb-2">📖</div>
            <h3 className="text-lg font-semibold mb-1">Empréstimos</h3>
            <p className="text-gray-400 text-sm">Gerenciar empréstimos</p>
          </Link>
        )}

        {(isAdmin || isBibliotecario) && (
          <Link href="/devolucoes" className="bg-gray-800 hover:bg-gray-750 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-all cursor-pointer">
            <div className="text-4xl mb-2">↩️</div>
            <h3 className="text-lg font-semibold mb-1">Devoluções</h3>
            <p className="text-gray-400 text-sm">Registrar devoluções</p>
          </Link>
        )}

        {isAluno && (
          <Link href="/meus-emprestimos" className="bg-gray-800 hover:bg-gray-750 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition-all cursor-pointer">
            <div className="text-4xl mb-2">📖</div>
            <h3 className="text-lg font-semibold mb-1">Meus Empréstimos</h3>
            <p className="text-gray-400 text-sm">Ver meus livros</p>
          </Link>
        )}

        <Link href="/multas" className="bg-gray-800 hover:bg-gray-750 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition-all cursor-pointer">
          <div className="text-4xl mb-2">💰</div>
          <h3 className="text-lg font-semibold mb-1">Multas</h3>
          <p className="text-gray-400 text-sm">
            {isAluno ? 'Minhas multas' : 'Gerenciar multas'}
          </p>
        </Link>

        {(isAdmin || isBibliotecario) && (
          <Link href="/relatorios" className="bg-gray-800 hover:bg-gray-750 p-6 rounded-lg border border-gray-700 hover:border-yellow-500 transition-all cursor-pointer">
            <div className="text-4xl mb-2">📊</div>
            <h3 className="text-lg font-semibold mb-1">Relatórios</h3>
            <p className="text-gray-400 text-sm">Visualizar estatísticas</p>
          </Link>
        )}

        {isAdmin && (
          <Link href="/usuarios" className="bg-gray-800 hover:bg-gray-750 p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition-all cursor-pointer">
            <div className="text-4xl mb-2">👥</div>
            <h3 className="text-lg font-semibold mb-1">Usuários</h3>
            <p className="text-gray-400 text-sm">Gerenciar usuários</p>
          </Link>
        )}
      </div>

      <footer className="mt-12 pt-8 border-t border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-100 mb-6">
          <div>
            <h4 className="font-semibold mb-3 text-indigo-400">📚 Biblioteca Online</h4>
            <p className="text-gray-400 text-sm mb-2">
              Sistema completo de gerenciamento de biblioteca
            </p>
            <p className="text-gray-500 text-xs">Versão 1.0.0</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-indigo-400">ℹ️ Informações</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>📅 {new Date().toLocaleDateString('pt-BR')}</p>
              <p>⏰ {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
              <p className="text-xs text-gray-500 mt-3">
                Logado: <span className="text-indigo-400">{user.nome}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Biblioteca Online 
          </p>
        </div>
      </footer>

    </PageContainer>
  );
}
