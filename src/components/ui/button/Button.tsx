import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  type?: "button" | "submit" | "reset"; // Button type
  variant?: "primary" | "success" | "outline" | "danger-outline" | "success-outline" | "primary-outline" | "danger"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;  disabled?: boolean; // Disabled state
  className?: string; // Disabled state
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  type = "button",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Variant Classes
  const variantClasses = {
    "success-outline":
      "bg-white text-green-500 ring-1 ring-inset ring-green-300 hover:bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:ring-green-700 dark:hover:bg-white/[0.03] dark:hover:text-green-300",
    primary:
      "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
    success:
      "bg-green-700 text-white shadow-theme-xs hover:bg-green-800 disabled:bg-green-300",
    danger:
      "bg-red-700 text-white shadow-theme-xs hover:bg-red-800 disabled:bg-red-300",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
    "danger-outline":
      "bg-white text-red-500 ring-1 ring-inset ring-red-300 hover:bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:ring-red-700 dark:hover:bg-white/[0.03] dark:hover:text-red-300",
    "primary-outline":
      "bg-white text-brand-500 ring-1 ring-inset ring-brand-300 hover:bg-brand-50 dark:bg-gray-800 dark:text-brand-400 dark:ring-brand-700 dark:hover:bg-white/[0.03] dark:hover:text-brand-300",
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-medium gap-2 rounded-lg transition ${className} ${sizeClasses[size]
        } ${variantClasses[variant]} ${disabled ? "cursor-not-allowed opacity-60" : ""
        }`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
