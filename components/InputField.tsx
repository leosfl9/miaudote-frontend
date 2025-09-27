"use client";

import InputMask from "react-input-mask";
import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps extends React.ComponentProps<"input"> {
  label: string;
  mask?: string;
  error?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, mask, error, id, className, type = "text", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id ?? props.name;

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    const inputElement = mask ? (
      <InputMask mask={mask} {...props}>
        {(inputProps: any) => (
          <input
            id={inputId}
            ref={ref}
            type={inputType}
            {...inputProps}
            className={`border p-2 rounded-md focus:outline-none focus:ring-0 focus:border-miau-green w-full text-text-black pr-10
              ${error ? "border-red-500" : "border-input-bd"} ${className}`}
          />
        )}
      </InputMask>
    ) : (
      <input
        id={inputId}
        ref={ref}
        type={inputType}
        {...props}
        className={`border p-2 rounded-md focus:outline-none focus:ring-0 focus:border-miau-green w-full text-text-black pr-10
          ${error ? "border-red-500" : "border-input-bd"} ${className}`}
      />
    );

    return (
      <div className="flex flex-col gap-1 w-full">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-text-gray">
          {label}
        </label>
        <div className="relative">
          {inputElement}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-[22px] -translate-y-1/2 text-text-gray hover:text-miau-green cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;

