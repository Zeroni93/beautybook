import React from 'react'
import clsx from 'clsx'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

export function Button({ variant = 'primary', className = '', ...props }: Props) {
  const base = 'px-4 py-2 rounded-xl font-medium text-sm inline-flex items-center justify-center'
  const styles = variant === 'primary' ? 'btn-primary' : 'btn-secondary'
  return <button className={clsx(base, styles, className)} {...props} />
}

export default Button
