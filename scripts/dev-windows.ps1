$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot
$runtimeRoot = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies'
$nodeBin = Join-Path $runtimeRoot 'node\bin'
$bundledPnpm = Join-Path $runtimeRoot 'bin\fallback\pnpm.cmd'
if (Test-Path -LiteralPath (Join-Path $nodeBin 'node.exe')) { $env:Path = "$nodeBin;$env:Path" }
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Node.js nao encontrado. Instale Node.js 24 LTS e abra este arquivo novamente.' }
$pnpmCommand = if (Test-Path -LiteralPath $bundledPnpm) { $bundledPnpm } else { (Get-Command pnpm.cmd -ErrorAction Stop).Source }
# Evita iniciar outro servidor quando este projeto ja esta ativo na porta esperada.
try {
  $response = Invoke-WebRequest -Uri 'http://localhost:4321/' -UseBasicParsing -TimeoutSec 2
  if ($response.StatusCode -eq 200 -and $response.Content -match 'AleJoias') {
    Write-Host 'AleJoias ja esta em execucao. Abrindo o navegador.'
    Start-Process 'http://localhost:4321/'
    exit 0
  }
} catch { }
Write-Host 'Conferindo dependencias do projeto...'
& $pnpmCommand install --frozen-lockfile
if ($LASTEXITCODE -ne 0) { throw 'Falha na instalacao das dependencias.' }
Write-Host 'Iniciando AleJoias. Mantenha esta janela aberta. Para parar: Ctrl+C.'
& $pnpmCommand dev --host 127.0.0.1 --port 4321 --open
exit $LASTEXITCODE
