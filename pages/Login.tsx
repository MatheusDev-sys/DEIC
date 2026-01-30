import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LoadingHatch } from '../components/LoadingHatch';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Email ou senha inválidos.');
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 animate-fade-in relative">
      <Link to="/" className="absolute top-8 left-6 text-slate-400 hover:text-sky-400 transition flex items-center gap-2">
        <ArrowLeft size={20} />
        <span className="font-medium">Voltar</span>
      </Link>

      <div className="max-w-md w-full bg-slate-900/50 p-8 rounded-xl border border-slate-800 shadow-2xl mt-12 md:mt-0">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Acesso Restrito</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-slate-400 mb-2 text-sm">Email</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-white w-full focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <div>
            <label className="block text-slate-400 mb-2 text-sm">Senha</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-white w-full focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>

          {error && <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">{error}</div>}

          <button disabled={loading} type="submit" className="w-full bg-sky-500 text-white font-bold py-3 rounded-lg hover:bg-sky-600 transition shadow-lg shadow-sky-500/20 disabled:opacity-50 flex justify-center items-center">
            {loading ? <LoadingHatch size="20" color="#ffffff" /> : 'Entrar'}
          </button>
        </form>
        <p className="text-center text-slate-400 text-sm mt-6">
          Não tem uma conta? <Link to="/register" className="text-sky-400 hover:underline">Registre-se aqui</Link>.
        </p>
      </div>
    </div>
  );
};