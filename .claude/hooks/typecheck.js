// PostToolUse: type-check after editing a .ts file
const { spawnSync } = require('child_process');
let d = '';
process.stdin.on('data', c => (d += c)).on('end', () => {
  const p = (JSON.parse(d).tool_input || {}).file_path || '';
  if (!/\.ts$/.test(p)) return;
  const r = spawnSync('npx tsc --noEmit -p tsconfig.app.json', { shell: true, encoding: 'utf8' });
  if (r.status !== 0) {
    console.error((r.stdout + r.stderr).split('\n').slice(0, 30).join('\n'));
    process.exit(2);
  }
});
