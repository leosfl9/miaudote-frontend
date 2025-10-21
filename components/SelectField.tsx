"use client";

import { forwardRef } from "react";

// tipagem das props do select
interface SelectFieldProps extends React.ComponentProps<"select"> {
  label: string;
  error?: string;
}

// componente de select
const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, id, className, children, ...props }, ref) => {
    const selectId = id ?? props.name;

    return (
      <div className="flex flex-col gap-1 w-full">
        {/* label do select */}
        <label htmlFor={selectId} className="text-sm font-medium text-text-gray">
          {label}
        </label>

        <div className="flex flex-col">
          {/* select */}
          <select id={selectId} ref={ref} {...props}
            className={`border p-2 rounded-md focus:outline-none focus:ring-0 focus:border-miau-green w-full text-text-black
            ${error ? "border-red-500" : "border-input-bd"} ${className}`} >
            {children}
          </select>

          {/* mensagens de erro */}
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
      </div>
    );
  }
);

// definição de nome e exportação do componente
SelectField.displayName = "SelectField";
export default SelectField;
