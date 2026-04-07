// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useAuth } from '../../../context/authContext';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
//  import GrantPermissionModal from './grantPermission';

// function ManageUser() {
//   const { user ,token} = useAuth();
//   const [users, setUsers] = useState([]);
//   const [isCreatingTeam, setIsCreatingTeam] = useState(false);
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [teamName, setTeamName] = useState('');
//   const [activeUser, setActiveUser] = useState(null);

//   useEffect(() => {
//     if(user && token){
//       axios.get('http://localhost:3001/api/v0/allusers', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .then((response) => {
//         if (response.data.success) {
//           setUsers(response.data.users);
//         } else {
//           console.error('Failed to fetch users:', response.data.message);
//         }
//       })
//       .catch((error) => {
//         console.error('Error fetching users:', error);
//       });
//     }
   
//   }, [user,token]);

//   const handleCheckboxChange = (userId) => {
//     setSelectedUsers((prevSelected) =>
//       prevSelected.includes(userId)
//         ? prevSelected.filter((id) => id !== userId)
//         : [...prevSelected, userId]
//     );
//   };
//     const handleRowClick = (user) => {
//       console.log("On click of rowz",user)
       
//       setActiveUser(user); 
//     };

//   const handleCreateTeam = () => {
//     if (!teamName || selectedUsers.length === 0) {
//       toast.info('Please enter a team name and select at least one user!');
//       return;
//     }

//     axios.post('http://localhost:3001/api/v0/team/createteam', {
//       name: teamName,
//       memberEmails: users.filter((user) => selectedUsers.includes(user._id)).map((user) => user.email)
//     }, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     .then((response) => {
//       if (response.data.success) {
//         toast.success('Team created successfully!');
//         setIsCreatingTeam(false);
//         setSelectedUsers([]);
//         setTeamName('');
//       } else {
//         alert('Failed to create team: ' + response.data.message);
//       }
//     })
//     .catch((error) => {
//       console.error('Error creating team:', error);
//     });
//   };

//   return (
//     <div className="p-4">
//       <button 
//         className="btn btn-primary mb-3" 
//         onClick={() => setIsCreatingTeam(!isCreatingTeam)}
//       >
//         {isCreatingTeam ? 'Cancel Team Creation' : 'Create Team'}
//       </button>

//       {isCreatingTeam && (
//         <div className="mb-3">
//           <input 
//             type="text" 
//             className="form-control" 
//             placeholder="Enter Team Name" 
//             value={teamName} 
//             onChange={(e) => setTeamName(e.target.value)}
//           />
//           <button 
//             className="btn btn-success mt-2" 
//             onClick={handleCreateTeam}
//           >
//             Submit Team
//           </button>
//         </div>
//       )}

//       <table className="table table-bordered table-striped mt-3">
//         <thead className="table-primary">
//           <tr>
//             <th>#</th>
//             {isCreatingTeam && <th>Select</th>}
//             <th>First Name</th>
//             <th>Last Name</th>
//             <th>Email</th>
//             <th>Role</th>
//             <th>Permissions</th>
//           </tr>
//         </thead>

//         <tbody>
//   {users.length > 0 ? (
//     users.map((user, index) => (
//       <tr key={user._id} onClick={() => handleRowClick(user)} style={{ cursor: 'pointer' }}>
//         <td>{index + 1}</td>
//         {isCreatingTeam && (
//           <td>
//             <input
//               type="checkbox"
//               checked={selectedUsers.includes(user._id)}
//               onChange={() => handleCheckboxChange(user._id)}
//             />
//           </td>
//         )}
//         <td>{user.firstname}</td>
//         <td>{user.lastname}</td>
//         <td>{user.email}</td>
//         <td>{user.role}</td>
//         <td>
//           {user.permissions?.edit && user.permissions?.delete
//             ? "Edit, Delete"
//             : user.permissions?.edit
//             ? "Edit"
//             : user.permissions?.delete
//             ? "Delete"
//             : "None"}
//         </td>
//       </tr>
//     ))
//   ) : (
//     <tr>
//       <td colSpan={isCreatingTeam ? 7 : 6} className="text-center">
//         No users found
//       </td>
//     </tr>
//   )}
// </tbody>

//       </table>
//       {activeUser && (
//         <GrantPermissionModal 
//         user={activeUser} 
//         token={token} 
//         onSuccess={() => {
//           console.log("enterd in grant")
//           axios.get('http://localhost:3001/api/v0/allusers', {
//             headers: { Authorization: `Bearer ${token}` },
//           })
//           .then((response) => {
//             if (response.data.success) {
//               setUsers(response.data.users);
//             }
//           })
//           .catch((error) => console.error('Error fetching users:', error));
//         }}
//         onClose={() => setActiveUser(null)}
//         />
//       )}
//     </div>
//   );
// }

// export default ManageUser;

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../../../context/authContext";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import GrantPermissionModal from "./grantPermission";
// import { FaTrash, FaEdit } from "react-icons/fa"; // Import icons

// function ManageUser() {
//   const { user, token } = useAuth();
//   const [users, setUsers] = useState([]);
//   const [isCreatingTeam, setIsCreatingTeam] = useState(false);
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [teamName, setTeamName] = useState("");
//   const [activeUser, setActiveUser] = useState(null);

//   // Fetch users on component mount
//   useEffect(() => {
//     if (user && token) {
//       fetchUsers();
//     }
//   }, [user, token]);

//   const fetchUsers = () => {
//     axios
//       .get("http://localhost:3001/api/v0/allusers", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((response) => {
//         if (response.data.success) {
//           setUsers(response.data.users);
//         } else {
//           console.error("Failed to fetch users:", response.data.message);
//         }
//       })
//       .catch((error) => console.error("Error fetching users:", error));
//   };

//   // Handle user deletion
//   const handleDelete = (userId) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       axios
//         .delete(`http://localhost:3001/api/v0/deleteuser/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((response) => {
//           if (response.data.success) {
//             toast.success("User deleted successfully!");
//             fetchUsers(); // Refresh users
//           } else {
//             toast.error("Failed to delete user!");
//           }
//         })
//         .catch((error) => {
//           console.error("Error deleting user:", error);
//           toast.error("Server error while deleting user.");
//         });
//     }
//   };

//   // Handle user role update
//   const handleUpdate = (userId) => {
//     const newRole = prompt("Enter new role (Intern, Jr. Developer, Sr. Developer):");
//     if (newRole && ["Intern", "Jr. Developer", "Sr. Developer"].includes(newRole)) {
//       axios
//         .put(
//           `http://localhost:3001/api/v0/updateuser/${userId}`,
//           { role: newRole },
//           { headers: { Authorization: `Bearer ${token}` } }
//         )
//         .then((response) => {
//           if (response.data.success) {
//             toast.success("User role updated successfully!");
//             fetchUsers(); // Refresh users
//           } else {
//             toast.error("Failed to update role!");
//           }
//         })
//         .catch((error) => {
//           console.error("Error updating user role:", error);
//           toast.error("Server error while updating role.");
//         });
//     } else {
//       toast.warning("Invalid role entered.");
//     }
//   };

//   return (
//     <div className="p-4">
//       <button className="btn btn-primary mb-3" onClick={() => setIsCreatingTeam(!isCreatingTeam)}>
//         {isCreatingTeam ? "Cancel Team Creation" : "Create Team"}
//       </button>

//       {isCreatingTeam && (
//         <div className="mb-3">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Enter Team Name"
//             value={teamName}
//             onChange={(e) => setTeamName(e.target.value)}
//           />
//           <button className="btn btn-success mt-2" onClick={handleCreateTeam}>
//             Submit Team
//           </button>
//         </div>
//       )}

//       <table className="table table-bordered table-striped mt-3">
//         <thead className="table-primary">
//           <tr>
//             <th>#</th>
//             {isCreatingTeam && <th>Select</th>}
//             <th>First Name</th>
//             <th>Last Name</th>
//             <th>Email</th>
//             <th>Role</th>
//             <th>Permissions</th>
//             <th>Actions</th> {/* New column for actions */}
//           </tr>
//         </thead>

//         <tbody>
//           {users.length > 0 ? (
//             users.map((user, index) => (
//               <tr key={user._id} onClick={() => setActiveUser(user)} style={{ cursor: "pointer" }}>
//                 <td>{index + 1}</td>
//                 {isCreatingTeam && (
//                   <td>
//                     <input
//                       type="checkbox"
//                       checked={selectedUsers.includes(user._id)}
//                       onChange={() => handleCheckboxChange(user._id)}
//                     />
//                   </td>
//                 )}
//                 <td>{user.firstname}</td>
//                 <td>{user.lastname}</td>
//                 <td>{user.email}</td>
//                 <td>{user.role}</td>
//                 <td>
//                   {user.permissions?.edit && user.permissions?.delete
//                     ? "Edit, Delete"
//                     : user.permissions?.edit
//                     ? "Edit"
//                     : user.permissions?.delete
//                     ? "Delete"
//                     : "None"}
//                 </td>
//                 <td>
//                   <FaEdit
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleUpdate(user._id);
//                     }}
//                     className="text-primary mx-2"
//                     style={{ cursor: "pointer" }}
//                   />
//                   <FaTrash
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleDelete(user._id);
//                     }}
//                     className="text-danger"
//                     style={{ cursor: "pointer" }}
//                   />
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={isCreatingTeam ? 8 : 7} className="text-center">
//                 No users found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {activeUser && (
//         <GrantPermissionModal
//           user={activeUser}
//           token={token}
//           onSuccess={fetchUsers} // Refresh users after granting permission
//           onClose={() => setActiveUser(null)}
//         />
//       )}
//     </div>
//   );
// }

// export default ManageUser;



 ////////////// ----------- Final Code

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/authContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GrantPermissionModal from "./grantPermission";
import { FaTrash, FaEdit } from "react-icons/fa";

function ManageUser() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    if (user && token) {
      fetchUsers();
    }
  }, [user, token]);

  const fetchUsers = () => {
    axios
      .get("http://localhost:3001/api/v0/allusers", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.success) {
          setUsers(response.data.users);
        } else {
          console.error("Failed to fetch users:", response.data.message);
        }
      })
      .catch((error) => console.error("Error fetching users:", error));
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleCreateTeam = () => {
    if (!teamName || selectedUsers.length === 0) {
      toast.info("Please enter a team name and select at least one user!");
      return;
    }

    axios
      .post(
        "http://localhost:3001/api/v0/team/createteam",
        {
          name: teamName,
          memberEmails: users
            .filter((user) => selectedUsers.includes(user._id))
            .map((user) => user.email),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success("Team created successfully!");
          setIsCreatingTeam(false);
          setSelectedUsers([]);
          setTeamName("");
        } else {
          toast.error("Failed to create team: " + response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error creating team:", error);
      });
  };

  // Handle user deletion
  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`http://localhost:3001/api/v0/deleteuser/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data.success) {
            toast.success("User deleted successfully!");
            fetchUsers(); // Refresh users
          } else {
            toast.error("Failed to delete user!");
          }
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          toast.error("Server error while deleting user.");
        });
    }
  };

  // Handle user role update
  const handleUpdate = (userId) => {
    const newRole = prompt("Enter new role (Intern, Jr. Developer, Sr. Developer):");
    if (newRole && ["Intern", "Jr. Developer", "Sr. Developer"].includes(newRole)) {
      axios
        .put(
          `http://localhost:3001/api/v0/updateuser/${userId}`,
          { role: newRole },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          if (response.data.success) {
            toast.success("User role updated successfully!");
            fetchUsers(); // Refresh users
          } else {
            toast.error("Failed to update role!");
          }
        })
        .catch((error) => {
          console.error("Error updating user role:", error);
          toast.error("Server error while updating role.");
        });
    } else {
      toast.warning("Invalid role entered.");
    }
  };
  return (
    <div className="p-4">
      <button className="btn btn-primary mb-3" onClick={() => setIsCreatingTeam(!isCreatingTeam)}>
        {isCreatingTeam ? "Cancel Team Creation" : "Create Team"}
      </button>

      {isCreatingTeam && (
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <button className="btn btn-success mt-2" onClick={handleCreateTeam}>
            Submit Team
          </button>
        </div>
      )}

      <table className="table table-bordered table-striped mt-3">
        <thead className="table-primary">
          <tr>
            <th>#</th>
            {isCreatingTeam && <th>Select</th>}
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
 <tr key={user._id} onClick={() => setActiveUser(user)} style={{ cursor: "pointer" }}>

                <td>{index + 1}</td>
                {isCreatingTeam && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleCheckboxChange(user._id)}
                    />
                  </td>
                )}
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                              <td>
                 {user.permissions?.edit && user.permissions?.delete
                 ? "Edit, Delete"                    : user.permissions?.edit
                  ? "Edit"
                    : user.permissions?.delete
                 ? "Delete"
                    : "None"}               </td>
                
                <td>
                   <FaEdit
                   onClick={(e) => {
                      e.stopPropagation();
                      handleUpdate(user._id);
                    }}
                   className="text-primary mx-2"
                     style={{ cursor: "pointer" }}
                 />
                  <FaTrash
                    onClick={(e) => {
                       e.stopPropagation();
                      handleDelete(user._id);
                    }}
                    className="text-danger"
                    style={{ cursor: "pointer" }}
                  />
              </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={isCreatingTeam ? 7 : 6} className="text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

{activeUser && (
  <GrantPermissionModal
    user={activeUser}
    token={token}
    onSuccess={fetchUsers} // Refresh users after granting permission
    onClose={() => setActiveUser(null)}
  />
)}
    </div>
  );
}

export default ManageUser;
