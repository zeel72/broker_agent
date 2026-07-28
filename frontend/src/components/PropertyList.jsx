import React from 'react';
import { Pencil, Trash2, Phone, MapPin, DollarSign } from 'lucide-react';
import Button from './ui/Button';
import './PropertyList.css';

const TYPE_LABELS = {
  // New Types
  residential_plot:   { label: 'Res. Plot',          cls: 'badge-plot' },
  commercial_plot:    { label: 'Comm. Plot',         cls: 'badge-plot' },
  industrial_plot:    { label: 'Ind. Plot',          cls: 'badge-plot' },
  agricultural_land:  { label: 'Agri. Land',         cls: 'badge-plot' },
  residential_flat:   { label: 'Res. Flat',          cls: 'badge-flat_sale' },
  commercial_office:  { label: 'Comm. Office',       cls: 'badge-flat_sale' },
  shop:               { label: 'Shop',               cls: 'badge-flat_sale' },
  villa:              { label: 'Villa/Bungalow',     cls: 'badge-house_rent' },
  house:              { label: 'House',              cls: 'badge-house_rent' },
  // Legacy
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
              <th>Brokers</th>
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
                    <div className="prop-title">
                      {p.title}
                      {p.photos && p.photos.length > 0 && (
                        <span style={{ fontSize: '12px', marginLeft: '6px', color: '#666' }} title={`${p.photos.length} photos`}>
                          📷 {p.photos.length}
                        </span>
                      )}
                    </div>
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
                    {['plot', 'residential_plot', 'commercial_plot', 'industrial_plot', 'agricultural_land'].includes(p.type) ? (
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
                    {p.brokers && p.brokers.length > 0 ? (
                      <div className="prop-brokers-list">
                        {p.brokers.map((b, i) => (
                          <div key={i} style={{ marginBottom: '4px' }}>
                            <div style={{ fontSize: '12px', fontWeight: '500' }}>{b.name}</div>
                            <a href={`tel:${b.contact}`} style={{ fontSize: '11px', color: '#666', textDecoration: 'none' }}>
                              <Phone size={10} /> {b.contact}
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#aaa' }}>-</span>
                    )}
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
            residential_plot: 'var(--type-plot)',
            commercial_plot: 'var(--type-plot)',
            industrial_plot: 'var(--type-plot)',
            agricultural_land: 'var(--type-plot)',
            flat_sale: 'var(--type-flat-sale)',
            residential_flat: 'var(--type-flat-sale)',
            commercial_office: 'var(--type-flat-sale)',
            shop: 'var(--type-flat-sale)',
            house_rent: 'var(--type-house-rent)',
            villa: 'var(--type-house-rent)',
            house: 'var(--type-house-rent)',
          };
          return (
            <div
              key={p._id}
              className="mobile-card"
              style={{ borderLeftColor: borderColors[p.type] || 'var(--border)' }}
            >
              <div className="mobile-card-header">
                <div className="mobile-card-meta">
                  <div className="prop-title">
                    {p.title}
                    {p.photos && p.photos.length > 0 && (
                      <span style={{ fontSize: '12px', marginLeft: '6px', color: '#666' }}>
                        📷 {p.photos.length}
                      </span>
                    )}
                  </div>
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
              {p.brokers && p.brokers.length > 0 && (
                <div style={{ padding: '0 12px 10px', fontSize: '12px' }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px', color: '#555' }}>Brokers:</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {p.brokers.map((b, i) => (
                      <div key={i} style={{ background: 'var(--surface)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                        <div style={{ fontWeight: '500' }}>{b.name}</div>
                        <a href={`tel:${b.contact}`} style={{ color: '#666', textDecoration: 'none' }}>{b.contact}</a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
