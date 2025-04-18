import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
  const token = localStorage.getItem('token');
  console.log("token App ",token);
  
  return (
    <Routes>
      {/* Agar token hai, toh Login aur Signup ko block kar denge */}
      <Route path="/" element={token ? <Navigate to="/home" /> : <Login />} />
      <Route path="/signup" element={token ? <Navigate to="/home" /> : <Signup />} />

      {/* Protected Routes (Home, Dashboard, Create Task, etc.) */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-task"
        element={
          <ProtectedRoute>
            <CreateTask />
          </ProtectedRoute>
        }
      />
      <Route
        path="/task-list"
        element={
          <ProtectedRoute>
            <TaskList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-task"
        element={
          <ProtectedRoute>
            <EditTask />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
