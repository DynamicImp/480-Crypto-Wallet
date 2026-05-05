import React, { useState } from 'react';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('https://reimagined-yodel-97jx5jgw5p9427v55-5000.app.github.dev/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (data.success) {
      onLoginSuccess();
    } else {
      alert("Wrong username or password!");
    }
  };

  return (
    <div id="container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username (admin)" onChange={(e) => setUsername(e.target.value)} /><br/>
        <input type="password" placeholder="Password (password123)" onChange={(e) => setPassword(e.target.value)} /><br/>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default Login;