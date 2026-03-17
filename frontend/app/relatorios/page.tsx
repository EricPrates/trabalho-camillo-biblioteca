'use client';
import { useRelatorios } from './state&actions/useRelatorios';
import PageContainer from '@/app/components/Layout/PageContainer';
import PageHeader from '@/app/components/Layout/PageHeader';
import FilterButtons from '@/app/components/Filtros/FilterButtons';
import Table from '@/app/components/Tabela/Table';

export default function RelatoriosPage() {
  const { state, actions } = useRelatorios();

  const emprestimosExibidos = state.tipoRelatorio === 'ativos' ? state.ativos : state.atrasados;

  return (
    <PageContainer>
      <PageHeader 
        title="Relatórios" 
        buttonText="Atualizar"
        onButtonClick={actions.carregarRelatorios}
        loading={state.loading}
      />

      <FilterButtons
        filters={[
          { value: 'ativos', label: `Empréstimos Ativos (${state.ativos.length})` },
          { value: 'atrasados', label: `Empréstimos Atrasados (${state.atrasados.length})` }
        ]}
        activeFilter={state.tipoRelatorio}
        onFilterChange={(value) => actions.setTipoRelatorio(value as 'ativos' | 'atrasados')}
      />

      <Table headers={['Aluno', 'Livro', 'Data Empréstimo', 'Devolução Prevista', ...(state.tipoRelatorio === 'atrasados' ? ['Dias Atraso'] : [])]}>
        {emprestimosExibidos.length === 0 ? (
          <tr>
            <td colSpan={state.tipoRelatorio === 'atrasados' ? 5 : 4} className="text-center py-8 text-gray-400">
              Nenhum empréstimo encontrado
            </td>
          </tr>
        ) : (
          emprestimosExibidos.map((emp) => {
            const diasAtraso = state.tipoRelatorio === 'atrasados' 
              ? Math.floor((new Date().getTime() - new Date(emp.dataPrevistaDevolucao).getTime()) / (1000 * 60 * 60 * 24))
              : 0;
            
            return (
              <tr key={emp.id} className={`border-b border-gray-700 ${state.tipoRelatorio === 'atrasados' ? 'bg-red-900/20' : ''}`}>
                <td className="py-3">{(emp as any).Usuario?.nome || (emp as any).usuario?.nome || 'N/A'}</td>
                <td className="py-3">{(emp as any).Livro?.titulo || (emp as any).livro?.titulo || 'N/A'}</td>
                <td className="py-3">{new Date(emp.dataEmprestimo).toLocaleDateString('pt-BR')}</td>
                <td className="py-3">{new Date(emp.dataPrevistaDevolucao).toLocaleDateString('pt-BR')}</td>
                {state.tipoRelatorio === 'atrasados' && (
                  <td className="py-3">
                    <span className="px-2 py-1 rounded bg-red-600 text-sm font-semibold">
                      {diasAtraso} {diasAtraso === 1 ? 'dia' : 'dias'}
                    </span>
                  </td>
                )}
              </tr>
            );
          })
        )}
      </Table>
    </PageContainer>
  );
}
