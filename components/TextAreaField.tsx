"use client";

import { forwardRef } from "react";

// tipagem das props da textarea
interface TextAreaProps extends React.ComponentProps<"textarea"> {
  label: string;
  error?: string;
}

// componente de textarea
const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, id, className, rows, children, ...props }, ref) => {
    const textAreaId = id ?? props.name;

    return (
      <div className="flex flex-col gap-1 w-full">
        {/* label da textarea */}
        <label htmlFor={textAreaId} className="text-sm font-medium text-text-gray">
          {label}
        </label>
        
        <div className="flex flex-col">
          {/* textarea */}
          <textarea id={textAreaId} maxLength={255} ref={ref} rows={rows} {...props}
            className={`border p-2 rounded-md focus:outline-none focus:ring-0 focus:border-miau-green w-full text-text-black
          placeholder:text-text-gray focus:placeholder:text-miau-green ${error ? "border-red-500" : "border-input-bd"} ${className}`} >
            {children}
          </textarea>

          {/* mensagens de erro */}
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
      </div>
    );
  }
);

// definição de nome e exportação do componente
TextAreaField.displayName = "TextAreaField";
export default TextAreaField;