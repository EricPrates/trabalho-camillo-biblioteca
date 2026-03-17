'use client';
import { useMultas } from './state&actions/useMultas';
import PageContainer from '@/app/components/Layout/PageContainer';
import PageHeader from '@/app/components/Layout/PageHeader';
import FilterButtons from '@/app/components/Filtros/FilterButtons';
import Table from '@/app/components/Tabela/Table';
import StatusBadge from '@/app/components/Badge/StatusBadge';

export default function MultasPage() {
  const { state, actions } = useMultas();
  const podeGerenciar = state.user?.tipo === 'admin' || state.user?.tipo === 'bibliotecario';

  return (
    <PageContainer>
      <PageHeader title="Multas" />

      <FilterButtons
        filters={[
          { value: 'todas', label: 'Todas' },
          { value: 'pendentes', label: 'Pendentes' },
          { value: 'pagas', label: 'Pagas' }
        ]}
        activeFilter={state.filtro}
        onFilterChange={(value) => actions.setFiltro(value as 'todas' | 'pendentes' | 'pagas')}
      />

      <Table headers={['Aluno', 'Empréstimo', 'Valor', 'Status', 'Data Pagamento', ...(podeGerenciar ? ['Ação'] : [])]}>
        {state.multas.length === 0 ? (
          <tr>
            <td colSpan={podeGerenciar ? 6 : 5} className="text-center py-8 text-gray-400">
              Nenhuma multa encontrada
            </td>
          </tr>
        ) : (
          state.multas.map((multa) => (
            <tr key={multa.id} className="border-b border-gray-700">
              <td className="py-3">{multa.usuarioId}</td>
              <td className="py-3">#{multa.emprestimoId}</td>
              <td className="py-3 font-semibold">R$ {multa.valorMulta.toFixed(2)}</td>
              <td className="py-3">
                <StatusBadge status={multa.status} />
              </td>
              <td className="py-3">
                {multa.dataPagamento ? new Date(multa.dataPagamento).toLocaleDateString() : '-'}
              </td>
              {podeGerenciar && (
                <td className="py-3">
                  {multa.status === 'pendente' && (
                    <button 
                      onClick={() => actions.handlePagar(multa.id!)} 
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                    >
                      Registrar Pagamento
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))
        )}
      </Table>
    </PageContainer>
  );
}
