/**
 * Tabela com cabeçalhos e linhas
 * Exemplo: <Table headers={['Nome', 'Email']}><tr><td>João</td></tr></Table>
 */

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export default function Table({ headers, children }: TableProps) {
  const estiloContainer = "bg-gray-800 rounded-lg p-6 overflow-x-auto";
  const estiloLinhaCabecalho = "border-b border-gray-700";
  const estiloColuna = "text-left py-3";

  return (
    <div className={estiloContainer}>
      <table className="w-full">
        <thead>
          <tr className={estiloLinhaCabecalho}>
            {headers.map((nomeColuna, indice) => (
              <th key={indice} className={estiloColuna}>
                {nomeColuna}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
