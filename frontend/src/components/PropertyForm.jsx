import React, { useState } from 'react';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import { createProperty, updateProperty, uploadPhotos } from '../services/api';
import toast from 'react-hot-toast';
import './PropertyForm.css';

const PROPERTY_TYPES = [
  // New granular types
  { value: 'residential_plot', label: '🌍 Residential Plot' },
  { value: 'commercial_plot',  label: '🌍 Commercial Plot' },
  { value: 'industrial_plot',  label: '🏭 Industrial Plot' },
  { value: 'agricultural_land',label: '🌾 Agricultural Land' },
  { value: 'residential_flat', label: '🏢 Residential Flat' },
  { value: 'commercial_office',label: '🏢 Commercial Office' },
  { value: 'shop',             label: '🏪 Shop / Showroom' },
  { value: 'villa',            label: '🏠 Villa / Bungalow' },
  { value: 'house',            label: '🏠 Independent House' },
  // Legacy / General types
  { value: 'plot',       label: '🌍 Plot (Generic)' },
  { value: 'flat_sale',  label: '🏢 Flat / House (Sale)' },
  { value: 'house_rent', label: '🏠 Flat / House (Rent)' },
];

const STATUS_OPTIONS = [
  { value: 'Available', label: 'Available' },
  { value: 'Sold',      label: 'Sold' },
  { value: 'Rented',    label: 'Rented' },
  { value: 'Hold',      label: 'Hold' },
];

const FACING_OPTIONS = [
  { value: 'East',  label: 'East' },
  { value: 'West',  label: 'West' },
  { value: 'North', label: 'North' },
  { value: 'South', label: 'South' },
];

const BHK_OPTIONS = [
  { value: '1BHK', label: '1 BHK' },
  { value: '2BHK', label: '2 BHK' },
  { value: '3BHK', label: '3 BHK' },
  { value: '4BHK', label: '4 BHK' },
  { value: '5BHK+', label: '5 BHK+' },
];

const FURNISH_OPTIONS = [
  { value: 'Furnished',       label: 'Furnished' },
  { value: 'Semi-Furnished',  label: 'Semi-Furnished' },
  { value: 'Unfurnished',     label: 'Unfurnished' },
];

const defaultForm = {
  type: 'flat_sale',
  title: '',
  area: '',
  price: '',
  status: 'Available',
  owner_name: '',
  owner_contact: '',
  brokers: [],
  notes: '',
  // Plot-specific
  size: '',
  facing: '',
  boundary_wall: '',
  // Flat/House-specific
  bhk: '',
  furnishing: '',
  floor: '',
  photos: [],
};

const getPhotoUrl = (path) => {
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');
  return `${baseUrl}${path}`;
};

const PropertyForm = ({ onSuccess, existingData }) => {
  const isEdit = !!existingData;

  const [form, setForm] = useState(
    isEdit
      ? {
          ...defaultForm,
          ...existingData,
          ...existingData.specific_details,
        }
      : defaultForm
  );
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleBrokerChange = (index, field, value) => {
    setForm((prev) => {
      const newBrokers = [...(prev.brokers || [])];
      newBrokers[index] = { ...newBrokers[index], [field]: value };
      return { ...prev, brokers: newBrokers };
    });
  };

  const addBroker = () => {
    setForm((prev) => ({
      ...prev,
      brokers: [...(prev.brokers || []), { name: '', contact: '' }],
    }));
  };

  const removeBrokerList = (index) => {
    setForm((prev) => {
      const newBrokers = [...(prev.brokers || [])];
      newBrokers.splice(index, 1);
      return { ...prev, brokers: newBrokers };
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
    // reset the input value so the same file can be picked again if needed
    e.target.value = '';
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const removePhoto = (index) => {
    setForm(prev => {
      const newPhotos = [...(prev.photos || [])];
      newPhotos.splice(index, 1);
      return { ...prev, photos: newPhotos };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Build specific_details
    let specific_details = {};
    const isPlotType = ['plot', 'residential_plot', 'commercial_plot', 'industrial_plot', 'agricultural_land'].includes(form.type);
    
    if (isPlotType) {
      specific_details = {
        size: form.size,
        facing: form.facing,
        boundary_wall: form.boundary_wall,
      };
    } else {
      specific_details = {
        bhk: form.bhk,
        furnishing: form.furnishing,
        floor: form.floor,
      };
    }

    let uploadedPhotos = form.photos || [];
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });
      try {
        const { data: paths } = await uploadPhotos(formData);
        uploadedPhotos = [...uploadedPhotos, ...paths];
      } catch (err) {
        toast.error('Failed to upload photos');
        setLoading(false);
        return;
      }
    }

    const payload = {
      type: form.type,
      title: form.title,
      area: form.area,
      price: Number(form.price),
      status: form.status,
      owner_name: form.owner_name,
      owner_contact: form.owner_contact,
      brokers: form.brokers || [],
      notes: form.notes,
      specific_details,
      photos: uploadedPhotos,
    };

    try {
      if (isEdit) {
        await updateProperty(existingData._id, payload);
        toast.success('Property updated!');
      } else {
        await createProperty(payload);
        toast.success('Property added!');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const isPlot = ['plot', 'residential_plot', 'commercial_plot', 'industrial_plot', 'agricultural_land'].includes(form.type);

  return (
    <form onSubmit={handleSubmit} className="property-form">
      {/* Row 1 */}
      <div className="form-row form-row-2">
        <Select
          id="type"
          label="Property Type"
          required
          options={PROPERTY_TYPES}
          value={form.type}
          onChange={set('type')}
        />
        <Select
          id="status"
          label="Status"
          required
          options={STATUS_OPTIONS}
          value={form.status}
          onChange={set('status')}
        />
      </div>

      {/* Title + Area */}
      <div className="form-row form-row-2">
        <Input
          id="title"
          label="Property Title"
          placeholder="e.g. 3BHK Sunrise Apartments"
          value={form.title}
          onChange={set('title')}
          required
        />
        <Input
          id="area"
          label="Area / Location"
          placeholder="e.g. Vastrapur, Bodakdev"
          value={form.area}
          onChange={set('area')}
          required
        />
      </div>

      {/* Price */}
      <div className="form-row form-row-1">
        <Input
          id="price"
          label={isPlot ? 'Price (₹)' : form.type === 'house_rent' ? 'Monthly Rent (₹)' : 'Sale Price (₹)'}
          type="number"
          placeholder="Enter amount"
          value={form.price}
          onChange={set('price')}
          required
        />
      </div>

      {/* ── Dynamic Specific Fields ── */}
      <div className="form-divider">
        <span>
          {isPlot ? '📐 Plot Details' : '🏢 Property Details'}
        </span>
      </div>

      {isPlot ? (
        <div className="form-row form-row-3">
          <Input
            id="size"
            label="Size (sq. yd / sq. ft)"
            placeholder="e.g. 200 sq. yd"
            value={form.size}
            onChange={set('size')}
          />
          <Select
            id="facing"
            label="Facing"
            options={FACING_OPTIONS}
            value={form.facing}
            onChange={set('facing')}
          />
          <Select
            id="boundary_wall"
            label="Boundary Wall"
            options={[{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }]}
            value={form.boundary_wall}
            onChange={set('boundary_wall')}
          />
        </div>
      ) : (
        <div className="form-row form-row-3">
          <Select
            id="bhk"
            label="Configuration"
            options={BHK_OPTIONS}
            value={form.bhk}
            onChange={set('bhk')}
          />
          <Select
            id="furnishing"
            label="Furnishing"
            options={FURNISH_OPTIONS}
            value={form.furnishing}
            onChange={set('furnishing')}
          />
          <Input
            id="floor"
            label="Floor No."
            type="number"
            placeholder="e.g. 3"
            value={form.floor}
            onChange={set('floor')}
          />
        </div>
      )}

      {/* Owner Details */}
      <div className="form-divider"><span>👤 Owner Details</span></div>
      <div className="form-row form-row-2">
        <Input
          id="owner_name"
          label="Owner Name"
          placeholder="Full name"
          value={form.owner_name}
          onChange={set('owner_name')}
          required
        />
        <Input
          id="owner_contact"
          label="Owner Contact"
          placeholder="+91 98765 43210"
          value={form.owner_contact}
          onChange={set('owner_contact')}
          required
        />
      </div>

      {/* Brokers Details */}
      <div className="form-divider" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>🤝 Brokers</span>
        <Button type="button" size="sm" onClick={addBroker} style={{ padding: '4px 10px', fontSize: '12px' }}>
          + Add Broker
        </Button>
      </div>
      
      {(form.brokers || []).length === 0 && (
        <div style={{ fontSize: '13px', color: '#666', textAlign: 'center', marginBottom: '15px' }}>
          No brokers added. Click '+ Add Broker' to add one.
        </div>
      )}

      {(form.brokers || []).map((broker, index) => (
        <div key={`broker-${index}`} style={{ border: '1px solid var(--border)', padding: '10px', borderRadius: '8px', marginBottom: '10px', position: 'relative' }}>
          <button 
            type="button" 
            onClick={() => removeBrokerList(index)}
            style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--danger)', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', fontSize: '12px' }}
          >
            Remove
          </button>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '8px' }}>Broker {index + 1}</div>
          <div className="form-row form-row-2">
            <Input
              id={`broker-name-${index}`}
              label="Broker Name"
              placeholder="Full name"
              value={broker.name}
              onChange={(e) => handleBrokerChange(index, 'name', e.target.value)}
              required
            />
            <Input
              id={`broker-contact-${index}`}
              label="Broker Contact"
              placeholder="+91 98765 43210"
              value={broker.contact}
              onChange={(e) => handleBrokerChange(index, 'contact', e.target.value)}
              required
            />
          </div>
        </div>
      ))}

      {/* Photos */}
      <div className="form-divider"><span>📷 Photos</span></div>
      <div className="form-group">
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px',
                background: 'var(--surface)',
                border: '1px dashed var(--border)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
            >
              🖼️ Upload from Gallery
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          <div style={{ flex: 1 }}>
            <label 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px',
                background: 'rgba(59, 130, 246, 0.05)',
                border: '1px dashed rgba(59, 130, 246, 0.5)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--primary)',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
            >
              📷 Take Photo
              <input 
                type="file" 
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        {((form.photos && form.photos.length > 0) || selectedFiles.length > 0) && (
          <div className="photo-preview-grid">
            {/* Existing uploaded photos */}
            {form.photos && form.photos.map((photo, i) => (
              <div key={`existing-${i}`} className="photo-preview-item">
                <img src={getPhotoUrl(photo)} alt="Property" />
                <button type="button" onClick={() => removePhoto(i)} className="remove-photo-btn">×</button>
              </div>
            ))}
            
            {/* Newly selected photos (not yet uploaded) */}
            {selectedFiles.map((file, i) => (
              <div key={`new-${i}`} className="photo-preview-item">
                <img src={URL.createObjectURL(file)} alt="New Property" />
                <button type="button" onClick={() => removeSelectedFile(i)} className="remove-photo-btn" style={{ background: '#f59e0b' }}>×</button>
                <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '10px', textAlign: 'center' }}>New</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="form-group">
        <label className="input-label">Notes / Remarks</label>
        <textarea
          className="form-textarea"
          placeholder="Any additional details…"
          value={form.notes}
          onChange={set('notes')}
          rows={3}
        />
      </div>

      {/* Submit */}
      <div className="form-footer">
        <Button type="submit" disabled={loading} size="lg" fullWidth>
          {loading
            ? isEdit ? 'Saving…' : 'Adding…'
            : isEdit ? 'Save Changes' : 'Add Property'}
        </Button>
      </div>
    </form>
  );
};

export default PropertyForm;
