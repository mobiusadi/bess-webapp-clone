import React from 'react';
import { Link } from 'react-router-dom';

function AdminPage({ incidents }) {
  return (
    <div className="admin-page">
      <h2>Admin Panel: Edit Incidents</h2>
      <p>Select an incident to edit its details.</p>
      <div className="admin-list">
        {incidents.map(incident => (
          <div key={incident.id} className="admin-list-item">
            <span>{incident.location || 'Unnamed Location'}</span>
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