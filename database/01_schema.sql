create table if not exists utilizadores (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  email text not null unique,
  telefone text,
  perfil text not null check (perfil in ('cliente', 'prestador', 'admin')),
  avatar_url text,
  activo boolean default true,
  criado_em timestamptz default now(),
  actualizado_em timestamptz default now()
);

create table if not exists clientes (
  id uuid primary key references utilizadores(id) on delete cascade,
  cidade text,
  biografia text,
  notif_email boolean default true,
  criado_em timestamptz default now()
);

create table if not exists prestadores (
  id uuid primary key references utilizadores(id) on delete cascade,
  biografia text,
  especialidade text,
  anos_experiencia text,
  cidade text,
  preco_medio numeric(10,2),
  estado_verificacao text default 'pendente' check (estado_verificacao in ('pendente', 'aprovado', 'rejeitado', 'suspenso')),
  nota_risco text,
  avaliacao_media numeric(2,1) default 0,
  total_avaliacoes integer default 0,
  total_pedidos integer default 0,
  visualizacoes integer default 0,
  perfil_publico_activo boolean default true,
  receber_pedidos boolean default true,
  notif_email boolean default true,
  disponivel boolean default true,
  criado_em timestamptz default now(),
  actualizado_em timestamptz default now()
);

create table if not exists categorias (
  id serial primary key,
  nome text not null unique,
  icone_url text,
  activa boolean default true,
  criado_em timestamptz default now()
);

create table if not exists servicos (
  id uuid primary key default gen_random_uuid(),
  prestador_id uuid not null references prestadores(id) on delete cascade,
  categoria_id integer references categorias(id),
  titulo text not null,
  descricao text,
  preco numeric(10,2),
  unidade_preco text default 'hora' check (unidade_preco in ('hora', 'servico', 'dia')),
  estado text default 'activo' check (estado in ('activo', 'pausado', 'rascunho')),
  total_pedidos integer default 0,
  criado_em timestamptz default now(),
  actualizado_em timestamptz default now()
);

create table if not exists pedidos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id),
  servico_id uuid not null references servicos(id),
  prestador_id uuid not null references prestadores(id),
  nome_cliente text,
  telefone_cliente text,
  local_servico text,
  periodo text,
  urgencia text default 'Normal',
  descricao text,
  valor numeric(10,2),
  estado text default 'pendente' check (estado in ('pendente', 'confirmado', 'em_curso', 'concluido', 'cancelado')),
  criado_em timestamptz default now(),
  actualizado_em timestamptz default now()
);

create table if not exists mensagens (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references pedidos(id) on delete cascade,
  remetente_id uuid not null references utilizadores(id),
  conteudo text not null,
  enviado_em timestamptz default now()
);

create table if not exists avaliacoes (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null unique references pedidos(id),
  cliente_id uuid not null references clientes(id),
  prestador_id uuid not null references prestadores(id),
  pontuacao smallint not null check (pontuacao between 1 and 5),
  comentario text,
  criado_em timestamptz default now()
);

create table if not exists notificacoes (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references utilizadores(id) on delete cascade,
  pedido_id uuid references pedidos(id),
  tipo text not null,
  mensagem text not null,
  lida boolean default false,
  criado_em timestamptz default now()
);

create table if not exists campanhas (
  id uuid primary key default gen_random_uuid(),
  prestador_id uuid not null references prestadores(id),
  plano text not null,
  estado_pagamento text default 'pendente' check (estado_pagamento in ('pendente', 'confirmado', 'recusado')),
  estado_campanha text default 'inactiva' check (estado_campanha in ('inactiva', 'activa', 'expirada')),
  data_inicio date,
  data_fim date,
  valor_pago numeric(10,2),
  criado_em timestamptz default now()
);

create table if not exists configuracoes (
  chave text primary key,
  valor boolean default true,
  descricao text,
  actualizado_em timestamptz default now()
);

create table if not exists auditoria (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references utilizadores(id),
  accao text not null,
  entidade_tipo text not null,
  entidade_id uuid,
  detalhes jsonb,
  criado_em timestamptz default now()
);

