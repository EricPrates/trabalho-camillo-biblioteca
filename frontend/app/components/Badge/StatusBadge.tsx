/**
 * Badge colorido de status
 * Verde=ativo/paga, Vermelho=pendente/atrasado, Azul=bibliotecario, Cinza=outros
 */

interface StatusBadgeProps {
  status: string;
}

// Cores por tipo de status
const CORES_STATUS: Record<string, string> = {
  ativo: 'bg-green-600',
  paga: 'bg-green-600',
  aluno: 'bg-green-600',
  
  atrasado: 'bg-red-600',
  pendente: 'bg-red-600',
  admin: 'bg-red-600',
  
  bibliotecario: 'bg-blue-600',
  
  devolvido: 'bg-gray-600',
  cancelada: 'bg-gray-600'
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cor = CORES_STATUS[status] || 'bg-gray-600';
  const estiloBase = "px-2 py-1 rounded text-sm";
  
  return (
    <span className={`${estiloBase} ${cor}`}>
      {status}
    </span>
  );
}
