insert into categorias (nome, icone_url)
values
  ('Canalizador', '/img/servicos/categorias/canalizacao.svg'),
  ('Electricista', '/img/servicos/categorias/Eletrecista.svg'),
  ('Limpeza', '/img/servicos/categorias/Limpeza.svg'),
  ('Design Grafico', '/img/servicos/categorias/design-grafico-icone.svg'),
  ('Jardinagem', '/img/servicos/categorias/Jardineiro.svg'),
  ('Manutencao', '/img/servicos/categorias/Manutencao.svg'),
  ('Construcao', '/img/servicos/categorias/Manutencao.svg'),
  ('TI e Tecnologia', '/img/servicos/categorias/web-design-iconi.svg')
on conflict (nome) do nothing;

insert into configuracoes (chave, valor, descricao)
values
  ('exigir_documento_prestador', true, 'Exigir documento oficial para novos prestadores'),
  ('revisao_manual_risco_medio', true, 'Activar revisao manual para risco medio/alto'),
  ('notificar_sem_resposta_60min', true, 'Notificar cliente quando prestador nao responde em 60 min'),
  ('permitir_campanhas_patrocinadas', true, 'Permitir campanhas patrocinadas na pagina explorar'),
  ('auditoria_automatica_denuncias', false, 'Activar auditoria automatica de contas com denuncias repetidas')
on conflict (chave) do nothing;

