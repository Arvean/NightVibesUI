import React from 'react';

export const Dialog = ({ children, open, onOpenChange }) => (
  open ? (
    <div data-testid="dialog" onClick={() => onOpenChange(false)}>
      {children}
    </div>
  ) : null
);

export const DialogContent = ({ children, className }) => (
  <div data-testid="dialog-content" className={className}>
    {children}
  </div>
);

export const DialogHeader = ({ children }) => (
  <div data-testid="dialog-header">
    {children}
  </div>
);

export const DialogTitle = ({ children }) => (
  <div data-testid="dialog-title">
    {children}
  </div>
);

export const DialogDescription = ({ children }) => (
  <div data-testid="dialog-description">
    {children}
  </div>
);

export const DialogTrigger = ({ children, asChild }) => (
  <div data-testid="dialog-trigger">
    {children}
  </div>
);

export const Button = ({ children, onClick, disabled, variant }) => (
  <button 
    data-testid="button"
    onClick={onClick}
    disabled={disabled}
    className={variant}
  >
    {children}
  </button>
);

export const Textarea = ({ placeholder, value, onChange, className }) => (
  <textarea
    data-testid="textarea"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={className}
  />
);

export const Alert = ({ children, variant }) => (
  <div data-testid="alert" className={variant}>
    {children}
  </div>
);

export const AlertDescription = ({ children }) => (
  <div data-testid="alert-description">
    {children}
  </div>
);
