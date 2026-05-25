import React from 'react'
import clsx from 'clsx'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

export function Button({ variant = 'primary', className = '', ...props }: Props) {
  const base = 'px-4 py-2 rounded-md font-medium text-sm'
  const styles = variant === 'primary' ? 'bg-softpink text-black' : 'border border-gray-600 text-white bg-transparent'
  return <button className={clsx(base, styles, className)} {...props} />
}

export default Button
