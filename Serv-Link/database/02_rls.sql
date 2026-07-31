alter table utilizadores enable row level security;
alter table clientes enable row level security;
alter table prestadores enable row level security;
alter table servicos enable row level security;
alter table pedidos enable row level security;
alter table mensagens enable row level security;
alter table avaliacoes enable row level security;
alter table notificacoes enable row level security;

drop policy if exists utilizadores_select_proprio on utilizadores;
create policy utilizadores_select_proprio on utilizadores
for select using (auth.uid() = id);

drop policy if exists utilizadores_update_proprio on utilizadores;
create policy utilizadores_update_proprio on utilizadores
for update using (auth.uid() = id);

drop policy if exists prestadores_select_todos on prestadores;
create policy prestadores_select_todos on prestadores
for select using (true);

drop policy if exists prestadores_update_proprio on prestadores;
create policy prestadores_update_proprio on prestadores
for update using (auth.uid() = id);

drop policy if exists servicos_select_activos_ou_dono on servicos;
create policy servicos_select_activos_ou_dono on servicos
for select using (estado = 'activo' or auth.uid() = prestador_id);

drop policy if exists servicos_insert_proprio on servicos;
create policy servicos_insert_proprio on servicos
for insert with check (auth.uid() = prestador_id);

drop policy if exists servicos_update_proprio on servicos;
create policy servicos_update_proprio on servicos
for update using (auth.uid() = prestador_id);

drop policy if exists pedidos_select_partes on pedidos;
create policy pedidos_select_partes on pedidos
for select using (auth.uid() = cliente_id or auth.uid() = prestador_id);

drop policy if exists pedidos_insert_cliente on pedidos;
create policy pedidos_insert_cliente on pedidos
for insert with check (auth.uid() = cliente_id);

drop policy if exists pedidos_update_partes on pedidos;
create policy pedidos_update_partes on pedidos
for update using (auth.uid() = cliente_id or auth.uid() = prestador_id);

drop policy if exists mensagens_select_partes on mensagens;
create policy mensagens_select_partes on mensagens
for select using (
  exists (
    select 1
    from pedidos
    where pedidos.id = mensagens.pedido_id
      and (pedidos.cliente_id = auth.uid() or pedidos.prestador_id = auth.uid())
  )
);

drop policy if exists mensagens_insert_partes on mensagens;
create policy mensagens_insert_partes on mensagens
for insert with check (
  auth.uid() = remetente_id
  and exists (
    select 1
    from pedidos
    where pedidos.id = mensagens.pedido_id
      and (pedidos.cliente_id = auth.uid() or pedidos.prestador_id = auth.uid())
  )
);

drop policy if exists notificacoes_select_proprio on notificacoes;
create policy notificacoes_select_proprio on notificacoes
for select using (auth.uid() = usuario_id);

drop policy if exists notificacoes_update_proprio on notificacoes;
create policy notificacoes_update_proprio on notificacoes
for update using (auth.uid() = usuario_id);

drop policy if exists avaliacoes_select_todos on avaliacoes;
create policy avaliacoes_select_todos on avaliacoes
for select using (true);

drop policy if exists avaliacoes_insert_cliente on avaliacoes;
create policy avaliacoes_insert_cliente on avaliacoes
for insert with check (auth.uid() = cliente_id);

