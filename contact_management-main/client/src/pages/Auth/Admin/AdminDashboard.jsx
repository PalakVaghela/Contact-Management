
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from "../../../components/button";
import { useAuth } from '../../../context/authContext';
import ManageTeam from './ManageTeam';
import ManageUser from './ManageUser';
import TeamContacts from './TeamContacts';
import { Route,Routes } from 'react-router-dom';
function Navbar({ onSelect }) {
  const navigate = useNavigate(); 
  const {user, logout } = useAuth()

  return (
    <div className="d-flex justify-content-between border-bottom">
      <p className="h3   text-dark font-bold">Contactify</p>
      <div>      {user && <h4 className='text-center pt-2'>Admin: <span className='text-primary'>{user.firstname} {user.lastname} </span> </h4>}</div>
      <div className="flex gap-4">
        <Button onClick={() => navigate('/admin-dashboard/manageUser')}>Manage User</Button>
        <Button onClick={() => navigate('/admin-dashboard/manageTeam')}>Manage Team</Button>
        <Button onClick={logout}>Logout</Button>
      </div>

    </div>
  );
}




const AdminDashboard = () => {
  const [activePage, setActivePage] = useState('manageUser');
  const navigate = useNavigate();
  const {user} = useAuth();

  useEffect(()=>{
    if(!user || user.role !== 'admin'){
      navigate('/login')
    }
  },[user,navigate])

  if(!user || user.role !== 'admin'){
    navigate('/login');
    return null;
  }

  return (
    <div className="pt-16" style={{ padding: '20px' }}>
      <Navbar onSelect={setActivePage} />
      <Routes>
        <Route path="manageUser" element={<ManageUser />} />
        <Route path="manageTeam" element={<ManageTeam />} />
        <Route path="teamcontact/:teamId" element={<TeamContacts />} />
        <Route path="*" element={<ManageUser />} /> 
      </Routes>
    </div>
  );
};

export default AdminDashboard;
