import React from 'react';
import './Select.css';

const Select = ({ label, id, value, onChange, options = [], required = false }) => {
  return (
    <div className="select-wrapper">
      {label && (
        <label htmlFor={id} className="select-label">
          {label} {required && <span className="select-required">*</span>}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className="select-field"
      >
        <option value="" disabled>Select…</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
