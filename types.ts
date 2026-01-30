export interface UserProfile {
  id: string;
  username: string;
  role_id: number;
  roles?: {
    name: string;
  };
}

export interface Role {
  id: number;
  name: string;
}

export interface Denuncia {
  id: number;
  created_at: string;
  tipo_crime: string;
  localizacao: string;
  detalhes: string;
}

export interface Relatorio {
  id: number;
  created_at: string;
  titulo: string;
  descricao: string;
  imagem_urls: string[];
  user_id: string;
  profiles?: {
    username: string;
  };
}

export interface ProvaResult {
  id: number;
  created_at: string;
  qra_id: string;
  email: string;
  // Dynamic keys for questions
  [key: string]: any; 
}

export interface Token {
  id: number;
  token: string;
  usado: boolean;
}