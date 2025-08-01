import React from "react";

const Button = ({ children, className, onClick, disabled }: any) => {
  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
