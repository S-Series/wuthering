const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = name => fs.readFileSync(path.join(__dirname, name), 'utf8');
const tables = { board_posts: 'board_posts.sql', board_comments: 'board_posts.sql',
  render_request_states: 'render_request_states.sql', dev_analytics_daily: 'dev_analytics_daily.sql' };

test('fresh DDL explicitly grants only gateway table operations', () => {
  for (const [table, file] of Object.entries(tables)) {
    assert.match(read(file), new RegExp(`grant select, insert, update on table public\\.${table} to service_role;`, 'i'));
    assert.match(read(file), new RegExp(`alter table public\\.${table} enable row level security;`, 'i'));
  }
});
test('existing-installation patch is limited to four tables and one role', () => {
  const statements = read('service_role_table_grants.sql').replace(/--[^\n]*/g, '').trim();
  assert.equal(statements.replace(/\s+/g, ' '),
    'begin; grant select, insert, update on table public.board_posts, public.board_comments, public.render_request_states, public.dev_analytics_daily to service_role; commit;');
});
test('verification is read-only and never calls the view-count RPC', () => {
  const sql = read('verify_service_role_table_grants.sql').replace(/--[^\n]*/g, '');
  assert.match(sql, /begin read only;/i);
  assert.doesNotMatch(sql, /\b(grant|revoke|insert|update|delete|nextval)\b(?!')/i);
  assert.doesNotMatch(sql, /select\s+public\.increment_board_post_view/i);
  assert.match(sql, /pg_policies/);
  assert.match(sql, /pg_get_triggerdef/);
});
