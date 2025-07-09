import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const initialState = EDITABLE_FIELDS.reduce((acc, field) => {
  acc[field] = '';
  return acc;
}, {});

function AddIncidentForm({ onSave }) {
  const navigate = useNavigate();
  const [newIncident, setNewIncident] = useState(initialState);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? (parseFloat(value) || null) : value;
    setNewIncident(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Creating new incident...');

    const { error } = await supabase.from('incidents').insert([newIncident]);

    if (error) {
      setMessage(`Error creating incident: ${error.message}`);
    } else {
      setMessage('Incident created successfully!');
      if (onSave) onSave();
      setTimeout(() => navigate('/admin'), 1500);
    }
  };

  return (
    <div className="admin-page">
      <h2>Create New Incident</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        {EDITABLE_FIELDS.map(field => {
            // Logic to determine input type can be simplified or enhanced here
            const isNumeric = ['capacity_mw', 'capacity_mwh', 'system_age_yr', 'fatalities', 'injuries'].includes(field);
            const inputType = isNumeric ? 'number' : field.includes('url') ? 'url' : 'text';
            
            return (
                <React.Fragment key={field}>
                    <label>{field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</label>
                    <input 
                        type={inputType}
                        name={field} 
                        value={newIncident[field] || ''} 
                        onChange={handleChange} 
                        step={isNumeric ? 'any' : undefined}
                    />
                </React.Fragment>
            );
        })}
        
        <div className="form-actions">
          <button type="submit" className="save-button">Create Incident</button>
          <button type="button" onClick={() => navigate('/admin')}>Cancel</button>
        </div>
      </form>
      {message && <p className="form-message">{message}</p>}
    </div>
  );
}

export default AddIncidentForm;