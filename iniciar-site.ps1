$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$runtimeRoot = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies'
$nodeBin = Join-Path $runtimeRoot 'node\bin'
$pnpmFile = Join-Path $runtimeRoot 'bin\fallback\pnpm.cmd'
if (Test-Path -LiteralPath $pnpmFile) {
  $env:Path = "$nodeBin;$env:Path"
  & $pnpmFile dev
} else {
  pnpm dev
}
