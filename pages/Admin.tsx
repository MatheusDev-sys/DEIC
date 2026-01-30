import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Denuncia, Relatorio, ProvaResult, UserProfile, Role, Token } from '../types';
import { EXAM_GABARITO } from '../constants';
import { useAuth } from '../context/AuthContext';
import { ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { LoadingHatch } from '../components/LoadingHatch';

type Tab = 'reports' | 'denuncias' | 'exams' | 'users' | 'tokens';

export const Admin: React.FC = () => {
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('reports');
  const [loading, setLoading] = useState(false);

  // Data State
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [exams, setExams] = useState<ProvaResult[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  // UI State
  const [expandedExam, setExpandedExam] = useState<number | null>(null);
  const [expandedReport, setExpandedReport] = useState<number | null>(null);
  const [generatedToken, setGeneratedToken] = useState<string>('');

  const isHighCommand = ['Developer', 'Admin'].includes(userRole || '');

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab: Tab) => {
    setLoading(true);
    if (tab === 'denuncias') {
      const { data } = await supabase.from('denuncias').select('*').order('created_at', { ascending: false });
      if (data) setDenuncias(data);
    } else if (tab === 'reports') {
      const { data } = await supabase.from('relatorios').select(`*, profiles(username)`).order('created_at', { ascending: false });
      if (data) setRelatorios(data as any); // Cast for join
    } else if (tab === 'exams' && isHighCommand) {
      const { data } = await supabase.from('prova_resultados').select('*').order('created_at', { ascending: false });
      if (data) setExams(data);
    } else if (tab === 'users' && isHighCommand) {
      const { data: roleData } = await supabase.from('roles').select('*');
      if (roleData) setRoles(roleData);

      const { data: userData, error } = await supabase.rpc('get_confirmed_users');
      // If RPC fails (db not setup), fallback gracefully or show error
      if (!error && userData) setUsers(userData);
      else console.error(error);
    }
    setLoading(false);
  };

  const handleUpdateRole = async (userId: string, newRoleId: number) => {
    await supabase.from('profiles').update({ role_id: newRoleId }).eq('id', userId);
    fetchData('users'); // Refresh
  };

  const generateToken = async () => {
    const newToken = `DEIC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const { error } = await supabase.from('tokens').insert([{ token: newToken, usado: false }]);
    if (!error) setGeneratedToken(newToken);
  };

  const calculateScore = (exam: ProvaResult) => {
    let score = 0;
    for (let i = 1; i <= 10; i++) {
      if (exam[`question_${i}`] === EXAM_GABARITO[`question_${i}`]) score++;
    }
    return score;
  };

  return (
    <div className="container mx-auto px-6 py-12 animate-fade-in">
      <h1 className="text-4xl font-black text-white mb-8">Painel Administrativo</h1>

      <div className="md:grid md:grid-cols-12 md:gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-3 lg:col-span-2 mb-8 md:mb-0">
          <nav className="flex flex-col space-y-1">
            <button onClick={() => setActiveTab('reports')} className={`text-left px-4 py-3 rounded-lg transition ${activeTab === 'reports' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>Relatórios de Inteligência</button>
            <button onClick={() => setActiveTab('denuncias')} className={`text-left px-4 py-3 rounded-lg transition ${activeTab === 'denuncias' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>Denúncias</button>
            {isHighCommand && (
              <>
                <button onClick={() => setActiveTab('exams')} className={`text-left px-4 py-3 rounded-lg transition ${activeTab === 'exams' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>Resultados da Prova</button>
                <button onClick={() => setActiveTab('users')} className={`text-left px-4 py-3 rounded-lg transition ${activeTab === 'users' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>Gerenciar Usuários</button>
                <button onClick={() => setActiveTab('tokens')} className={`text-left px-4 py-3 rounded-lg transition ${activeTab === 'tokens' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>Gerar Acesso</button>
              </>
            )}
          </nav>
        </aside>

        {/* Content */}
        <div className="md:col-span-9 lg:col-span-10">
          {loading ? (
            <div className="flex items-center gap-4 py-12 justify-center">
              <LoadingHatch size="32" />
              <span className="text-slate-400">Carregando dados...</span>
            </div>
          ) : (
            <div className="space-y-4">

              {/* Reports Tab */}
              {activeTab === 'reports' && relatorios.length === 0 && <p className="text-slate-500">Nenhum relatório encontrado.</p>}
              {activeTab === 'reports' && relatorios.map(repo => (
                <div key={repo.id} className="bg-slate-900/50 border border-slate-800 p-6 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-white text-lg">{repo.titulo}</h3>
                      <p className="text-xs text-sky-400 font-mono">Agente: {repo.profiles?.username || 'Desconhecido'}</p>
                    </div>
                    <span className="text-xs text-slate-500">{new Date(repo.created_at).toLocaleString('pt-BR')}</span>
                  </div>
                  <p className="text-slate-300 text-sm whitespace-pre-wrap">{repo.descricao}</p>

                  {repo.imagem_urls && repo.imagem_urls.length > 0 && (
                    <div className="mt-4">
                      <button onClick={() => setExpandedReport(expandedReport === repo.id ? null : repo.id)} className="text-sky-400 text-sm flex items-center gap-1 hover:underline">
                        {expandedReport === repo.id ? 'Ocultar Imagens' : 'Ver Imagens'} {expandedReport === repo.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                      {expandedReport === repo.id && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {repo.imagem_urls.map((url, i) => (
                            <a key={i} href={url} target="_blank" rel="noreferrer">
                              <img src={url} alt="Evidência" className="rounded border border-slate-700 hover:opacity-80 transition h-24 w-full object-cover" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Denuncias Tab */}
              {activeTab === 'denuncias' && denuncias.length === 0 && <p className="text-slate-500">Nenhuma denúncia.</p>}
              {activeTab === 'denuncias' && denuncias.map(den => (
                <div key={den.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-white">{den.tipo_crime}</h3>
                    <span className="text-xs text-slate-500">{new Date(den.created_at).toLocaleString('pt-BR')}</span>
                  </div>
                  <p className="text-xs text-sky-400 font-mono mb-2">{den.localizacao}</p>
                  <div className="bg-slate-950 p-3 rounded text-slate-300 text-sm">{den.detalhes}</div>
                </div>
              ))}

              {/* Exams Tab */}
              {activeTab === 'exams' && exams.length === 0 && <p className="text-slate-500">Nenhuma prova realizada.</p>}
              {activeTab === 'exams' && exams.map(exam => {
                const score = calculateScore(exam);
                const isExpanded = expandedExam === exam.id;

                return (
                  <div key={exam.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-bold text-white text-lg">{exam.qra_id}</h3>
                        <p className="text-xs text-slate-400">{exam.email}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 block">Nota</span>
                        <span className={`text-2xl font-bold ${score >= 7 ? 'text-green-400' : 'text-red-400'}`}>{score}/10</span>
                      </div>
                    </div>

                    <button onClick={() => setExpandedExam(isExpanded ? null : exam.id)} className="text-sky-400 text-sm flex items-center gap-1 hover:underline">
                      {isExpanded ? 'Esconder Gabarito' : 'Ver Detalhes'} {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 space-y-2 border-t border-slate-800 pt-3">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => {
                          const key = `question_${num}`;
                          const userAns = exam[key];
                          const correctAns = EXAM_GABARITO[key];
                          const isCorrect = userAns === correctAns;
                          return (
                            <div key={num} className={`p-2 rounded text-sm flex justify-between ${isCorrect ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
                              <span className="text-slate-300">Questão {num}</span>
                              <span className="font-mono text-white">
                                {userAns} {isCorrect ? '✅' : `❌ (Gabarito: ${correctAns})`}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Users Tab */}
              {activeTab === 'users' && users.map(user => (
                <div key={user.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg flex justify-between items-center">
                  <span className="text-slate-300 font-medium">{user.username}</span>
                  <select
                    value={user.role_id}
                    onChange={(e) => handleUpdateRole(user.id, parseInt(e.target.value))}
                    disabled={userRole !== 'Developer' && user.role_id === 1} // Protect Developer role
                    className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id} disabled={r.id === 1 && userRole !== 'Developer'}>{r.name}</option>
                    ))}
                  </select>
                </div>
              ))}

              {/* Tokens Tab */}
              {activeTab === 'tokens' && (
                <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-lg max-w-md">
                  <h3 className="text-xl font-bold text-white mb-2">Gerar Token de Registro</h3>
                  <p className="text-slate-400 text-sm mb-6">Tokens são de uso único para novos oficiais.</p>
                  <button onClick={generateToken} className="bg-sky-600 text-white font-bold py-2 px-6 rounded hover:bg-sky-500 transition w-full mb-4">
                    Gerar Novo Token
                  </button>

                  {generatedToken && (
                    <div className="bg-slate-950 p-4 rounded border border-green-900/50">
                      <label className="text-xs text-slate-500 mb-1 block">Token Gerado:</label>
                      <div className="flex items-center gap-2">
                        <input readOnly value={generatedToken} className="bg-transparent text-green-400 font-mono text-lg w-full outline-none" />
                        <button onClick={() => navigator.clipboard.writeText(generatedToken)} className="text-slate-400 hover:text-white"><Copy size={18} /></button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};