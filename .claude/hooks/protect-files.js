// PreToolUse: block edits to secrets and lock files
let d = '';
process.stdin.on('data', c => (d += c)).on('end', () => {
  const p = ((JSON.parse(d).tool_input || {}).file_path || '').split(String.fromCharCode(92)).join('/');
  if ((/(^|\/)\.env(\.|$)/.test(p) && !/\.example$/.test(p)) || /(^|\/)package-lock\.json$/.test(p)) {
    console.error(`Blocked: ${p} is protected (secrets / lock file). Edit it manually or via npm.`);
    process.exit(2);
  }
});
