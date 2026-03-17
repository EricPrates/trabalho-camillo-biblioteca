/**
 * Botões de filtro (ativo fica azul, outros cinza)
 * Exemplo: <FilterButtons filters={[{value:'todas', label:'Todas'}]} activeFilter="todas" />
 */

interface Filter {
  value: string;
  label: string;
}

interface FilterButtonsProps {
  filters: Filter[];
  activeFilter: string;
  onFilterChange: (value: string) => void;
}

export default function FilterButtons({ filters, activeFilter, onFilterChange }: FilterButtonsProps) {
  const estiloBase = "px-4 py-2 rounded-lg";
  const corAtivo = "bg-indigo-600";
  const corInativo = "bg-gray-700";

  return (
    <div className="flex gap-4 mb-6">
      {filters.map((filtro) => {
        const estaAtivo = activeFilter === filtro.value;
        const cor = estaAtivo ? corAtivo : corInativo;

        return (
          <button
            key={filtro.value}
            onClick={() => onFilterChange(filtro.value)}
            className={`${estiloBase} ${cor}`}
          >
            {filtro.label}
          </button>
        );
      })}
    </div>
  );
}
