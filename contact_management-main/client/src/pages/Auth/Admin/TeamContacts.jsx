import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/authContext';
import { FaEnvelope, FaPhone, FaBriefcase, FaUser } from 'react-icons/fa';

function TeamContacts() {
  const { teamId } = useParams();
  const { token } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/v0/team/${teamId}/contacts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      if (response.data.success) {
        setTeamName(response.data.teamName);
        setContacts(response.data.contacts);
      } else {
        console.error('Failed to fetch contacts:', response.data.message);
      }
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching contacts:', error);
      setLoading(false);
    });
  }, [teamId, token]);

  if (loading) return <h3 className="text-center">Loading...</h3>;

  return (
    <div className="container py-4">
    <h2 className="mb-4">Contacts for Team: {teamName}</h2>
    {contacts.length > 0 ? (
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-primary text-center">
            <tr>
              <th>#</th>
              <th> Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Designation</th>
              <th>Created By</th>
            </tr>
          </thead>
          <tbody className='text-center'>
            {contacts.map((contact, index) => (
              <tr key={contact.id}>
                <td>{index + 1}</td>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.phoneNo}</td>
                <td>{contact.designation}</td>
                <td>{contact.createdByEmail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <h3 className="text-center text-muted">No contacts found</h3>
    )}
  </div>
  );
}

export default TeamContacts;
