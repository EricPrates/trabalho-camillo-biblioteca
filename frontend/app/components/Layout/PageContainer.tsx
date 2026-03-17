import Navbar from '../Menu/Navbar';

/**
 * Container padrão para todas as páginas
 * Adiciona: Navbar + Fundo escuro + Centralização
 */
export default function PageContainer({ children }: { children: React.ReactNode }) {
  const fundoEscuro = "min-h-screen bg-gray-900 text-white";
  const espacamento = "p-8";
  const centralizacao = "max-w-7xl mx-auto";

  return (
    <div className={fundoEscuro}>
      <Navbar />
      <div className={espacamento}>
        <div className={centralizacao}>
          {children}
        </div>
      </div>
    </div>
  );
}
