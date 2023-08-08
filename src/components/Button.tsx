import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

function Button({ children, ...attributes }: Props) {
  return (
    <button className="bg-cyan-600 text-slate-50 py-2 rounded-full text-sm px-3" {...attributes}>
      {children}
    </button>
  );
}

export default Button;
