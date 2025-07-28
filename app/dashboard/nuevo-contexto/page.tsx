'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function NuevoContextoPage() {
  const { usuario } = useAuth();
  const [nombre, setNombre] = useState('');
  const [contenido, setContenido] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuario) return;

    try {
      const res = await fetch('/api/contextos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          contenido,
          tenantId: usuario.tenant_id,
        }),
      });

      if (res.ok) {
        setMensaje('✅ Contexto creado con éxito');
        setNombre('');
        setContenido('');
      } else {
        setMensaje('❌ Error al crear el contexto');
      }
    } catch (error) {
      setMensaje('❌ Error al conectar con el servidor');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧠 Crear nuevo contexto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <textarea
          placeholder="Contenido del contexto"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          ➕ Crear
        </button>
      </form>
      {mensaje && <p className="mt-4">{mensaje}</p>}
    </div>
  );
}
