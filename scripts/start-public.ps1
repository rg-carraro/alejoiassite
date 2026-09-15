$ErrorActionPreference = 'Stop'
& (Join-Path $PSScriptRoot 'start-live.ps1')
& (Join-Path $PSScriptRoot 'start-tunnel.ps1')
