import { IconeOlho } from './IconeOlho';

interface CampoSenhaProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required: boolean;
  show: boolean;
  setShow: (show: boolean) => void;
}

export const CampoSenha = ({ label, value, onChange, required, show, setShow }: CampoSenhaProps) => (
  <div className="relative">
    <input
      type={show ? "text" : "password"}
      placeholder={label}
      required={required}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white pr-10"
    />
    <button 
      type="button" 
      onClick={() => setShow(!show)} 
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
    >
      <IconeOlho show={show} />
    </button>
  </div>
);
