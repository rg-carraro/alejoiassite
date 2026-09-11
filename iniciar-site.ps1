$ErrorActionPreference = 'Stop'
& (Join-Path $PSScriptRoot 'scripts\dev-windows.ps1')
exit $LASTEXITCODE
