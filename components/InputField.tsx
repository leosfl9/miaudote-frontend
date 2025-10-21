"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { IMaskInput } from "react-imask";

// tipagem das props do input
interface InputFieldProps extends React.ComponentProps<"input"> {
  label: string;
  mask?: any;
  error?: string;
}

// componente de input
const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, mask, error, id, className, type = "text", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false); // estado de exibição de senha

    const inputId = id ?? props.name;

    const isPassword = type === "password"; // verifica se o input é de senha
    const inputType = isPassword && showPassword ? "text" : type; // altera o tipo do input para text, exibindo a senha quando o usuário clica no ícone de olho

    // se a prop mask for instanciada, cria um input mascarado
    const inputElement = mask ? (
      <IMaskInput id={inputId} inputRef={ref as any} type={inputType} mask={mask} {...props}
        value={props.value !== undefined ? String(props.value) : undefined}
        className={`border p-2 rounded-md focus:outline-none focus:ring-0 focus:border-miau-green w-full text-text-black
          placeholder:text-text-gray focus:placeholder:text-miau-green ${error ? "border-red-500" : "border-input-bd"} ${className}`} />
    ) : (
      // se a prop mask não for indicada, cria um input normal
      <input id={inputId} ref={ref} type={inputType} {...props}
        className={`border p-2 rounded-md focus:outline-none focus:ring-0 focus:border-miau-green w-full text-text-black
          placeholder:text-text-gray focus:placeholder:text-miau-green ${error ? "border-red-500" : "border-input-bd"} ${className}`} />
    );

    return (
      <div className="flex flex-col gap-1 w-full">
        {/* label do input */}
        <label htmlFor={inputId} className="text-sm font-medium text-text-gray">
          {label}
        </label>
        <div className="group flex flex-col relative">
          {/* chamada do elemento de input */}
          {inputElement}

          {/* mensagens de erro */}
          {error && <span className="text-xs text-red-500">{error}</span>}

          {/* se o tipo do input for password, exibe o olho para visualização da senha */}
          {isPassword && (
            <button type="button" onClick={() => setShowPassword((prev) => !prev)}
              className="absolute group-focus-within:text-miau-green right-2 top-[22px] -translate-y-1/2 text-text-gray hover:text-miau-green cursor-pointer">
              {/* altera o ícone com o clique */}
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
      </div>
    );
  }
);

// definição de nome e exportação do componente
InputField.displayName = "InputField";
export default InputField;
