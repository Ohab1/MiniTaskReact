import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaList, FaEdit, FaSignOutAlt } from 'react-icons/fa';

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>📋 MiniTask Manager</h1>
        <p>Stay organized and productive</p>
      </header>

      <main className="home-main">
        <div className="card" onClick={() => handleNavigate('/create-task')}>
          <FaPlus className="card-icon" />
          <h3>Create Task</h3>
          <p>Add a new task with location and image</p>
        </div>

        <div className="card" onClick={() => handleNavigate('/task-list')}>
          <FaList className="card-icon" />
          <h3>Task List</h3>
          <p>View and manage all your tasks</p>
        </div>

        <div className="card" onClick={handleLogout}>
  <FaSignOutAlt className="card-icon" />
  <h3>Logout</h3>
  <p>Log out from your account</p>
</div>
      </main>
    </div>
  );
}

export default Home;
