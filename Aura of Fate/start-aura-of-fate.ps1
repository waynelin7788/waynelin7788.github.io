$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$appUrl = "http://127.0.0.1:5173/"
$pidPath = Join-Path $root "aura-server.pid"

Set-Location $root

function Test-AppReady {
  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri $appUrl -TimeoutSec 2
    return $response.StatusCode -eq 200
  } catch {
    return $false
  }
}

function Stop-ExistingAuraServer {
  if (Test-Path $pidPath) {
    $pidText = (Get-Content -Raw -Path $pidPath).Trim()
    $serverPid = 0
    if ([int]::TryParse($pidText, [ref]$serverPid)) {
      $serverProcess = Get-Process -Id $serverPid -ErrorAction SilentlyContinue
      if ($serverProcess -and $serverProcess.ProcessName -eq "node") {
        Stop-Process -Id $serverPid -Force
        Start-Sleep -Milliseconds 300
      }
    }
    Remove-Item -Path $pidPath -Force -ErrorAction SilentlyContinue
  }

  $portOwners = netstat -ano |
    Select-String "127\.0\.0\.1:5173\s" |
    ForEach-Object {
      $parts = ($_ -split "\s+").Where({ $_ })
      if ($parts.Length -ge 5) { $parts[4] }
    } |
    Sort-Object -Unique

  foreach ($ownerPid in $portOwners) {
    $owner = Get-Process -Id $ownerPid -ErrorAction SilentlyContinue
    if ($owner -and $owner.ProcessName -eq "node") {
      Stop-Process -Id $ownerPid -Force
      Start-Sleep -Milliseconds 300
    }
  }
}

try {
  $null = & node --version
} catch {
  Write-Host "Node.js was not found. Please install Node.js before starting Aura of Fate."
  exit 1
}

if (-not (Test-Path (Join-Path $root ".env"))) {
  Write-Host ".env was not found. AI readings cannot run without it."
  Write-Host "Please keep .env in the same folder as this startup file."
  exit 1
}

Stop-ExistingAuraServer
Start-Process -FilePath "node" -ArgumentList "dev-server.js" -WorkingDirectory $root -WindowStyle Hidden
Start-Sleep -Seconds 1

for ($index = 0; $index -lt 20; $index += 1) {
  if (Test-AppReady) {
    Start-Process $appUrl
    exit 0
  }

  Start-Sleep -Milliseconds 500
}

Write-Host "Local server startup timed out. Please check whether port 5173 is occupied."
exit 1
