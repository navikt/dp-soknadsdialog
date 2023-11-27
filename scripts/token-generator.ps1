# Define colors
$Cyan = [System.ConsoleColor]::Cyan
$Red = [System.ConsoleColor]::Red
$Purple = [System.ConsoleColor]::Magenta
$Yellow = [System.ConsoleColor]::Yellow
$BPurple = [System.ConsoleColor]::DarkMagenta
$Green = [System.ConsoleColor]::Green

# Env file
$envFile = ".env.development"

# json config
$jsonConfig = "./scripts/token-generator.config.json"

# Main script
function init {
    # Welcome text
    Write-Host "::: dp-soknadsdialog token generator ::: " -ForegroundColor $Cyan
    Write-Host ""

    # Generate azure-token-generator token
    startTokenGenerator

    # Finished
    Start-Sleep -Seconds 1
    Write-Host "You're good to go! Restart your dev-server." -ForegroundColor $Purple
}

# Start token generation process
function startTokenGenerator {
    $config = Get-Content $jsonConfig | ConvertFrom-Json
    $baseUrl = $config.baseUrl
    $cookieName = $config.cookieName

    # First azure-token-generator url from json config
    $url = $config.environments[0].url

    # Show link to azureTokenGenerator to the user
    Write-Host "Visit and sign in with test user: $url" -ForegroundColor $Cyan
    Write-Host "Find and copy $cookieName cookie from DevTools > Application > Cookies" -ForegroundColor $Cyan

    # Ask for wonderwall cookie
    Write-Host "Paste in cookie:"
    $cookie = Read-Host
    Write-Host ""

    # Loop through config list and create environment variable
    foreach ($config in $config.environments) {
        $env = $config.env
        $url = $config.url

        generateAndUpdateEnvFile $baseUrl $env $url $cookieName $cookie
    }

    Write-Host ""
}

# This function makes a request with the cookie using Invoke-RestMethod
function generateAndUpdateEnvFile {
    # Function parameters
    param (
        $baseUrl,
        $env,
        $url,
        $cookieName,
        $cookie
    )

    # Add env key if it does not exist
    $selectedString = Select-String -Path $envFile -Pattern "$env="

    if ($selectedString -eq $null) {
        Add-Content -Path $envFile -Value "$env="
    }

    # Create a new session
    $session = [Microsoft.PowerShell.Commands.WebRequestSession]::new()
    # Add cookies to the session
    $cookieObject = [System.Net.Cookie]::new($cookieName, $cookie)
    $session.Cookies.Add($baseUrl, $cookieObject)

    # Store access token in a variable
    $accessToken = (Invoke-RestMethod -Uri $url -WebSession $session).access_token

    if ([string]::IsNullOrEmpty($accessToken)) {
        Write-Host "$env error" -ForegroundColor $Red
        exit 1
    } else {
        # Fully generated env string
        $generatedEnv = "$env=$accessToken"

        # Update the generated env string in the env file
        (Get-Content $envFile) | ForEach-Object {
            if ($_ -match "^$env=") {
                $generatedEnv
            } else {
                $_
            }
        } | Set-Content $envFile

        Write-Host "$env updated" -ForegroundColor $Cyan
    }
}

# Start script
init
