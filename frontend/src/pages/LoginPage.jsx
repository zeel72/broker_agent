import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Lock, User, Home } from 'lucide-react';
import toast from 'react-hot-toast';
import './LoginPage.css';

const LoginPage = () => {
  const { logIn } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await login(form);
      if (data.success) {
        logIn(data.token);
        toast.success('Welcome back!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background blobs */}
      <div className="login-blob login-blob-1" />
      <div className="login-blob login-blob-2" />

      <div className="login-card glass-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <Home size={28} />
          </div>
          <div>
            <h1 className="login-title">BrokerDesk</h1>
            <p className="login-subtitle">Property Management System</p>
          </div>
        </div>

        <p className="login-welcome">Welcome back! Sign in to continue.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <Input
            id="username"
            label="Username"
            placeholder="Enter your username"
            value={form.username}
            onChange={handleChange}
            icon={<User size={16} />}
            required
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            icon={<Lock size={16} />}
            required
          />
          <Button type="submit" fullWidth disabled={loading} size="lg">
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <p className="login-hint">Single-user access only.</p>
      </div>
    </div>
  );
};

export default LoginPage;
