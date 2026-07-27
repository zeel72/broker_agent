import React from 'react';
import { Pencil, Trash2, Phone, MapPin, DollarSign } from 'lucide-react';
import Button from './ui/Button';
import './PropertyList.css';

const TYPE_LABELS = {
  plot:       { label: 'Plot',       cls: 'badge-plot' },
  flat_sale:  { label: 'Flat (Sale)',cls: 'badge-flat_sale' },
  house_rent: { label: 'Rent',       cls: 'badge-house_rent' },
};

const STATUS_CLS = {
  Available: 'badge-available',
  Sold:      'badge-sold',
  Rented:    'badge-rented',
  Hold:      'badge-hold',
};

const PropertyList = ({ properties, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="list-empty">
        <div className="list-spinner" />
        <p>Loading properties…</p>
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="list-empty">
        <div className="list-empty-icon">🏘️</div>
        <h3>No properties found</h3>
        <p>Try adjusting your filters or add a new property.</p>
      </div>
    );
  }

  return (
    <div className="property-list">
      {/* Desktop Table */}
      <div className="table-wrapper">
        <table className="prop-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Type</th>
              <th>Area</th>
              <th>Price / Rent</th>
              <th>Details</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => {
              const typeInfo = TYPE_LABELS[p.type] || { label: p.type, cls: '' };
              const d = p.specific_details || {};

              return (
                <tr key={p._id} className="prop-row">
                  <td>
                    <div className="prop-title">{p.title}</div>
                    {p.notes && <div className="prop-notes">{p.notes}</div>}
                  </td>
                  <td>
                    <span className={`badge ${typeInfo.cls}`}>{typeInfo.label}</span>
                  </td>
                  <td>
                    <div className="prop-area">
                      <MapPin size={13} />
                      {p.area}
                    </div>
                  </td>
                  <td>
                    <div className="prop-price">
                      ₹{Number(p.price).toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td className="prop-details-cell">
                    {p.type === 'plot' ? (
                      <>
                        {d.size && <span className="detail-chip">{d.size}</span>}
                        {d.facing && <span className="detail-chip">{d.facing}</span>}
                        {d.boundary_wall && <span className="detail-chip">BW: {d.boundary_wall}</span>}
                      </>
                    ) : (
                      <>
                        {d.bhk && <span className="detail-chip">{d.bhk}</span>}
                        {d.furnishing && <span className="detail-chip">{d.furnishing}</span>}
                        {d.floor && <span className="detail-chip">Floor {d.floor}</span>}
                      </>
                    )}
                  </td>
                  <td>
                    <div className="prop-owner-name">{p.owner_name}</div>
                    <a href={`tel:${p.owner_contact}`} className="prop-owner-contact">
                      <Phone size={12} /> {p.owner_contact}
                    </a>
                  </td>
                  <td>
                    <span className={`badge ${STATUS_CLS[p.status] || ''}`}>{p.status}</span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => onEdit(p)}
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => onDelete(p._id)}
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="mobile-cards">
        {properties.map((p) => {
          const typeInfo = TYPE_LABELS[p.type] || { label: p.type, cls: '' };
          const d = p.specific_details || {};
          const borderColors = {
            plot: 'var(--type-plot)',
            flat_sale: 'var(--type-flat-sale)',
            house_rent: 'var(--type-house-rent)',
          };
          return (
            <div
              key={p._id}
              className="mobile-card"
              style={{ borderLeftColor: borderColors[p.type] || 'var(--border)' }}
            >
              <div className="mobile-card-header">
                <div className="mobile-card-meta">
                  <div className="prop-title">{p.title}</div>
                  <div className="prop-area">
                    <MapPin size={12} /> {p.area}
                  </div>
                </div>
                <div className="mobile-card-badges">
                  <span className={`badge ${typeInfo.cls}`}>{typeInfo.label}</span>
                  <span className={`badge ${STATUS_CLS[p.status] || ''}`}>{p.status}</span>
                </div>
              </div>
              <div className="mobile-card-body">
                <div className="prop-price">₹{Number(p.price).toLocaleString('en-IN')}</div>
                <a href={`tel:${p.owner_contact}`} className="prop-owner-contact">
                  <Phone size={13} /> {p.owner_contact}
                </a>
              </div>
              {p.notes && (
                <div className="mobile-card-notes">📝 {p.notes}</div>
              )}
              <div className="mobile-card-footer">
                <button className="action-btn edit-btn" onClick={() => onEdit(p)} title="Edit">
                  <Pencil size={16} />
                </button>
                <button className="action-btn delete-btn" onClick={() => onDelete(p._id)} title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyList;
