import React, { useEffect, useState } from 'react';
import { url } from '../constant';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import './TaskList.css';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${url}/taskslist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    const confirm = window.confirm('Are you sure you want to delete this task?');
    if (!confirm) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${url}/deletetasks/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (task) => {
    navigate('/edit-task', { state: { task } });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="tasklist-container">
      <h2>📋 Task List</h2>
      {loading ? (
        <div className="loader">
          <div className="spinner"></div>
          <p>Please wait, your task is loading...</p>
        </div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div className="task-grid">
          {tasks.map((task) => (
            <div className="task-card" key={task._id}>
              {task.image && (
                <img src={`${url}/${task.image}`} alt="task-img" className="task-image" />
              )}
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <div className={`status-badge ${task.taskStatus.toLowerCase()}`}>
                {task.taskStatus}
              </div>
              <div className="location">
                <p><strong>State:</strong> {task.state?.name}</p>
                <p><strong>District:</strong> {task.district?.name}</p>
                <p><strong>City:</strong> {task.city?.name}</p>
              </div>
              <p className="timestamp">
                Created at: {new Date(task.createdAt).toLocaleString()}
              </p>
              <div className="btn-group">
                <button onClick={() => handleEdit(task)} className="edit-btn">
                  <FaEdit /> Edit
                </button>
                <button onClick={() => handleDelete(task._id)} className="delete-btn">
                  <FaTrashAlt /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;
