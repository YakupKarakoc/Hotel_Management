import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import RoomAvailability from './components/RoomAvailability';
import AllRooms from './components/AllRooms';
import './App.css';

const App = () => {
  const isLoggedIn = localStorage.getItem('loggedIn');

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route path="/room-availability" element={<RoomAvailability />} />
      <Route path="/all-rooms" element={<AllRooms />} /> 
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
