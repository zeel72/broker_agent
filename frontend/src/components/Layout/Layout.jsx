import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import { Plus, LogOut, Home } from 'lucide-react';
import './Layout.css';

const Layout = ({ children, onAddNew, onDownloadPDF, filters, onFilterChange, stats, uniqueAreas = [] }) => {
  const { logOut } = useAuth();

  return (
    <div className="layout">
      {/* ── Header ── */}
      <header className="header">
        <div className="header-inner">
          {/* Brand */}
          <div className="header-brand">
            <div className="header-logo">
              <Home size={20} />
            </div>
            <span className="header-title">BrokerDesk</span>
          </div>

          {/* Desktop stats */}
          <div className="header-stats">
            {stats && (
              <>
                <div className="stat-chip">
                  <span className="stat-chip-dot dot-available" />
                  <span>{stats.available} Available</span>
                </div>
                <div className="stat-chip">
                  <span className="stat-chip-dot dot-total" />
                  <span>{stats.total} Total</span>
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="header-actions">
            {onDownloadPDF && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onDownloadPDF}
              >
                Download PDF
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={16} />}
              onClick={onAddNew}
            >
              Add Property
            </Button>
            <button className="logout-btn" onClick={logOut} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Filter Bar ── */}
      <div className="filter-bar">
        <div className="filter-bar-inner">
          {/* Area dropdown — auto-populated from DB */}
          <div className="filter-area-search">
            <select
              className="filter-area-select"
              value={filters.area}
              onChange={(e) => onFilterChange('area', e.target.value)}
            >
              <option value="">📍 All Areas</option>
              {uniqueAreas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          {/* Type filter */}
          <select
            className="filter-select"
            value={filters.type}
            onChange={(e) => onFilterChange('type', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="plot">Plot</option>
            <option value="flat_sale">Flat (Sale)</option>
            <option value="house_rent">House / Flat (Rent)</option>
          </select>

          {/* Status filter */}
          <select
            className="filter-select"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
            <option value="Rented">Rented</option>
            <option value="Hold">Hold</option>
          </select>

          {/* Clear */}
          {(filters.area || filters.type || filters.status) && (
            <button
              className="filter-clear"
              onClick={() => {
                onFilterChange('area', '');
                onFilterChange('type', '');
                onFilterChange('status', '');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="main-content">
        <div className="container">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
