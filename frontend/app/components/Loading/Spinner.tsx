/**
 * Spinner de loading
 * Exemplo: <Spinner /> ou <Spinner size="small" />
 */

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

export default function Spinner({ size = 'medium' }: SpinnerProps) {
  const tamanhos = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  return (
    <div className="inline-block">
      <div className={`${tamanhos[size]} border-2 border-white border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );
}
