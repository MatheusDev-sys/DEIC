import React, { useState } from 'react';
import { supabase } from '../services/supabase';

const QUESTIONS = [
  {
    id: 1,
    text: "De acordo com o Curso de Interrogatório, qual é o principal objetivo da Elicitação na investigação policial?",
    options: [
      { key: 'A', text: "Obter confissões diretas e imediatas através de métodos agressivos." },
      { key: 'B', text: "Obter informações de forma sutil, estratégica e controlada, muitas vezes sem que o alvo perceba." },
      { key: 'C', text: "Avaliar apenas a veracidade de documentos escritos e relatórios." },
      { key: 'D', text: "Aplicar a técnica da 'Porta na Cara' para induzir o alvo a uma confissão." }
    ]
  },
  {
    id: 2,
    text: "Qual técnica de persuasão consiste em fazer um pedido pequeno e de fácil aceite, seguido de um pedido maior?",
    options: [
      { key: 'A', text: "Efeito Benjamin Franklin" },
      { key: 'B', text: "Pressuposição" },
      { key: 'C', text: "Porta na Cara" },
      { key: 'D', text: "Pé na Porta" }
    ]
  },
  {
    id: 3,
    text: "No Curso de Negociação, qual é considerado o princípio de prioridade máxima em uma situação crítica?",
    options: [
      { key: 'A', text: "Conduzir o diálogo e definir o ritmo da conversa." },
      { key: 'B', text: "Garantir a prisão do criminoso e o cumprimento da lei." },
      { key: 'C', text: "Vida acima de tudo, sendo a prioridade máxima o refém." },
      { key: 'D', text: "Tempo é aliado, pois quanto mais tempo, maior a chance de erro do criminoso." }
    ]
  },
  {
    id: 4,
    text: "Qual das ações listadas é um erro a ser evitado pelo negociador oficial?",
    options: [
      { key: 'A', text: "Criar conexão psicológica ('Eu entendo sua situação')." },
      { key: 'B', text: "Fazer perguntas abertas para manter o criminoso falando." },
      { key: 'C', text: "Fazer promessas impossíveis (ex: helicóptero, milhões em dinheiro)." },
      { key: 'D', text: "Manter um tom calmo e controlado durante todo o diálogo." }
    ]
  },
  {
    id: 5,
    text: "Na Operação OLX, quando o objetivo é apenas o interrogatório, qual é o procedimento após a confirmação da posse?",
    options: [
      { key: 'A', text: "O agente disfarçado deve simular código 0 nas proximidades" },
      { key: 'B', text: "Realizar a leitura obrigatória da Lei de Miranda e, em seguida, conduzir à delegacia." },
      { key: 'C', text: "Não realizar a leitura da Lei de Miranda e liberar o indivíduo após o interrogatório padrão" },
      { key: 'D', text: "O agente disfarçado não deve ser liberado e deve ser revistado antes do criminoso." }
    ]
  },
  {
    id: 6,
    text: "Qual é a frase-chave que o agente disfarçado deve usar para sinalizar o início da abordagem?",
    options: [
      { key: 'A', text: "“Entendido, podem proceder com o código 0.”" },
      { key: 'B', text: "“Você parece alguém muito experiente, como você teria feito essa ação de forma limpa?”" },
      { key: 'C', text: "“Cala boca, Fulano (Inventar nome)” ou “Fica quieto aí na rádio”." },
      { key: 'D', text: "“Ah, então vocês passaram pela Rua 9, aquela sem câmeras, certo?”" }
    ]
  },
  {
    id: 7,
    text: "Qual é o principal objetivo de uma Operação de Infiltração em uma organização criminosa?",
    options: [
      { key: 'A', text: "Garantir a resolução pacífica e a preservação da vida." },
      { key: 'B', text: "Efetuar a prisão do criminoso imediatamente e realizar a leitura da Lei de Miranda." },
      { key: 'C', text: "Levantar e obter provas incriminatórias contra o alvo ou organização." },
      { key: 'D', text: "Simular uma abordagem comum, revistando o agente e o criminoso." }
    ]
  },
  {
    id: 8,
    text: "Antes de se infiltrar em uma organização criminosa, o agente deve obrigatoriamente realizar qual procedimento?",
    options: [
      { key: 'A', text: "Sair do painel policial e solicitar a liberação por meio de uma Ordem de Serviço." },
      { key: 'B', text: "Trocar refém por refém para ganhar a confiança do criminoso." },
      { key: 'C', text: "Informar o local combinado e simular código 0 nas proximidades." },
      { key: 'D', text: "Divulgar a identidade falsa para a equipe para evitar desconfiança." }
    ]
  },
  {
    id: 9,
    text: "Qual técnica busca criar empatia ao repetir sutilmente a linguagem corporal da outra pessoa?",
    options: [
      { key: 'A', text: "Escuta Ativa" },
      { key: 'B', text: "Efeito de Contraste" },
      { key: 'C', text: "Espelhamento (Rapport)" },
      { key: 'D', text: "Curiosidade fingida" }
    ]
  },
  {
    id: 10,
    text: "O que significa o princípio de que o policial deve 'conduzir o diálogo'?",
    options: [
      { key: 'A', text: "Elevar o tom de voz e fazer ameaças diretas para impor autoridade." },
      { key: 'B', text: "O policial deve definir o ritmo da conversa e utilizar técnicas para manter o alvo se expondo." },
      { key: 'C', text: "O policial deve falar o máximo possível para preencher o silêncio." },
      { key: 'D', text: "O policial deve sempre prometer o que o criminoso pedir para ganhar tempo." }
    ]
  }
];

export const Exam: React.FC = () => {
  const [formData, setFormData] = useState<any>({});
  const [qra, setQra] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleOptionChange = (questionId: number, value: string) => {
    setFormData((prev: any) => ({ ...prev, [`question_${questionId}`]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    // Validation
    const answeredCount = Object.keys(formData).length;
    if (answeredCount < 10 || !qra || !email) {
      setStatus('error');
      setErrorMsg('Por favor, preencha todos os campos e responda a todas as questões.');
      return;
    }

    const submission = {
      qra_id: qra,
      email: email,
      ...formData
    };

    const { error } = await supabase.from('prova_resultados').insert([submission]);

    if (error) {
      setStatus('error');
      setErrorMsg(`Erro ao enviar: ${error.message}`);
    } else {
      setStatus('success');
      setFormData({});
      setQra('');
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 bg-slate-950 animate-fade-in flex justify-center">
      <div className="max-w-3xl w-full">
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700 p-8 rounded-2xl shadow-xl">
          <h1 className="text-3xl font-black text-white text-center mb-2">PROVA PARA AGENTE DEIC</h1>
          <p className="text-slate-400 text-center mb-8">
            Mostre sua capacidade técnica. Boa sorte, recruta.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-800/30 rounded-lg">
              <div>
                <label className="block text-slate-400 mb-2 font-semibold">QRA / ID</label>
                <input required type="text" value={qra} onChange={(e) => setQra(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white w-full focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="block text-slate-400 mb-2 font-semibold">Email</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white w-full focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
            </div>

            {QUESTIONS.map((q) => (
              <div key={q.id} className="border-b border-slate-800 pb-6">
                <p className="font-semibold text-white mb-3">{q.id}. {q.text}</p>
                <div className="space-y-2">
                  {q.options.map((opt) => (
                    <label key={opt.key} className="flex items-center cursor-pointer group">
                      <input 
                        type="radio" 
                        name={`question_${q.id}`} 
                        value={opt.key}
                        checked={formData[`question_${q.id}`] === opt.key}
                        onChange={() => handleOptionChange(q.id, opt.key)}
                        className="form-radio h-4 w-4 text-sky-500 border-slate-600 bg-slate-800 focus:ring-sky-500"
                      />
                      <span className="ml-3 text-slate-300 group-hover:text-white transition">({opt.key}) {opt.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {status === 'error' && <p className="text-red-400 text-center font-bold bg-red-900/20 p-3 rounded">{errorMsg}</p>}
            {status === 'success' && <p className="text-green-400 text-center font-bold bg-green-900/20 p-3 rounded">Prova enviada com sucesso!</p>}

            <button 
              type="submit" 
              disabled={status === 'submitting' || status === 'success'}
              className="w-full bg-sky-500 text-white font-bold py-4 rounded-lg hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-sky-500/20 text-lg"
            >
              {status === 'submitting' ? 'Enviando...' : 'Finalizar Prova'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};