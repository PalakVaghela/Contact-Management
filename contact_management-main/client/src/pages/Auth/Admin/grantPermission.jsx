import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const GrantPermissionModal = ({ user, onClose, onSuccess, token }) => {
  const [permissions, setPermissions] = useState({
    edit: user?.permissions?.edit || false,
    delete: user?.permissions?.delete || false,
  });

  const handleChange = (e) => {
    setPermissions({
      ...permissions,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
          `http://localhost:3001/api/v0/contact/grant-permissions/${user._id}`,
        permissions,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success('Permissions updated successfully!');
        onSuccess(); // Refresh user list
        onClose();   // Close modal
      } else {
        toast.error('Failed to update permissions!');
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error('Server error while updating permissions.');
    }
  };

  return (
    
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Grant Permissions to {user.firstname} {user.lastname}</h5>
                <button type="button" className="close" onClick={onClose}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <label className="d-block">
                  <input
                    type="checkbox"
                    name="edit"
                    checked={permissions.edit}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Edit Contact
                </label>
                <label className="d-block">
                  <input
                    type="checkbox"
                    name="delete"
                    checked={permissions.delete}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Delete Contact
                </label>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleSubmit}>Save</button>
                <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      );
  
};

export default GrantPermissionModal;
