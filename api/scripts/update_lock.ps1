Write-Output "Updating lock file.."
deno cache --lock=lock.json --lock-write --unstable ./deps.ts
