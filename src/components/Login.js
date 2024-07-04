import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.get('https://v1.nocodeapi.com/yakupkarakoc/google_sheets/SGNixlrYbbQCYLmR?tabId=data');
      const data = response.data.data;

      const user = data.find(
        user => user.username === values.username && user.password === values.password
      );

      if (user) {
        message.success('Giriş başarılı!');
        localStorage.setItem('loggedIn', true);
        navigate('/dashboard');
      } else {
        message.error('Kullanıcı adı veya şifre hatalı!');
      }
    } catch (error) {
      console.error('Login Error:', error);
      message.error('Giriş işlemi başarısız oldu, lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Form name="login" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical" className="login-form">
        <h2>Giriş</h2>
        <Form.Item name="username" rules={[{ required: true, message: 'Kullanıcı adınızı giriniz!' }]}>
          <Input type="email" placeholder="E-posta" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Şifrenizi giriniz!' }]}>
          <Input.Password placeholder="Şifre" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} className="login-form-button">Giriş Yap</Button>
        </Form.Item>
        <div className="login-form-footer">
          <Button type="link" onClick={() => message.info('Şifre sıfırlama işlemi henüz uygulanmadı.')}>Şifremi Unuttum</Button>
          <br />
          <Button type="link" onClick={() => message.info('Kayıt işlemi henüz uygulanmadı.')}>Hesabınız yok mu? Kaydol</Button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
