import {spawnSync} from 'node:child_process';
const command = process.argv[2] || 'build';
if (!['build','dev','preview'].includes(command)) throw Error('Use build, dev ou preview.');
const result = spawnSync(process.execPath, ['node_modules/astro/bin/astro.mjs', command, ...process.argv.slice(3)], {
  stdio: 'inherit', env: {...process.env, ALEJOIAS_TARGET: 'cloudflare', ASTRO_TELEMETRY_DISABLED: '1', WRANGLER_LOG_PATH: '.data/wrangler-logs'},
});
process.exit(result.status ?? 1);
