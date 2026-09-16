$ErrorActionPreference = 'Stop'
$siteRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$gitRoot = Split-Path -Parent $siteRoot
$notesLauncher = Join-Path $gitRoot 'alejoias\scripts\start-public-notes.ps1'
if (-not (Test-Path -LiteralPath $notesLauncher)) { throw 'Iniciador de notas ausente.' }
& $notesLauncher
& (Join-Path $PSScriptRoot 'start-live.ps1')
& (Join-Path $PSScriptRoot 'start-tunnel.ps1')
