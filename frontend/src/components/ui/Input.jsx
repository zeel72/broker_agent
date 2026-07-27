import React from 'react';
import './Input.css';

const Input = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  icon,
  error,
}) => {
  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={id} className="input-label">
          {label} {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-field-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`input-field ${icon ? 'with-icon' : ''} ${error ? 'input-error' : ''}`}
        />
      </div>
      {error && <p className="input-error-msg">{error}</p>}
    </div>
  );
};

export default Input;
