import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IMAGES } from '../constants';
import { Menu, X, LogOut, Shield } from 'lucide-react';
import { PenalCodeModal } from './PenalCodeModal';

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPenalModalOpen, setIsPenalModalOpen] = useState(false);
  const { userRole, signOut, session } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isAdmin = ['Developer', 'Admin'].includes(userRole || '');
  const isOficial = ['Developer', 'Admin', 'Oficial'].includes(userRole || '');

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {!isAuthPage && (
        <header className="bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-800">
          <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <img src={IMAGES.LOGO_DEIC} alt="Logo DEIC" className="h-14 w-auto group-hover:scale-105 transition duration-300" />
              <span className="text-xl font-black bg-gradient-to-r from-orange-500 via-indigo-500 to-green-500 text-transparent bg-clip-text animate-gradient-text hidden sm:block">
                DEIC
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('about')} className="text-slate-300 hover:text-sky-400 transition font-medium">Sobre</button>
              
              {!session && (
                <>
                  <button onClick={() => scrollToSection('divisions')} className="text-slate-300 hover:text-sky-400 transition font-medium">Divisões</button>
                  <button onClick={() => scrollToSection('study-materials')} className="text-slate-300 hover:text-sky-400 transition font-medium">Material de Estudos</button>
                  <button onClick={() => scrollToSection('report')} className="text-slate-300 hover:text-sky-400 transition font-medium">Denuncie</button>
                  <button onClick={() => scrollToSection('careers')} className="text-slate-300 hover:text-sky-400 transition font-medium">Carreiras</button>
                </>
              )}

              {session && isOficial && (
                <>
                  <Link to="/intel-report" className="text-slate-300 hover:text-sky-400 transition font-medium">Relatório</Link>
                  <Link to="/admin" className="text-slate-300 hover:text-sky-400 transition font-medium">Denúncias</Link>
                </>
              )}
              
              {session && isAdmin && (
                <Link to="/admin" className="text-sky-400 font-bold hover:text-sky-300 transition flex items-center gap-1">
                  <Shield size={16} /> Painel Admin
                </Link>
              )}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {session ? (
                <button onClick={handleLogout} className="bg-red-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700 transition flex items-center gap-2 hover:shadow-lg hover:shadow-red-600/20">
                  <LogOut size={18} /> Sair
                </button>
              ) : (
                <>
                  <Link to="/login" className="text-slate-300 hover:text-sky-400 transition font-medium">Login</Link>
                  <Link to="/register" className="bg-sky-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-sky-700 transition hover:shadow-lg hover:shadow-sky-600/20">Registro</Link>
                </>
              )}
            </div>

            {/* Mobile Button */}
            <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden px-6 pt-2 pb-4 space-y-2 bg-slate-900 border-b border-slate-800">
              <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2 text-slate-300 hover:text-sky-400">Sobre</button>
              
              {!session && (
                <>
                  <button onClick={() => scrollToSection('divisions')} className="block w-full text-left py-2 text-slate-300 hover:text-sky-400">Divisões</button>
                  <button onClick={() => scrollToSection('study-materials')} className="block w-full text-left py-2 text-slate-300 hover:text-sky-400">Material de Estudos</button>
                  <button onClick={() => scrollToSection('report')} className="block w-full text-left py-2 text-slate-300 hover:text-sky-400">Denuncie</button>
                  <button onClick={() => scrollToSection('careers')} className="block w-full text-left py-2 text-slate-300 hover:text-sky-400">Carreiras</button>
                </>
              )}

              {session && isOficial && (
                <>
                   <Link to="/intel-report" className="block py-2 text-slate-300 hover:text-sky-400" onClick={() => setIsMobileMenuOpen(false)}>Relatório</Link>
                   <Link to="/admin" className="block py-2 text-slate-300 hover:text-sky-400" onClick={() => setIsMobileMenuOpen(false)}>Denúncias</Link>
                </>
              )}

              {session && isAdmin && (
                <Link to="/admin" className="block py-2 text-sky-400 font-bold" onClick={() => setIsMobileMenuOpen(false)}>Painel Admin</Link>
              )}

              {session ? (
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 text-red-400">Sair</button>
              ) : (
                <>
                  <Link to="/login" className="block py-2 text-slate-300" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="block py-2 text-sky-400" onClick={() => setIsMobileMenuOpen(false)}>Registro</Link>
                </>
              )}
            </div>
          )}
        </header>
      )}

      <main className="flex-grow">
        {/* Pass the modal opener to child routes (like Home) */}
        <Outlet context={{ openPenalCode: () => setIsPenalModalOpen(true) }} />
      </main>

      {!isAuthPage && (
        <footer className="bg-slate-950 border-t border-slate-800 py-8 mt-auto">
          <div className="container mx-auto px-6 text-center text-slate-500">
            <img src={IMAGES.LOGO_BRASIL} alt="Brasil Roleplay" className="h-16 w-auto mx-auto mb-4 opacity-70" />
            <p>&copy; 2025 DEIC - Polícia Civil. Todos os direitos reservados no universo Brasil Roleplay.</p>
            <p className="text-xs mt-2">Este site é uma obra de ficção e não possui ligação com instituições reais.</p>
            <p className="text-xs mt-2 text-slate-600">Desenvolvido por Matheus Dev</p>
          </div>
        </footer>
      )}

      <PenalCodeModal isOpen={isPenalModalOpen} onClose={() => setIsPenalModalOpen(false)} />
    </div>
  );
};