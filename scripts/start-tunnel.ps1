$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot
$dataDir = Join-Path $projectRoot '.data'
$cloudflared = Join-Path $dataDir 'bin\cloudflared.exe'
$tokenFile = Join-Path $dataDir 'cloudflare-tunnel.token'
if (-not (Test-Path -LiteralPath $cloudflared)) { throw 'cloudflared não encontrado em .data/bin.' }
if (-not (Test-Path -LiteralPath $tokenFile)) { throw 'Token privado do túnel não encontrado em .data.' }

$pidFile = Join-Path $dataDir 'cloudflare-tunnel.pid'
if (Test-Path -LiteralPath $pidFile) {
  $priorId = [int](Get-Content -LiteralPath $pidFile -Raw)
  $prior = Get-Process -Id $priorId -ErrorAction SilentlyContinue
  if ($prior -and $prior.Path -eq $cloudflared) {
    Write-Host 'Conector AleJoias já está em execução.'
    exit 0
  }
}

$tunnelToken = Get-Content -LiteralPath $tokenFile -Raw
$process = Start-Process -FilePath $cloudflared -ArgumentList @('tunnel', '--no-autoupdate', 'run', '--token', $tunnelToken) -WorkingDirectory $projectRoot -RedirectStandardOutput (Join-Path $dataDir 'cloudflare-tunnel.out.log') -RedirectStandardError (Join-Path $dataDir 'cloudflare-tunnel.err.log') -WindowStyle Hidden -PassThru
Set-Content -LiteralPath $pidFile -Value $process.Id
Start-Sleep -Seconds 3
if ($process.HasExited) { throw 'Conector encerrou. Consulte .data/cloudflare-tunnel.err.log.' }
Write-Host 'Conector AleJoias iniciado; confira o status Healthy na Cloudflare.'
