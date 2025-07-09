import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// THIS IS THE FIX: Import the single client from our central file
import { supabase } from '../supabaseClient';

const EDITABLE_FIELDS = [
  'location', 'country', 'event_date', 'description', 
  'capacity_mw', 'capacity_mwh', 'system_age_yr', 
  'battery_modules', 'integrator', 'application', 'installation', 
  'enclosure_type', 'cause', 'extent_of_damage', 
  'state_during_accident', 'root_cause', 'failed_element',
  'source_url_1', 'source_url_2', 'source_url_3',
  'image_url_1', 'image_url_2', 'image_url_3',
  'fatalities', 'injuries', 'other_notes'
];

const NUMERIC_FIELDS = new Set(['capacity_mw', 'capacity_mwh', 'system_age_yr', 'fatalities', 'injuries']);

function EditIncidentForm({ onSave }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncident = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('incidents').select('*').eq('id', id).single();
      if (error) {
        setMessage(`Error fetching incident: ${error.message}`);
      } else {
        setIncident(data);
      }
      setLoading(false);
    };
    fetchIncident();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = NUMERIC_FIELDS.has(name) ? (parseFloat(value) || null) : value;
    setIncident(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Saving...');

    const updateData = {};
    for (const field of EDITABLE_FIELDS) {
      updateData[field] = incident[field];
    }
    
    const { error } = await supabase.from('incidents').update(updateData).eq('id', id);

    if (error) {
      setMessage(`Error updating incident: ${error.message}`);
    } else {
      setMessage('Incident saved successfully!');
      if (onSave) onSave();
      setTimeout(() => navigate('/admin'), 1500);
    }
  };

  if (loading) return <p>Loading incident...</p>;
  if (!incident) return <p>Incident not found.</p>;

  return (
    <div className="admin-page">
      <h2>Editing: {incident.location}</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        
        {EDITABLE_FIELDS.map(field => {
            const value = incident[field] || '';
            const inputType = NUMERIC_FIELDS.has(field) ? 'number' : field.includes('url') ? 'url' : 'text';
            
            let displayValue = value;
            if (field === 'event_date' && value) {
                // Check if it's already in the correct format for the input
                const d = new Date(value);
                if (!isNaN(d.getTime())) {
                    // Format to 'YYYY-MM-DDTHH:mm'
                    displayValue = d.toISOString().slice(0, 16);
                }
            }

            return (
                <React.Fragment key={field}>
                    <label>{field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</label>
                    <input 
                        type={inputType}
                        name={field} 
                        value={displayValue} 
                        onChange={handleChange} 
                        step={inputType === 'number' ? 'any' : undefined}
                    />
                </React.Fragment>
            );
        })}
        
        <div className="form-actions">
          <button type="submit" className="save-button">Save Changes</button>
          <button type="button" onClick={() => navigate('/admin')}>Cancel</button>
        </div>
      </form>
      {message && <p className="form-message">{message}</p>}
    </div>
  );
}

export default EditIncidentForm;