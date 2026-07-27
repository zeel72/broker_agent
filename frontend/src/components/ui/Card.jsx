import React from 'react';
import './Card.css';

const Card = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`card ${onClick ? 'card-clickable' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, actions }) => (
  <div className="card-header">
    <div>
      {title && <h3 className="card-title">{title}</h3>}
      {subtitle && <p className="card-subtitle">{subtitle}</p>}
    </div>
    {actions && <div className="card-actions">{actions}</div>}
  </div>
);

export const CardBody = ({ children }) => (
  <div className="card-body">{children}</div>
);

export default Card;
