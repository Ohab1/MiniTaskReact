import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateTask from './pages/CreateTask';
import TaskList from './pages/TaskList';
import EditTask from './pages/EditTask';
import ProtectedRoute from './ProtectedRoute';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/create-task" element={<ProtectedRoute><CreateTask /></ProtectedRoute>} />
      <Route path="/task-list" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
      <Route path="/edit-task" element={<ProtectedRoute><EditTask /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
