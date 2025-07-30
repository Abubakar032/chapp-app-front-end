import React from "react";

interface InputFeildProps {
  type?: string;
  className?: string;
  placeholder?: string;
  onchange?: React.ChangeEventHandler<HTMLInputElement>;
  value?: string | number;
  disabled?: boolean;
}

const InputFeild: React.FC<InputFeildProps> = ({
  type,
  className,
  placeholder,
  onchange,
  value,
  disabled

}) => {
  return (
    <input
      type={type}
      className={className}
      placeholder={placeholder}
      onChange={onchange}
      value={value}
      disabled={disabled}
    />
  );
};

export default InputFeild;
