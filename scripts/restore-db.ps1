param(
    [Parameter(Mandatory = $true)]
    [string]$File
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $File)) {
    throw "Backup file not found: $File"
}

Get-Content $File | docker compose exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
Write-Host "Database restored from $File"
