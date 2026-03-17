'use client';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    if (!user) return null;
    const isAdmin = user.tipo === 'admin';
    const isBibliotecario = user.tipo === 'bibliotecario';
    const isAluno = user.tipo === 'aluno';
    const isAdminOrBibliotecario = isAdmin || isBibliotecario;

    return (
        <nav className="bg-gray-800 border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/dashboard" className="text-white text-xl font-bold">
                            📚 Biblioteca
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">

                        <Link
                            href="/dashboard"
                            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Dashboard
                        </Link>

                        {/* ========== ADMIN ========== */}
                        {isAdmin && (
                            <Link
                                href="/usuarios"
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Usuários
                            </Link>
                        )}

                        {/* ========== ADMIN e BIBLIOTECÁRIO ========== */}
                        <Link
                            href="/livros"
                            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Livros
                        </Link>

                        {isAdminOrBibliotecario && (
                            <>
                                <Link
                                    href="/emprestimos"
                                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Empréstimos
                                </Link>

                                <Link
                                    href="/devolucoes"
                                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Devoluções
                                </Link>

                                <Link
                                    href="/relatorios"
                                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Relatórios
                                </Link>
                            </>
                        )}

                        {/* ========== ALUNO ========== */}
                        {isAluno && (
                            <Link
                                href="/meus-emprestimos"
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Meus Empréstimos
                            </Link>
                        )}

                        {/* ========== TODOS ========== */}
                        <Link
                            href="/multas"
                            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Multas
                        </Link>

                        {/* Usuário e Logout */}
                        <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-700">
                            <span className="text-gray-300 text-sm">
                                {user.nome} ({user.tipo})
                            </span>
                            <button
                                onClick={logout}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
