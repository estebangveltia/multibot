'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Lock } from 'lucide-react';
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
            <h1 className="text-xl font-semibold text-center flex items-center justify-center gap-2">
              🔐 Iniciar sesión
            </h1>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="pl-9"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="pl-9"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">🚀 Ingresar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
