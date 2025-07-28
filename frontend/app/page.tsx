'use client';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut } from 'lucide-react';

export default function Home() {
  const { user, login, logout } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 gap-4">
      {user ? (
        <>
          <p className="text-xl">Hola, {user.email}</p>
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={logout}>
            <LogOut className="inline" /> Cerrar sesión
          </button>
        </>
      ) : (
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => login('demo@demo.com', 'password')}>
          <LogIn className="inline" /> Iniciar sesión
        </button>
      )}
    </main>
  );
}
