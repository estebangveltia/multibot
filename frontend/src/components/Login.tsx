'use client';
import { useState } from 'react';
import { supabase, useSession } from '../lib/session-context';

export default function Login() {
  const { setRole, setTenant } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.user) {
      // Fake role/tenant assignment; replace with real logic
      setRole('client');
      setTenant('default');
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <input className="border p-2" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input className="border p-2" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button className="bg-blue-500 text-white p-2" onClick={handleLogin}>Login</button>
    </div>
  );
}
