"use client";

import { forwardRef } from "react";

interface SelectFieldProps extends React.ComponentProps<"select"> {
  label: string;
  error?: string;
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, id, className, children, ...props }, ref) => {
    const selectId = id ?? props.name;

    return (
      <div className="flex flex-col gap-1 w-full">
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-text-gray">
          {label}
        </label>
        <div className="flex flex-col">
          <select
            id={selectId}
            ref={ref}
            {...props}
            className={`border p-2 rounded-md focus:outline-none focus:ring-0 focus:border-miau-green w-full text-text-black
            ${error ? "border-red-500" : "border-input-bd"} ${className}`} >
            {children}
          </select>
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
      </div>
    );
  }
);

SelectField.displayName = "SelectField";
export default SelectField;
