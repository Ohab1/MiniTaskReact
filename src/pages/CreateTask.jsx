import React, { useState, useEffect } from 'react';
import './CreateTask.css';
import { url } from '../constant';
import { useNavigate } from 'react-router';

function CreateTask() {
  const [task, setTask] = useState({
    title: '',
    description: '',
    taskStatus: 'Pending',
    state: '',
    district: '',
    city: '',
    imageUrl: '',
  });
  const [image, setImage] = useState(null);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const navigate=useNavigate()
  // Fetch states
  useEffect(() => {
    fetch(`${url}/states`)
      .then((res) => res.json())
      .then((data) => setStates(data))
      .catch((err) => console.error('Error fetching states:', err));
  }, []);



  // Fetch districts when state changes
  useEffect(() => {
    if (task.state) {
      fetch(`${url}/districts/${task.state}`)
        .then((res) => res.json())
        .then((data) => setDistricts(data))
        .catch((err) => console.error('Error fetching districts:', err));
    } else {
      setDistricts([]);
      setCities([]);
    }
  }, [task.state]);

  // Fetch cities when district changes
  useEffect(() => {
    if (task.district) {
      fetch(` ${url}/cities/${task.district}`)
        .then((res) => res.json())
        .then((data) => setCities(data))
        .catch((err) => console.error('Error fetching cities:', err));
    } else {
      setCities([]);
    }
  }, [task.district]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
  
    try {
      // 1. Upload Image First
      let imageUrl = null;
  
      if (image) {
        const formData = new FormData();
        formData.append('image', image, image.name); // 👈 Important for web browser
  
        const uploadResponse = await fetch(`${url}/uploadimage`, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            // DO NOT set Content-Type manually; browser will set correct multipart boundary
          },
          body: formData,
        });
  
        const uploadData = await uploadResponse.json();
  
        if (!uploadResponse.ok) {
          throw new Error(uploadData.message || 'Failed to upload image');
        }
  
        imageUrl = uploadData.imageUrl;
      } else {
        alert('Please upload an image');
        return;
      }
  
      // 2. Prepare Task Data
      const taskData = {
        ...task,
        imageUrl,
      };
  
      // 3. Send Task Data to Backend
      const taskResponse = await fetch(`${url}/createtasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(taskData),
      });
  
      const taskDataResponse = await taskResponse.json();
  
      if (!taskResponse.ok) {
        throw new Error(taskDataResponse.message || 'Failed to create task');
      }
  
      console.log('Task Created:', taskDataResponse);
      alert('Task created successfully ✅');
      
      // Reset form
      setTask({
        title: '',
        description: '',
        taskStatus: 'Pending',
        state: '',
        district: '',
        city: '',
        imageUrl: '',
      });
      setImage(null);
      navigate("/task-list")
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Something went wrong: ' + error.message);
    }
  };
  
  return (
    <div className="create-task-container">
      <h2>Create Task</h2>
      <form onSubmit={handleCreate} className="create-task-form">
        <input
          type="text"
          name="title"
          placeholder="Enter Task Title"
          value={task.title}
          onChange={handleInputChange}
          required
          className="input-field"
        />
        <textarea
          name="description"
          placeholder="Enter Task Description"
          value={task.description}
          onChange={handleInputChange}
          required
          className="textarea-field"
        />
        <select
          name="state"
          value={task.state}
          onChange={handleInputChange}
          className="select-field"
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state._id} value={state._id}>
              {state.name}
            </option>
          ))}
        </select>
        <select
          name="district"
          value={task.district}
          onChange={handleInputChange}
          className="select-field"
        >
          <option value="">Select District</option>
          {districts.map((district) => (
            <option key={district._id} value={district._id}>
              {district.name}
            </option>
          ))}
        </select>
        <select
          name="city"
          value={task.city}
          onChange={handleInputChange}
          className="select-field"
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city._id} value={city._id}>
              {city.name}
            </option>
          ))}
        </select>
        <input
          type="file"
          onChange={handleImageChange}
          required
          className="file-input"
        />
        <button type="submit" className="submit-button">Create Task</button>
      </form>
    </div>
  );
}

export default CreateTask;
