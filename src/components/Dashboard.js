import React, { useState, useEffect } from "react";
import { Card, Button, Input, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import moment from "moment";
import tek1 from "./images/tek.1.jpg";
import tek2 from "./images/tek.2.jpg";
import cift1 from "./images/cift.1.jpg";
import cift2 from "./images/cift.2.jpeg";
import aile1 from "./images/aile.1.jpg";
import aile2 from "./images/aile.2.jpg";

const { RangePicker } = DatePicker;

const roomDescriptions = {
  single: ["Geniş yatak", "Ücretsiz Wi-Fi", "Klima", "Mini bar"],
  double: [
    "Çift kişilik geniş yatak",
    "Ücretsiz Wi-Fi",
    "Klima",
    "Kahvaltı dahil",
  ],
  family: [
    "Geniş aile odası",
    "Ücretsiz Wi-Fi",
    "Klima",
    "Balkon",
  ],
};

const Dashboard = () => {
  const [guestCount, setGuestCount] = useState(1);
  const [dates, setDates] = useState(null);
  const navigate = useNavigate();

  const [tekImageIndex, setTekImageIndex] = useState(0);
  const [ciftImageIndex, setCiftImageIndex] = useState(0);
  const [aileImageIndex, setAileImageIndex] = useState(0);

  const tekImages = [tek1, tek2];
  const ciftImages = [cift1, cift2];
  const aileImages = [aile1, aile2];

  useEffect(() => {
    const tekInterval = setInterval(() => {
      setTekImageIndex((prevIndex) => (prevIndex + 1) % tekImages.length);
    }, 3000);

    const ciftInterval = setInterval(() => {
      setCiftImageIndex((prevIndex) => (prevIndex + 1) % ciftImages.length);
    }, 3000);

    const aileInterval = setInterval(() => {
      setAileImageIndex((prevIndex) => (prevIndex + 1) % aileImages.length);
    }, 3000);

    return () => {
      clearInterval(tekInterval);
      clearInterval(ciftInterval);
      clearInterval(aileInterval);
    };
  }, [tekImages.length, ciftImages.length, aileImages.length]);

  const checkAvailability = async () => {
    if (!dates || !guestCount) {
     
      return;
    }
    const formattedDates = dates.map(date => moment(date).format('YYYY-MM-DD'));
    const checkInDate = formattedDates[0];
    const checkOutDate = formattedDates[1];
  
    const response = await fetch('https://v1.nocodeapi.com/yakupkarakoc/google_sheets/fbMHobAOLYTdKcAY?tabId=oda');
    const data = await response.json();
  
    // Assuming data is an object with a 'data' key holding the array of rooms
    const rooms = Array.isArray(data) ? data : data.data;
  
    let filteredRooms = [];
  
    if (guestCount === 1) {
      filteredRooms = rooms.filter(room => room['Oda Tipi'].toLowerCase() === 'tek kişilik');
    } else if (guestCount === 2) {
      filteredRooms = rooms.filter(room => room['Oda Tipi'].toLowerCase() === 'çift kişilik');
    } else if (guestCount >= 3) {
      filteredRooms = rooms.filter(room => room['Oda Tipi'].toLowerCase() === 'aile odası');
    }
  
    const availableRooms = filteredRooms.filter(room => {
      const roomCheckIn = moment(room['Giriş Tarihi'], 'YYYY-MM-DD');
      const roomCheckOut = moment(room['Çıkış Tarihi'], 'YYYY-MM-DD');
      const isAvailable = roomCheckIn.isAfter(checkOutDate) || roomCheckOut.isBefore(checkInDate);
      return room['Durum'] === 'Boş' && isAvailable && room['Kapasite'] >= guestCount;
    });
  
    navigate('/room-availability', { state: { availableRooms, checkInDate, checkOutDate, guestCount } });
  };
  
  

  const disabledDate = (current) => {
    // Disable dates before today
    return current && current < moment().startOf("day");
  };

  return (
    <div className="dashboard">
      <div className="filters">
        <div className="guest-input-container">
          <span>Kişi Sayısı</span>
          <Input
            type="number"
            min={1}
            max={10}
            value={guestCount}
            onChange={(e) => setGuestCount(parseInt(e.target.value))}
            className="guest-input"
          />
        </div>
        <RangePicker
          onChange={(dates) => setDates(dates)}
          className="date-picker"
          disabledDate={disabledDate}
        />
        <Button
          type="primary"
          onClick={checkAvailability}
          className="check-button"
        >
          Uygunluğu Kontrol Et
        </Button>
      </div>
      <div className="card-container">
        <Card
          title="Tek Kişilik Oda"
          className="room-card"
          cover={
            <img
              className="room-image"
              alt="Tek Kişilik Oda"
              src={tekImages[tekImageIndex]}
            />
          }
        >
          <div className="room-details">
            <ul>
              {roomDescriptions.single.map((description, index) => (
                <li key={index}>{description}</li>
              ))}
            </ul>
          </div>
        </Card>
        <Card
          title="Çift Kişilik Oda"
          className="room-card"
          cover={
            <img
              className="room-image"
              alt="Çift Kişilik Oda"
              src={ciftImages[ciftImageIndex]}
            />
          }
        >
          <div className="room-details">
            <ul>
              {roomDescriptions.double.map((description, index) => (
                <li key={index}>{description}</li>
              ))}
            </ul>
          </div>
        </Card>
        <Card
          title="Aile Odası"
          className="room-card"
          cover={
            <img
              className="room-image"
              alt="Aile Odası"
              src={aileImages[aileImageIndex]}
            />
          }
        >
          <div className="room-details">
            <ul>
              {roomDescriptions.family.map((description, index) => (
                <li key={index}>{description}</li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
