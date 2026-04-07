import { useNavigate } from 'react-router-dom';
import { use, useEffect, useState } from 'react';
import { Button } from "../../components/button";
import  ManageContact from './manageContact';
import { useAuth } from '../../context/authContext';



function Navbar({ onSelect, onLogout }) {
  const { user } = useAuth();
  return (
    <div className="d-flex justify-content-between border-bottom">
      <p className="h3   text-dark font-bold">Contactify</p>
      <div>      {user && <h4 className='text-center pt-2'>Standard User : <span className='text-primary'>{user.firstname} {user.lastname} </span> </h4>}</div>
      <div className="flex gap-4">
        <Button onClick={() => onSelect("manageContact")}>Manage Contact</Button>
        <Button onClick={onLogout}>Logout</Button>
      </div>
    </div>
  );
}



const UserDashboard = () => {
const {user,logout} = useAuth()
  const [activePage, setActivePage] = useState('manageContact');
  const navigate = useNavigate();

useEffect(()=>{
  if(!user){
    navigate('/login')
  }
},[user,navigate])


if(!user){
  return null;
}



  return (
    <div className="pt-16" style={{ padding: '20px' }}>
      <Navbar onSelect={setActivePage} onLogout={logout} />
    {activePage === 'manageContact' && <ManageContact/>}
    </div>
  );
};

export default UserDashboard;
