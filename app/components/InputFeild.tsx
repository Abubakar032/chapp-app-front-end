import React from "react";

const InputFeild = ({
  type,
  className,
  placeholder,
  onchange
}: any) => {
  return (
    <input
      type={type}
      className={className}
      placeholder={placeholder}
      onChange={onchange}
    />
  );
};

export default InputFeild;
