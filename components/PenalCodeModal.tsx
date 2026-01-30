import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ARTICLES = [
  { id: '01', title: 'Abuso de Autoridade' },
  { id: '02', title: 'Corrupção Passiva e/ou Ativa' },
  { id: '03', title: 'Desacato' },
  { id: '04', title: 'Impedir Exercício Profissional' },
  { id: '05', title: 'Prevaricação' },
  { id: '06', title: 'Prisão Disciplinar' },
  { id: '07', title: 'Tráfico de Influência' },
  { id: '08', title: 'Uso irregular de Função Pública' },
  { id: '09', title: 'Tentativa de Homicídio' },
  { id: '10', title: 'Homicídio Culposo' },
  { id: '11', title: 'Homicídio Doloso' },
  { id: '12', title: 'Homicídio Qualificado' },
  { id: '13', title: 'Latrocínio' },
  { id: '14', title: 'Assédio Moral' },
  { id: '15', title: 'Calúnia' },
  { id: '16', title: 'Difamação' },
  { id: '17', title: 'Injúria' },
  { id: '18', title: 'Importunação Sexual' },
  { id: '19', title: 'Perjúrio' },
  { id: '20', title: 'Abandono de Incapaz' },
  { id: '21', title: 'Adultério' },
  { id: '22', title: 'Bigamia' },
  { id: '23', title: 'Crime Sexual Intrafamiliar' },
  { id: '24', title: 'Ameaça' },
  { id: '25', title: 'Extorsão' },
  { id: '26', title: 'Lesão Corporal' },
  { id: '27', title: 'Sequestro' },
  { id: '28', title: 'Tortura' },
  { id: '29', title: 'Vandalismo' },
  { id: '30', title: 'Dano de Propriedade do Governo' },
  { id: '31', title: 'Estelionato' },
  { id: '32', title: 'Invasão de Propriedade' },
  { id: '33', title: 'Furto' },
  { id: '34', title: 'Roubo' },
  { id: '35', title: 'Posse de Produtos Ilegais' },
  { id: '36', title: 'Tráfico de Produtos Ilegais' },
  { id: '37', title: 'Posse de Peças de Armas' },
  { id: '38', title: 'Posse de Cápsula' },
  { id: '39', title: 'Porte de Arma Leve' },
  { id: '40', title: 'Tráfico de Armas Leve' },
  { id: '41', title: 'Porte de Arma Pesada' },
  { id: '42', title: 'Tráfico de Armas Pesada' },
  { id: '43', title: 'Porte de Arma Branca' },
  { id: '44', title: 'Porte de Munição (-100)' },
  { id: '45', title: 'Tráfico de Munição (+100)' },
  { id: '46', title: 'Posse de Componentes Narcóticos' },
  { id: '47', title: 'Posse de Drogas (-100)' },
  { id: '48', title: 'Tráfico de Drogas (+100)' },
  { id: '49', title: 'Dinheiro Sujo Leve' },
  { id: '50', title: 'Dinheiro Sujo Médio' },
  { id: '51', title: 'Dinheiro Sujo Grave' },
  { id: '52', title: 'Apologia ao Crime' },
  { id: '53', title: 'Falsidade Ideológica' },
  { id: '54', title: 'Formação de Quadrilha' },
  { id: '55', title: 'Desobediência' },
  { id: '56', title: 'Exercício Ilegal de Profissão' },
  { id: '57', title: 'Falsa Comunicação de Crime' },
  { id: '58', title: 'Obstrução de Justiça' },
  { id: '59', title: 'Ocultação de Provas' },
  { id: '60', title: 'Omissão de Socorro' },
  { id: '61', title: 'Perturbação da Ordem' },
  { id: '62', title: 'QRR Ilegal' },
  { id: '63', title: 'Tentativa de Fuga' },
  { id: '64', title: 'Tentativa de Suborno' },
  { id: '65', title: 'Alta Velocidade' },
  { id: '66', title: 'Condução Imprudente' },
  { id: '67', title: 'Corridas Ilegais' },
  { id: '68', title: 'Dirigir na Contramão' },
  { id: '69', title: 'Poluição Sonora' },
  { id: '70', title: 'Veículo Muito Danificado' },
  { id: '71', title: 'Veículo Ilegalmente Estacionado' },
  { id: '72', title: 'Uso Excessivo de Insulfilm' },
  { id: '73', title: 'Ocultação Facial' },
  { id: '74', title: 'Uso de Coldre' },
  { id: '75', title: 'Uso de Colete (Roupa)' },
  { id: '76', title: 'Porte de Colete Balístico (equipamento)' },
  { id: '77', title: 'Tráfico de Colete Balístico (equipamento)' },
];

export const PenalCodeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Filtrar artigos baseado no termo de busca
  const filteredArticles = ARTICLES.filter(art => {
    const search = searchTerm.toLowerCase();
    return art.id.includes(search) ||
      art.title.toLowerCase().includes(search) ||
      `art. ${art.id}`.includes(search) ||
      `artigo ${art.id}`.includes(search);
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-slate-900/90 border border-slate-700 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">Código Penal - Brasil Roleplay</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X size={32} />
          </button>
        </div>

        {/* Campo de Busca */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por número ou nome do artigo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition"
            />
          </div>
        </div>

        <div className="overflow-y-auto pr-4 custom-scrollbar">
          <p className="text-sm text-slate-500 mb-4 italic">Lista resumida. Consulte o Discord oficial para a lista completa.</p>
          <dl className="space-y-4">
            {filteredArticles.map((art) => (
              <div key={art.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 p-2 hover:bg-slate-800/50 rounded transition">
                <dt className="md:col-span-2 font-bold text-sky-400">Art. {art.id}:</dt>
                <dd className="md:col-span-10 text-slate-300">{art.title}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};