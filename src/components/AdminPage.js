import React from 'react';
import { Link } from 'react-router-dom';

function AdminPage({ incidents }) {
  return (
    <div className="admin-page">
      <h2>Admin Panel: Edit Incidents</h2>
      
      <div className="admin-actions">
        {/* NEW: Button to link to the 'Add Incident' page */}
        <Link to="/admin/new" className="create-button">
          + Create New Incident
        </Link>
      </div>

      <div className="admin-list">
        {incidents.map(incident => (
          <div key={incident.id} className="admin-list-item">
            <span>{incident.id}: {incident.location || 'Unnamed Location'}</span>
            <Link to={`/admin/edit/${incident.id}`} className="edit-button">
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;