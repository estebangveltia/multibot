'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Completa todos los campos');
      return;
    }
    const { error } = await signIn({ email, password });
    if (error) {
      setError('Credenciales incorrectas');
      return;
    }
    router.push('/dashboard');
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-96">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <Input
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">🚀 Ingresar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
