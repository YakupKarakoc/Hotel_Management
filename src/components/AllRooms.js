import React, { useEffect, useState } from 'react';
import { Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './AllRooms.css';

const AllRooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('https://v1.nocodeapi.com/yakupkarakoc/google_sheets/fbMHobAOLYTdKcAY?tabId=oda');
        const data = await response.json();
        console.log('API Response:', data); 
        const formattedData = data.data.map((row) => ({
          'Oda Tipi': row['Oda Tipi'],
          'Oda Numarası': row['Oda Numarası'],
          'Kapasite': row['Kapasite'],
          'Giriş Tarihi': row['Giriş Tarihi'],
          'Çıkış Tarihi': row['Çıkış Tarihi'],
          'Durum': row['Durum'],
          'Fiyat': row['Fiyat'],
        }));
        console.log('Formatted Data:', formattedData); 
        setRooms(formattedData);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    fetchRooms();
  }, []);

  const handleBack = () => {
    navigate('/room-availability');
  };

  return (
    <div className="all-rooms-container">
      <div className="header">
        <Button onClick={handleBack}>Geri Dön</Button>
      </div>
      <div className="room-cards">
        {rooms.map((room, index) => (
          <Card
            key={index}
            title={`Oda Numarası: ${room['Oda Numarası']}`}
            extra={<Button onClick={() => alert(`Rezervasyon yapıldı: ${room['Oda Numarası']}`)}>Rezerve Et</Button>}
          >
            <p>Oda Tipi: {room['Oda Tipi']}</p>
            <p>Kapasite: {room['Kapasite']}</p>
            <p>Giriş Tarihi: {room['Giriş Tarihi']}</p>
            <p>Çıkış Tarihi: {room['Çıkış Tarihi']}</p>
            <p>Durum: {room['Durum']}</p>
            <p>Fiyat: {room['Fiyat'] }</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllRooms;
