import React, { useState, useEffect } from 'react';
import './ManageUsers.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const querySnapshot = await getDocs(usersCollection);
        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <section id="users" className="admin-tab active">
      <div className="admin-header">
        <h2>User Management</h2>
      </div>
      <div className="header-actions">
          <div className="search-filters">
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              className="search-input" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      <div className="users-grid">
        {filteredUsers.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-card-header">
              <img src={user.photoURL || 'https://tse4.mm.bing.net/th?id=OIP.hGSCbXlcOjL_9mmzerqAbQHaHa&rs=1&pid=ImgDetMain'} alt={user.name} className="user-avatar" />
            </div>
            <div className="user-card-content">
              <h3> Name : {user.name}</h3>
              <p className="user-email"> Email : {user.email}</p>
              <div className="user-meta">
                <span className={`user-status ${user.role?.toLowerCase() || 'user'}`}>
                  {user.role || 'User'}
                </span>
                <span className="user-joined">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ManageUsers;
