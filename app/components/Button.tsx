import React from 'react'

const Button = ({children, className}:any) => {
  return (
    <button className={className}>{children}</button>
  )
}

export default Button