"use client";

import { forwardRef } from "react";

interface TextAreaProps extends React.ComponentProps<"textarea"> {
  label: string;
  error?: string;
}

const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, id, className, rows, children, ...props }, ref) => {
    const textAreaId = id ?? props.name;

    return (
      <div className="flex flex-col gap-1 w-full">
        <label
          htmlFor={textAreaId}
          className="text-sm font-medium text-text-gray">
          {label}
        </label>
        <div className="flex flex-col">
          <textarea
            id={textAreaId}
            ref={ref}
            rows={rows}
            {...props}
            className={`border p-2 rounded-md focus:outline-none focus:ring-0 focus:border-miau-green w-full text-text-black
          placeholder:text-text-gray focus:placeholder:text-miau-green ${error ? "border-red-500" : "border-input-bd"} ${className}`} >
            {children}
          </textarea>
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
      </div>
    );
  }
);

TextAreaField.displayName = "TextAreaField";
export default TextAreaField;