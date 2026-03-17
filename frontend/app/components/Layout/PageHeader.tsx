/**
 * Cabeçalho com título e botão opcional
 * Exemplo: <PageHeader title="Multas" buttonText="+ Novo" onButtonClick={...} />
 */

import Spinner from '@/app/components/Loading/Spinner';

interface PageHeaderProps {
  title: string;
  buttonText?: string;
  onButtonClick?: () => void;
  loading?: boolean;
}

export default function PageHeader({ title, buttonText, onButtonClick, loading = false }: PageHeaderProps) {
  const temBotao = buttonText && onButtonClick;
  const estiloBotao = "bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2";

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-bold">{title}</h1>
      
      {temBotao && (
        <button onClick={onButtonClick} disabled={loading} className={estiloBotao}>
          {loading && <Spinner size="small" />}
          {loading ? 'Carregando...' : buttonText}
        </button>
      )}
    </div>
  );
}
