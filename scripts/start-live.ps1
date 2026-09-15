$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot

$nodeBin = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin'
if (Test-Path -LiteralPath (Join-Path $nodeBin 'node.exe')) { $env:Path = "$nodeBin;$env:Path" }
$node = (Get-Command node -ErrorAction Stop).Source
$entry = Join-Path $projectRoot 'dist\server\entry.mjs'
if (-not (Test-Path -LiteralPath $entry)) { throw 'Build ausente. Execute pnpm build antes de iniciar.' }

try {
  $response = Invoke-WebRequest -Uri 'http://127.0.0.1:4323/' -UseBasicParsing -TimeoutSec 2
  if ($response.StatusCode -eq 200 -and $response.Content -match 'AleJoias') {
    Write-Host 'Servidor de produção AleJoias já ativo em 127.0.0.1:4323.'
    exit 0
  }
} catch { }

$dataDir = Join-Path $projectRoot '.data'
New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
$process = Start-Process -FilePath $node -ArgumentList 'dist/server/entry.mjs' -WorkingDirectory $projectRoot -Environment @{ HOST = '127.0.0.1'; PORT = '4323'; ALEJOIAS_DATA_DIR = $dataDir } -RedirectStandardOutput (Join-Path $dataDir 'live-server.out.log') -RedirectStandardError (Join-Path $dataDir 'live-server.err.log') -WindowStyle Hidden -PassThru
Set-Content -LiteralPath (Join-Path $dataDir 'live-server.pid') -Value $process.Id
for ($attempt = 0; $attempt -lt 20; $attempt++) {
  Start-Sleep -Milliseconds 500
  try {
    $response = Invoke-WebRequest -Uri 'http://127.0.0.1:4323/' -UseBasicParsing -TimeoutSec 2
    if ($response.StatusCode -eq 200 -and $response.Content -match 'AleJoias') {
      Write-Host 'Servidor de produção AleJoias ativo em 127.0.0.1:4323.'
      exit 0
    }
  } catch { }
  if ($process.HasExited) { break }
}
throw 'O servidor de produção não iniciou. Consulte .data/live-server.err.log.'
