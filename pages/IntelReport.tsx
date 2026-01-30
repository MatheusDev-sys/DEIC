import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const IntelReport: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    if (files.length === 0) {
      setStatus('error');
      setMsg('É necessário anexar ao menos uma imagem.');
      return;
    }

    setStatus('uploading');
    setMsg('Enviando imagens...');

    try {
      const uploadPromises = files.map(file => 
        supabase.storage.from('relatorios').upload(`${session.user.id}/${Date.now()}_${file.name}`, file)
      );

      const results = await Promise.all(uploadPromises);
      const errors = results.filter(r => r.error);
      
      if (errors.length > 0) throw new Error('Falha no upload de imagens.');

      const imageUrls = results.map(r => 
        supabase.storage.from('relatorios').getPublicUrl(r.data!.path).data.publicUrl
      );

      const { error: insertError } = await supabase.from('relatorios').insert({
        titulo: title,
        descricao: desc,
        imagem_urls: imageUrls,
        user_id: session.user.id
      });

      if (insertError) throw insertError;

      setStatus('success');
      setMsg('Relatório arquivado com sucesso.');
      setTimeout(() => navigate('/admin'), 2000);

    } catch (err: any) {
      setStatus('error');
      setMsg(err.message || 'Erro desconhecido');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 animate-fade-in">
      <div className="max-w-2xl w-full bg-slate-900/60 border border-slate-700 rounded-xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Novo Relatório de Inteligência</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-400 mb-2 text-sm uppercase tracking-wider font-bold">Título da Operação</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-white w-full focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>

          <div>
            <label className="block text-slate-400 mb-2 text-sm uppercase tracking-wider font-bold">Descrição Detalhada</label>
            <textarea required rows={6} value={desc} onChange={e => setDesc(e.target.value)} className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-white w-full focus:outline-none focus:ring-2 focus:ring-sky-500"></textarea>
          </div>

          <div>
             <label className="block text-slate-400 mb-2 text-sm uppercase tracking-wider font-bold">Evidências (Imagens)</label>
             <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:bg-slate-800/30 transition relative group">
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <UploadCloud className="mx-auto h-12 w-12 text-slate-500 group-hover:text-sky-400 transition" />
                <p className="mt-2 text-slate-400 text-sm">{files.length > 0 ? `${files.length} arquivo(s) selecionado(s)` : "Arraste imagens ou clique para selecionar"}</p>
             </div>
          </div>

          {status === 'uploading' && <p className="text-yellow-400 text-center animate-pulse">{msg}</p>}
          {status === 'error' && <p className="text-red-400 text-center font-bold">{msg}</p>}
          {status === 'success' && <p className="text-green-400 text-center font-bold">{msg}</p>}

          <button disabled={status === 'uploading'} type="submit" className="w-full bg-sky-600 text-white font-bold py-3 rounded-lg hover:bg-sky-500 transition shadow-lg shadow-sky-600/20">
            Arquivar Relatório
          </button>
        </form>
      </div>
    </div>
  );
};