import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LoadingHatch } from '../components/LoadingHatch';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', username: '', password: '', token: '' });
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMsg('Validando token...');

    // 1. Verify Token
    const { data: tokenData, error: tokenError } = await supabase.from('tokens').select('*').eq('token', formData.token).single();

    if (tokenError || !tokenData || tokenData.usado) {
      setStatus('error');
      setMsg('Token inválido ou já utilizado.');
      return;
    }

    // 2. Sign Up
    const { error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          username: formData.username,
          registration_token: formData.token
        }
      }
    });

    if (signUpError) {
      setStatus('error');
      setMsg(signUpError.message);
    } else {
      setStatus('success');
      setMsg('Conta criada com sucesso! Verifique seu email para confirmação.');
      setFormData({ email: '', username: '', password: '', token: '' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 animate-fade-in relative">
      <Link to="/" className="absolute top-8 left-6 text-slate-400 hover:text-sky-400 transition flex items-center gap-2">
        <ArrowLeft size={20} />
        <span className="font-medium">Voltar</span>
      </Link>

      <div className="max-w-md w-full bg-slate-900/50 p-8 rounded-xl border border-slate-800 shadow-2xl mt-12 md:mt-0">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Criar Conta Oficial</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-white w-full focus:outline-none focus:ring-2 focus:ring-sky-500" />
          <input required type="text" placeholder="Nome de Usuário" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-white w-full focus:outline-none focus:ring-2 focus:ring-sky-500" />
          <input required type="password" placeholder="Senha" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-white w-full focus:outline-none focus:ring-2 focus:ring-sky-500" />
          <input required type="text" placeholder="Token de Acesso (Solicite ao superior)" value={formData.token} onChange={e => setFormData({ ...formData, token: e.target.value })} className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-white w-full focus:outline-none focus:ring-2 focus:ring-sky-500" />

          {msg && (
            <div className={`text-sm text-center p-2 rounded ${status === 'error' ? 'bg-red-900/20 text-red-400' : status === 'success' ? 'bg-green-900/20 text-green-400' : 'bg-yellow-900/20 text-yellow-400'}`}>
              {msg}
            </div>
          )}

          <button disabled={status === 'loading'} type="submit" className="w-full bg-sky-500 text-white font-bold py-3 rounded-lg hover:bg-sky-600 transition shadow-lg shadow-sky-500/20 disabled:opacity-50 flex justify-center items-center gap-2">
            {status === 'loading' ? (
              <>
                <LoadingHatch size="20" color="#ffffff" />
                <span>Processando...</span>
              </>
            ) : 'Registrar'}
          </button>
        </form>
        <p className="text-center text-slate-400 text-sm mt-6">
          Já tem uma conta? <Link to="/login" className="text-sky-400 hover:underline">Faça o login</Link>.
        </p>
      </div>
    </div>
  );
};