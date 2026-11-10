import React, { useState } from 'react';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const API_BASE = 'http://localhost:5000/api';

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? '/auth/register' : '/auth/login';
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      } else {
        setMessage(data.message || data.error);
      }
    } catch (err) {
      setMessage('حدث خطأ في الاتصال بالسيرفر');
    }
  };

  if (!token) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', background: '#1e1e1e', color: '#fff', borderRadius: '8px', fontFamily: Tahoma }}>
        <h2>{isRegistering ? 'إنشاء حساب جديد - ApexFit' : 'تسجيل الدخول - ApexFit'}</h2>
        {message && <p style={{ color: '#ff4d4d' }}>{message}</p>}
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '8px', background: '#2a2a2a', color: '#fff', border: '1px solid #444' }} />
          <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '8px', background: '#2a2a2a', color: '#fff', border: '1px solid #444' }} />
          <button type="submit" style={{ padding: '10px', background: '#0070f3', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
            {isRegistering ? 'تسجيل' : 'دخول'}
          </button>
        </form>
        <p style={{ textAlign: 'center', cursor: 'pointer', color: '#0070f3', marginTop: '15px' }} onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'لديك حساب بالفعل؟ سجل دخول' : 'ليس لديك حساب؟ انشئ حساب جديد'}
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', background: '#121212', color: '#fff', minHeight: '100vh', fontFamily: Tahoma }}>
      <h1>🏋️‍♂️ مرحباً بك في تطبيق ApexFit للقيم والتدريب</h1>
      <p>تم تسجيل الدخول بنجاح وحفظ بياناتك سحابياً!</p>
      <button onClick={() => { localStorage.removeItem('token'); setToken(''); }} style={{ padding: '8px 16px', background: '#e63946', color: '#fff', border: 'none', cursor: 'pointer', marginTop: '20px' }}>
        تسجيل الخروج
      </button>
    </div>
  );
}