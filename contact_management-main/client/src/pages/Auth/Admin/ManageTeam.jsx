import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers } from 'react-icons/fa';

import { useAuth } from '../../../context/authContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useNavigate } from 'react-router-dom';
function ManageTeam() {
  const [teams, setTeams] = useState([]);
const {user,token} = useAuth();
const navigate = useNavigate();
  useEffect(() => {
    if(user){
      axios.get('http://localhost:3001/api/v0/team/getTeams', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          setTeams(response.data.teams);
        } else {
          console.error('Failed to fetch teams:', response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching teams:', error);
      });

    }
   
  }
  , [user, token]);


  const handleDeleteTeam = (id,name) => {
    axios.delete(`http://localhost:3001/api/v0/team/deleteTeam/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.data.success) {
        toast.success(`Team ${name} Deleted Successfully`)
        setTeams((prevTeams) => prevTeams.filter((team) => team._id !== id));
      } else {
        console.error('Failed to delete team:', response.data.message);
      }
    })
    .catch((error) => {
      console.error('Error deleting team:', error);
    });
  };

  return (
    <div className="container py-4">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {teams.length > 0 ? (
          teams.map((team) => (
            <div key={team._id} className="col">
              <div className="card team-card h-100">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    <FaUsers size={32} className="text-primary me-3" />
                    <h5 className="card-title mb-0">{team.name}</h5>
                  </div>
                  <p className="card-text text-muted">
                    {team.members.length} Members
                  </p>
                  <p className="card-text text-muted">
                    {team.members.map(member => member.email).join(', ')}
                  </p>
                  <div className="mt-auto d-flex gap-2">
                    <button 
                      className="btn btn-outline-primary" 
                      onClick={() => navigate(`/admin-dashboard/teamcontact/${team._id}`)}
                    >
                      View Contacts
                    </button>
                    <button 
                      className="btn btn-outline-danger" 
                      onClick={() => handleDeleteTeam(team._id, team.name)}
                    >
                      Delete Team
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h3 className="text-center  text-muted">No teams found</h3>
        )}
      </div>
    </div>
  );
}

export default ManageTeam;
