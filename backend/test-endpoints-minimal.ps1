# ====================================================================
# Content Generation System v2.0 - Minimal API Testing
# ====================================================================

$BASE_URL = "http://localhost:4006/api/generators"
$TIMESTAMP = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$LOG_FILE = "test-results-minimal-$TIMESTAMP.log"

# Helper function to generate UUID
function New-UUID {
    return [guid]::NewGuid().ToString()
}

$results = @{
    Total   = 0
    Passed  = 0
    Failed  = 0
    Tests   = @()
}

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"

    switch ($Level) {
        "SUCCESS" { Write-Host $logMessage -ForegroundColor Green }
        "ERROR"   { Write-Host $logMessage -ForegroundColor Red }
        "WARNING" { Write-Host $logMessage -ForegroundColor Yellow }
        "INFO"    { Write-Host $logMessage -ForegroundColor Cyan }
        default   { Write-Host $logMessage }
    }

    Add-Content -Path $LOG_FILE -Value $logMessage
}

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Endpoint,
        [object]$Body,
        [int]$ExpectedStatusCode = 200,
        [scriptblock]$Assertion = $null
    )

    $results.Total++
    Write-Log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "INFO"
    Write-Log "Test #$($results.Total): $Name" "INFO"

    try {
        $url = "$BASE_URL$Endpoint"
        $requestParams = @{
            Uri             = $url
            Method          = $Method
            ContentType     = "application/json"
            ErrorAction     = "Stop"
            SkipHttpErrorCheck = $true
        }

        if ($Body) {
            $requestParams.Body = ($Body | ConvertTo-Json -Depth 10)
        }

        $response = Invoke-WebRequest @requestParams
        $statusCode = $response.StatusCode
        $content = $response.Content | ConvertFrom-Json

        Write-Log "  Status: $statusCode" "INFO"

        $passed = $false
        if ($Assertion) {
            $passed = & $Assertion $content
        } else {
            $passed = ($statusCode -eq $ExpectedStatusCode -or ($statusCode -ge 200 -and $statusCode -lt 300 -and $ExpectedStatusCode -lt 300))
        }

        if ($passed) {
            Write-Log "  ✅ PASSED" "SUCCESS"
            $results.Passed++
            $results.Tests += @{Name = $Name; Status = "PASSED"; Code = $statusCode}
        } else {
            Write-Log "  ❌ FAILED" "ERROR"
            $results.Failed++
            $results.Tests += @{Name = $Name; Status = "FAILED"; Code = $statusCode}
        }

    } catch {
        Write-Log "  ❌ ERROR: $($_.Exception.Message)" "ERROR"
        $results.Failed++
        $results.Tests += @{Name = $Name; Status = "ERROR"}
    }
}

# ====================================================================
# MAIN TEST SUITE
# ====================================================================

Write-Host ""
Write-Log "╔═══════════════════════════════════════════════════════════╗" "INFO"
Write-Log "║  Content Generation System v2.0 - Minimal Test Suite    ║" "INFO"
Write-Log "║  Base URL: $BASE_URL" "INFO"
Write-Log "╚═══════════════════════════════════════════════════════════╝" "INFO"
Write-Host ""

# Check health
Write-Log "Verifying backend is running..." "INFO"
try {
    Invoke-WebRequest -Uri "http://localhost:4006/health" -Method GET -ErrorAction Stop | Out-Null
    Write-Log "✅ Backend is online" "SUCCESS"
} catch {
    Write-Log "❌ Backend is offline" "ERROR"
    exit 1
}

Write-Host ""

# ====================================================================
# TEST 1: Email Templates Endpoint (No Dependencies)
# ====================================================================
Test-Endpoint `
    -Name "GET /email-templates - List system templates" `
    -Method "GET" `
    -Endpoint "/email-templates" `
    -ExpectedStatusCode 200 `
    -Assertion {
        param($response)
        return $response.system.Count -gt 0
    }

Write-Host ""

# ====================================================================
# TEST 2: Create Configuration (With Valid UUID)
# ====================================================================
$projectId = New-UUID
Test-Endpoint `
    -Name "POST /config - Create configuration" `
    -Method "POST" `
    -Endpoint "/config" `
    -Body @{
        projectId = $projectId
        name = "Test Configuration"
        description = "For testing the API"
        keywordsNiche = @("test", "api")
        keywordsLongtail = @("test api endpoint")
        tone = "professional"
        enabledFormats = @{
            blog = $true
            email = $true
            social_linkedin = $false
            social_instagram = $false
            whatsapp = $false
            pdf = $false
        }
        isTemplate = $false
    } `
    -ExpectedStatusCode 201 `
    -Assertion {
        param($response)
        return $response.id -and $response.project_id -eq $using:projectId
    }

Write-Host ""

# ====================================================================
# TEST 3: Get Configurations for Project
# ====================================================================
Test-Endpoint `
    -Name "GET /config/:projectId - List project configurations" `
    -Method "GET" `
    -Endpoint "/config/$projectId" `
    -ExpectedStatusCode 200

Write-Host ""

# ====================================================================
# TEST SUMMARY
# ====================================================================

Write-Log "╔═══════════════════════════════════════════════════════════╗" "INFO"
Write-Log "║  TEST SUMMARY                                             ║" "INFO"
Write-Log "╚═══════════════════════════════════════════════════════════╝" "INFO"

Write-Host ""
Write-Log "Total: $($results.Total) | Passed: $($results.Passed) | Failed: $($results.Failed)" $(if ($results.Failed -eq 0) { "SUCCESS" } else { "ERROR" })
Write-Host ""

foreach ($test in $results.Tests) {
    $color = if ($test.Status -eq "PASSED") { "Green" } else { "Red" }
    Write-Host "  [$($test.Status)] $($test.Name)" -ForegroundColor $color
}

$passRate = if ($results.Total -gt 0) { [math]::Round(($results.Passed / $results.Total) * 100, 2) } else { 0 }
Write-Host ""
Write-Log "Pass Rate: $passRate%" $(if ($passRate -eq 100) { "SUCCESS" } else { "WARNING" })
Write-Host ""

if ($results.Failed -eq 0) {
    Write-Log "✅ All core endpoints working!" "SUCCESS"
    exit 0
} else {
    Write-Log "❌ Some tests failed" "ERROR"
    exit 1
}
