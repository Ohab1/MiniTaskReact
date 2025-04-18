import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { url } from '../constant';
import './EditTask.css';

function EditTask() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef();
  const taskData = location.state?.task;

  const [task, setTask] = useState({
    title: '',
    description: '',
    state: '',
    district: '',
    city: '',
    taskStatus: 'Pending',
    imageUrl: '',
  });

  const [image, setImage] = useState(null);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    if (taskData) {
      setTask({
        title: taskData.title || '',
        description: taskData.description || '',
        state: taskData.state?._id || '',
        district: taskData.district?._id || '',
        city: taskData.city?._id || '',
        taskStatus: taskData.taskStatus || 'Pending',
        imageUrl: taskData.image || '',
      });
    }
  }, [taskData]);

  useEffect(() => {
    fetch(`${url}/states`)
      .then((res) => res.json())
      .then((data) => setStates(data))
      .finally(() => setLoading(false)); // Set loading to false once data is fetched
  }, []);

  useEffect(() => {
    if (task.state) {
      setLoading(true); // Set loading to true before fetching districts
      fetch(`${url}/districts/${task.state}`)
        .then((res) => res.json())
        .then((data) => setDistricts(data))
        .finally(() => setLoading(false)); // Set loading to false once data is fetched
    }
  }, [task.state]);

  useEffect(() => {
    if (task.district) {
      setLoading(true); // Set loading to true before fetching cities
      fetch(`${url}/cities/${task.district}`)
        .then((res) => res.json())
        .then((data) => setCities(data))
        .finally(() => setLoading(false)); // Set loading to false once data is fetched
    }
  }, [task.district]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setTask((prev) => ({
        ...prev,
        imageUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleImageClick = () => {
    // fileInputRef.current.click();
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      let updatedImageUrl = task.imageUrl;

      // if (image) {
      //   const formData = new FormData();
      //   formData.append('image', image);

      //   const uploadRes = await fetch(`${url}/uploadimage`, {
      //     method: 'POST',
      //     headers: {
      //       Authorization: 'Bearer ' + localStorage.getItem('token'),
      //     },
      //     body: formData,
      //   });

      //   const uploadData = await uploadRes.json();
      //   if (!uploadRes.ok) {
      //     throw new Error(uploadData.message || 'Image upload failed');
      //   }

      //   updatedImageUrl = uploadData.imageUrl;
      // }

      const updatedTask = {
        title: task.title,
        description: task.description,
        state: task.state,
        district: task.district,
        city: task.city,
        taskStatus: task.taskStatus,
        image: updatedImageUrl,
      };

      const res = await fetch(`${url}/updatetasks/${taskData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(updatedTask),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Update failed');
      }

      alert('Task updated successfully!');
      navigate('/task-list');
    } catch (error) {
      console.error('Update error:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="edit-task-container">
      <h2>Edit Task</h2>
      {loading ? (
        <div className="loader">
          <div className="spinner"></div>
          <p>Please wait, your task is loading...</p>
        </div>
      ) : (
        <form onSubmit={handleEdit} className="edit-task-form">
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleInputChange}
            placeholder="Task Title"
            required
          />
          <textarea
            name="description"
            value={task.description}
            onChange={handleInputChange}
            placeholder="Task Description"
            required
          ></textarea>

          <select name="state" value={task.state} onChange={handleInputChange} required>
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          <select name="district" value={task.district} onChange={handleInputChange} required>
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>

          <select name="city" value={task.city} onChange={handleInputChange} required>
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            name="taskStatus"
            value={task.taskStatus}
            onChange={handleInputChange}
            required
          >
            <option value="Pending">Pending</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />

          {task.imageUrl && (
            <img
              src={
                task.imageUrl.startsWith('blob:') ? task.imageUrl : `${url}/${task.imageUrl}`
              }
              alt="Task"
              width="100"
              style={{ marginTop: '10px', cursor: 'pointer' }}
              onClick={handleImageClick}
            />
          )}
          {!task.imageUrl && (
            <button type="button" onClick={handleImageClick}>
              Choose Image
            </button>
          )}

          <button type="submit">Save Changes</button>
        </form>
      )}
    </div>
  );
}

export default EditTask;
