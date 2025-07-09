import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// A list of all fields we want to make editable in the form
const EDITABLE_FIELDS = [
  'location', 'country', 'event_date', 'description', 
  'capacity_mw', 'capacity_mwh', 'system_age_yr', 
  'battery_modules', 'integrator', 'application', 'installation', 
  'enclosure_type', 'cause', 'extent_of_damage', 
  'state_during_accident', 'root_cause', 'failed_element',
  'source_url_1', 'source_url_2', 'source_url_3',
  'image_url_1', 'image_url_2', 'image_url_3',
  'fatalities', 'injuries', 'other_notes'
  // Add any other columns from your Supabase table here
];

function EditIncidentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch the specific incident's data when the component loads
  useEffect(() => {
    const fetchIncident = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setMessage(`Error fetching incident: ${error.message}`);
      } else {
        setIncident(data);
      }
      setLoading(false);
    };
    fetchIncident();
  }, [id]);

  // Handle changes to any form input
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // Handle number inputs correctly
    const newValue = type === 'number' ? parseFloat(value) || 0 : value;
    setIncident(prev => ({ ...prev, [name]: newValue }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Saving...');

    // Dynamically create an object with only the editable fields to update
    const updateData = {};
    for (const field of EDITABLE_FIELDS) {
      updateData[field] = incident[field];
    }
    
    const { error } = await supabase
      .from('incidents')
      .update(updateData)
      .eq('id', id);

    if (error) {
      setMessage(`Error updating incident: ${error.message}`);
    } else {
      setMessage('Incident saved successfully!');
      setTimeout(() => navigate('/admin'), 1500);
    }
  };

  if (loading) return <p>Loading incident...</p>;
  if (!incident) return <p>Incident not found.</p>;

  return (
    <div className="admin-page">
      <h2>Editing: {incident.location}</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        
        {/* Dynamically create an input for each editable field */}
        {EDITABLE_FIELDS.map(field => {
            const value = incident[field] || '';
            let inputType = 'text';
            if (typeof value === 'number' || field.includes('_mw') || field.includes('_mwh') || field.includes('age') || field.includes('fatalities') || field.includes('injuries')) {
                inputType = 'number';
            } else if (field.includes('url')) {
                inputType = 'url';
            } else if (field === 'event_date') {
                inputType = 'datetime-local';
            }
            
            return (
                <React.Fragment key={field}>
                    <label>{field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</label>
                    <input 
                        type={inputType}
                        name={field} 
                        value={value} 
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