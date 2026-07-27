import React, { useState, useEffect, useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Layout from '../components/Layout/Layout';
import PropertyList from '../components/PropertyList';
import PropertyForm from '../components/PropertyForm';
import Modal from '../components/ui/Modal';
import { getProperties, deleteProperty } from '../services/api';
import toast from 'react-hot-toast';
import './DashboardPage.css';

const DashboardPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({ area: '', type: '', status: '' });

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data } = await getProperties();
      setProperties(data);
    } catch {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Client-side filtering (instant, no extra API calls)
  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const areaMatch = !filters.area || p.area.toLowerCase().includes(filters.area.toLowerCase());
      const typeMatch = !filters.type || p.type === filters.type;
      const statusMatch = !filters.status || p.status === filters.status;
      return areaMatch && typeMatch && statusMatch;
    });
  }, [properties, filters]);

  // Unique areas for dropdown — auto-built from all properties, sorted A-Z
  const uniqueAreas = useMemo(() => {
    const areas = [...new Set(properties.map((p) => p.area).filter(Boolean))];
    return areas.sort((a, b) => a.localeCompare(b));
  }, [properties]);

  // Stats
  const stats = useMemo(() => ({
    total: filtered.length,
    available: filtered.filter((p) => p.status === 'Available').length,
  }), [filtered]);

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleAddNew = () => {
    setEditingProperty(null);
    setModalOpen(true);
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      await deleteProperty(id);
      toast.success('Property deleted');
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error('Failed to delete property');
    }
  };

  const handleFormSuccess = () => {
    setModalOpen(false);
    fetchProperties();
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text('BrokerDesk - Property Report', 14, 15);
      
      const tableColumn = ["Title", "Type", "Area", "Price (Rs)", "Status", "Owner"];
      const tableRows = [];

      filtered.forEach(p => {
        const pType = p.type === 'plot' ? 'Plot' : p.type === 'flat_sale' ? 'Flat (Sale)' : 'Rent';
        const priceStr = p.price ? p.price.toLocaleString('en-IN') : 'N/A';
        const propertyData = [
          p.title || 'N/A',
          pType,
          p.area || 'N/A',
          priceStr,
          p.status || 'N/A',
          `${p.owner_name || ''}\n${p.owner_contact || ''}`,
        ];
        tableRows.push(propertyData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185] },
      });

      doc.save('property_report.pdf');
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <Layout
      onAddNew={handleAddNew}
      onDownloadPDF={handleDownloadPDF}
      filters={filters}
      onFilterChange={handleFilterChange}
      stats={stats}
      uniqueAreas={uniqueAreas}
    >
      {/* Summary Cards */}
      <div className="summary-cards">
        <SummaryCard label="Total Properties" value={properties.length} color="primary" />
        <SummaryCard
          label="Available"
          value={properties.filter((p) => p.status === 'Available').length}
          color="available"
        />
        <SummaryCard
          label="Plots"
          value={properties.filter((p) => p.type === 'plot').length}
          color="plot"
        />
        <SummaryCard
          label="For Rent"
          value={properties.filter((p) => p.type === 'house_rent').length}
          color="rent"
        />
      </div>

      {/* Filter result count */}
      <div className="result-info">
        {filters.area || filters.type || filters.status ? (
          <span>
            Showing <strong>{filtered.length}</strong> of {properties.length} properties
            {filters.area && <> in <em>"{filters.area}"</em></>}
          </span>
        ) : (
          <span>All <strong>{properties.length}</strong> properties</span>
        )}
      </div>

      {/* Property List */}
      <PropertyList
        properties={filtered}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProperty ? 'Edit Property' : 'Add New Property'}
        size="lg"
      >
        <PropertyForm
          onSuccess={handleFormSuccess}
          existingData={editingProperty}
        />
      </Modal>
    </Layout>
  );
};

/* Small stat card component */
const SummaryCard = ({ label, value, color }) => (
  <div className={`summary-card summary-card-${color}`}>
    <div className="summary-card-value">{value}</div>
    <div className="summary-card-label">{label}</div>
  </div>
);

export default DashboardPage;
