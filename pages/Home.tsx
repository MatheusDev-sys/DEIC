import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { IMAGES } from '../constants';
import { supabase } from '../services/supabase';
import { ArrowRight, BookOpen, FileText, Lock } from 'lucide-react';

interface LayoutContext {
  openPenalCode: () => void;
}

export const Home: React.FC = () => {
  const { openPenalCode } = useOutletContext<LayoutContext>();

  const [reportForm, setReportForm] = useState({
    crime: '',
    location: '',
    details: ''
  });
  const [reportStatus, setReportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Intersection Observer for scroll animations
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: [0, 0.1, 0.3, 0.5, 0.7, 1] // Múltiplos thresholds para detecção mais precisa
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;

      entries.forEach(entry => {
        // Só processa se o elemento cruzou um threshold significativo
        if (entry.intersectionRatio > 0.1) {
          // Elemento está visível (entrando ou já dentro do viewport)
          entry.target.classList.remove('animate-up');
          entry.target.classList.add('animate-down');
        } else if (entry.intersectionRatio === 0) {
          // Elemento completamente fora do viewport
          if (!scrollingDown) {
            // Scrollando para cima - aplica animação de saída
            entry.target.classList.remove('animate-down');
            entry.target.classList.add('animate-up');
          } else {
            // Scrollando para baixo - remove animações
            entry.target.classList.remove('animate-down', 'animate-up');
          }
        }
      });

      lastScrollY = currentScrollY;
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const animatedElements = document.querySelectorAll('.scroll-animate');

    animatedElements.forEach(el => observer.observe(el));

    return () => {
      animatedElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportStatus('idle');
    const { error } = await supabase.from('denuncias').insert([{
      tipo_crime: reportForm.crime,
      localizacao: reportForm.location,
      detalhes: reportForm.details
    }]);

    if (error) {
      setReportStatus('error');
    } else {
      setReportStatus('success');
      setReportForm({ crime: '', location: '', details: '' });
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url('${IMAGES.HERO_BG}')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-950/90 to-slate-950"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            Departamento Estadual de<br />Investigações Criminais
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto drop-shadow-md">
            Combatendo o crime organizado com inteligência e rigor para garantir a segurança da nossa cidade.
          </p>
          <a href="#report" onClick={(e) => {
            e.preventDefault();
            document.getElementById('report')?.scrollIntoView({ behavior: 'smooth' });
          }} className="bg-sky-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-sky-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-sky-500/20 text-lg inline-block">
            Fazer uma Denúncia Anônima
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl font-black text-white mb-6">Nossa Missão</h2>
              <h3 className="text-2xl font-bold text-sky-400 mb-4">Inteligência. Precisão. Ação.</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                O DEIC é a subdivisão de elite da Polícia Civil, focada em desarticular organizações criminosas complexas.
                Atuamos com base em inteligência, investigação aprofundada e operações estratégicas.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 hover:border-sky-400 transition transform hover:-translate-y-2 hover:bg-slate-900 shadow-lg hover:shadow-sky-500/20 duration-300 cursor-default">
                  <h4 className="font-bold text-sky-400">Integridade</h4>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 hover:border-sky-400 transition transform hover:-translate-y-2 hover:bg-slate-900 shadow-lg hover:shadow-sky-500/20 duration-300 cursor-default">
                  <h4 className="font-bold text-sky-400">Justiça</h4>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 hover:border-sky-400 transition transform hover:-translate-y-2 hover:bg-slate-900 shadow-lg hover:shadow-sky-500/20 duration-300 cursor-default">
                  <h4 className="font-bold text-sky-400">Coragem</h4>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <img src={IMAGES.MEETING_ROOM} alt="Equipe DEIC" className="rounded-lg shadow-2xl shadow-sky-900/20 border border-slate-800" />
            </div>
          </div>
        </div>
      </section>

      {/* Divisions Section */}
      <section id="divisions" className="py-24 bg-slate-900/30">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-12 text-white">Nossas Divisões</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Anti-Sequestro (DAS)", desc: "Resgate e negociação em situações críticas." },
              { title: "Roubo a Bancos", desc: "Repressão a assaltos a instituições financeiras." },
              { title: "Crimes Cibernéticos", desc: "Combate a fraudes e invasões digitais." },
              { title: "Narcóticos", desc: "Desmantelamento de redes de tráfico." }
            ].map((div, idx) => (
              <div key={idx} className="scroll-animate bg-slate-900/80 p-6 rounded-xl border border-slate-800 hover:border-sky-500 transition duration-300 hover:-translate-y-2 group hover:shadow-lg hover:shadow-sky-500/10">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition">{div.title}</h3>
                <p className="text-slate-400 text-sm">{div.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Study Materials Section */}
      <section id="study-materials" className="py-24 bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Material de Estudos</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Conhecimento é a nossa principal arma. Acesse aqui os materiais de treinamento e diretrizes operacionais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Material de Estudos (Antigo Manual de Abordagem) */}
            <div className="scroll-animate bg-slate-900/80 p-8 rounded-xl border border-slate-800 hover:border-sky-500 transition duration-300 hover:-translate-y-2 group hover:shadow-lg hover:shadow-sky-500/10 flex flex-col">
              <div className="mb-4 bg-slate-800/50 w-12 h-12 flex items-center justify-center rounded-lg text-sky-400 group-hover:text-white transition">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Material de Estudos</h3>
              <p className="text-slate-400 text-sm mb-6 flex-grow">
                Procedimentos padrão para abordagens táticas e de rotina. Leitura obrigatória.
              </p>

              {/* LINK PARA O MATERIAL DE ESTUDOS */}
              <a
                href="https://matheusdev-sys.github.io/Regras-Policia/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-sky-400 font-bold hover:text-sky-300 transition text-sm uppercase tracking-wide"
              >
                Acessar Material <ArrowRight size={16} className="ml-2" />
              </a>
            </div>

            {/* Card 2: Códigos Penais */}
            <div className="scroll-animate bg-slate-900/80 p-8 rounded-xl border border-slate-800 hover:border-sky-500 transition duration-300 hover:-translate-y-2 group hover:shadow-lg hover:shadow-sky-500/10 flex flex-col">
              <div className="mb-4 bg-slate-800/50 w-12 h-12 flex items-center justify-center rounded-lg text-sky-400 group-hover:text-white transition">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Códigos Penais</h3>
              <p className="text-slate-400 text-sm mb-6 flex-grow">
                Acesse a base de dados completa e atualizada dos códigos penais da cidade.
              </p>
              <button
                onClick={openPenalCode}
                className="inline-flex items-center text-sky-400 font-bold hover:text-sky-300 transition text-sm uppercase tracking-wide text-left"
              >
                Consultar Artigos <ArrowRight size={16} className="ml-2" />
              </button>
            </div>

            {/* Card 3: Relatórios de Inteligência */}
            <div className="scroll-animate bg-slate-900/80 p-8 rounded-xl border border-slate-800 hover:border-sky-500 transition duration-300 hover:-translate-y-2 group hover:shadow-lg hover:shadow-sky-500/10 flex flex-col">
              <div className="mb-4 bg-slate-800/50 w-12 h-12 flex items-center justify-center rounded-lg text-sky-400 group-hover:text-white transition">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Relatórios de Inteligência</h3>
              <p className="text-slate-400 text-sm mb-6 flex-grow">
                Análises e briefings sobre as atividades criminosas recentes. (Requer Acesso Nível 2)
              </p>
              <Link
                to="/intel-report"
                className="inline-flex items-center text-sky-400 font-bold hover:text-sky-300 transition text-sm uppercase tracking-wide"
              >
                Ver Relatórios <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Report Form Section */}
      <section id="report" className="py-24 bg-slate-900/30">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-slate-800 shadow-2xl transition duration-500 hover:shadow-[0_0_20px_rgba(14,165,233,0.15)] hover:border-sky-500/50">
            <h2 className="text-3xl font-black text-center mb-2 text-white">Canal de Denúncia</h2>
            <p className="text-center text-slate-400 mb-8 text-sm">
              Sua informação é crucial. <strong className="text-yellow-400">Este formulário é para fins de Roleplay.</strong>
            </p>

            <form onSubmit={handleReportSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  required
                  type="text"
                  placeholder="Tipo de Crime"
                  className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-white w-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  value={reportForm.crime}
                  onChange={e => setReportForm({ ...reportForm, crime: e.target.value })}
                />
                <input
                  required
                  type="text"
                  placeholder="Localização"
                  className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-white w-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  value={reportForm.location}
                  onChange={e => setReportForm({ ...reportForm, location: e.target.value })}
                />
              </div>
              <textarea
                required
                placeholder="Descreva a situação com detalhes..."
                rows={4}
                className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-white w-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                value={reportForm.details}
                onChange={e => setReportForm({ ...reportForm, details: e.target.value })}
              ></textarea>
              <button type="submit" className="w-full bg-sky-500 text-white font-bold py-3 rounded-lg hover:bg-sky-600 transition shadow-lg shadow-sky-500/20 transform hover:-translate-y-1">
                Enviar Denúncia Sigilosa
              </button>
            </form>

            {reportStatus === 'success' && (
              <div className="mt-6 text-center bg-green-900/30 border border-green-800 text-green-400 px-4 py-3 rounded-lg animate-fade-in">
                <p className="font-bold">Denúncia enviada com sucesso!</p>
              </div>
            )}
            {reportStatus === 'error' && (
              <div className="mt-6 text-center bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg animate-fade-in">
                <p className="font-bold">Erro ao enviar. Tente novamente.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section id="careers" className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Faça Parte da Elite</h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Procuramos por indivíduos dedicados e corajosos para se juntarem às fileiras do DEIC.
          </p>
          <Link to="/exam" className="inline-block bg-slate-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-slate-700 transition border border-slate-600 hover:border-sky-500 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-500/20">
            Iniciar Prova de Admissão
          </Link>
        </div>
      </section>
    </div>
  );
};