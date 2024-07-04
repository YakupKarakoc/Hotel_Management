import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Dropdown, Menu, Modal, Input, message } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import './RoomAvailability.css';

const RoomAvailability = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { availableRooms, guestCount } = location.state || {
    availableRooms: [],
    guestCount: 0,
  };

  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');

  const handleExit = () => {
    navigate('/');
  };

  const handleReservation = (room) => {
    alert(`Rezervasyon yapıldı: ${room['Oda Numarası']}`);
  };

  const handleMenuClick = ({ key }) => {
    setSelectedPeriod(key);
    setEmailModalVisible(true);
  };

  const handleEmailSubmit = () => {
    setEmailModalVisible(false);
    message.success(`Odaların ${selectedPeriod} durumu mailinize gönderildi.`);
  };

  const handleEmailCancel = () => {
    setEmailModalVisible(false);
    setEmail('');
  };

  const handleViewAllRooms = () => {
    navigate('/all-rooms');
  };

  const filteredRooms = availableRooms.filter((room) => {
    if (guestCount === 1) {
      return room['Oda Tipi'].toLowerCase() === 'tek kişilik';
    } else if (guestCount === 2) {
      return room['Oda Tipi'].toLowerCase() === 'çift kişilik';
    } else if (guestCount >= 3 && guestCount <= 10) {
      return room['Oda Tipi'].toLowerCase() === 'aile odası';
    } else {
      return false;
    }
  });

  const emailMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="günlük">Günlük</Menu.Item>
      <Menu.Item key="haftalık">Haftalık</Menu.Item>
      <Menu.Item key="aylık">Aylık</Menu.Item>
    </Menu>
  );

  return (
    <div className="room-availability-container">
      <div className="header">
        <Button type="primary" onClick={handleViewAllRooms}>
          Boş Odaları Listele
        </Button>
        <h1>Oda Mevcudiyeti</h1>
        <Dropdown overlay={emailMenu} trigger={['click']}>
          <Button type="primary">Oda Durumunu Gönder</Button>
        </Dropdown>
        <Button
          type="primary"
          icon={<LogoutOutlined />}
          onClick={handleExit}
        >
          Çıkış
        </Button>
      </div>
      <div className="room-cards">
        {filteredRooms.map((room, index) => (
          <Card
            key={index}
            title={`Oda Numarası: ${room['Oda Numarası']}`}
            extra={<Button onClick={() => handleReservation(room)}>Rezerve Et</Button>}
          >
            <p>Oda Tipi: {room['Oda Tipi']}</p>
            <p>Kapasite: {room['Kapasite']}</p>
            <p>Fiyat: {room['Fiyat']}</p>
          </Card>
        ))}
      </div>
      <Modal
        title="Oda Durumunu Gönder"
        visible={emailModalVisible}
        onOk={handleEmailSubmit}
        onCancel={handleEmailCancel}
      >
        <Input
          placeholder="Email adresinizi giriniz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default RoomAvailability;
