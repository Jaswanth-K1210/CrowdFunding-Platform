import React from "react";

function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2 rounded-lg font-medium transition 
      bg-blue-600 text-white hover:bg-blue-700 
      disabled:bg-gray-400 disabled:cursor-not-allowed 
      ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;