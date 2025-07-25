import React from 'react'

const InputFeild = ({type, className, placeholder}:any) => {
  return (
    <input type={type} className={className} placeholder={placeholder} />
  )
}

export default InputFeild