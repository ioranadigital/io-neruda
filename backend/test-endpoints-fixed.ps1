# ====================================================================
# Content Generation System v2.0 - API Testing Script (FIXED)
# ====================================================================

$BASE_URL = "http://localhost:4006/api/generators"
$TIMESTAMP = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$LOG_FILE = "test-results-fixed-$TIMESTAMP.log"

# Helper function to generate UUID
function New-UUID {
    return [guid]::NewGuid().ToString()
}

# Colors for output
$Colors = @{
    Success = "Green"
    Error   = "Red"
    Info    = "Cyan"
    Warning = "Yellow"
}

# Test results tracking
$results = @{
    Total     = 0
    Passed    = 0
    Failed    = 0
    Tests     = @()
}

# Generate test IDs
$testProjectId = New-UUID
$testConfigId = $null
$testContentId = New-UUID
$testBatchJobId = $null

# ====================================================================
# HELPER FUNCTIONS
# ====================================================================

function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "INFO"
    )

    $timestamp = Get-Date -Format "HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"

    switch ($Level) {
        "SUCCESS" { Write-Host $logMessage -ForegroundColor $Colors.Success }
        "ERROR"   { Write-Host $logMessage -ForegroundColor $Colors.Error }
        "WARNING" { Write-Host $logMessage -ForegroundColor $Colors.Warning }
        "INFO"    { Write-Host $logMessage -ForegroundColor $Colors.Info }
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
        [int]$ExpectedStatusCode = 200
    )

    $results.Total++

    Write-Log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "INFO"
    Write-Log "Test #$($results.Total): $Name" "INFO"
    Write-Log "Method: $Method | Endpoint: $Endpoint" "INFO"

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
            Write-Log "Request Body: $($requestParams.Body | ConvertTo-Json -Compress)" "INFO"
        }

        $startTime = Get-Date
        $response = Invoke-WebRequest @requestParams
        $endTime = Get-Date
        $duration = ($endTime - $startTime).TotalMilliseconds

        $statusCode = $response.StatusCode
        $content = $response.Content | ConvertFrom-Json

        Write-Log "Status: $statusCode | Duration: ${duration}ms" "INFO"
        Write-Log "Response (compact): $($content | ConvertTo-Json -Compress -Depth 1)" "INFO"

        if ($statusCode -eq $ExpectedStatusCode -or ($statusCode -ge 200 -and $statusCode -lt 300 -and $ExpectedStatusCode -lt 300)) {
            Write-Log "✅ PASSED" "SUCCESS"
            $results.Passed++
            $testResult = @{
                Name   = $Name
                Status = "PASSED"
                Code   = $statusCode
                Data   = $content
            }
        } else {
            Write-Log "❌ FAILED - Expected $ExpectedStatusCode, got $statusCode" "ERROR"
            $results.Failed++
            $testResult = @{
                Name   = $Name
                Status = "FAILED"
                Code   = $statusCode
                Data   = $content
            }
        }

        $results.Tests += $testResult
        return $testResult

    } catch {
        Write-Log "❌ ERROR: $($_.Exception.Message)" "ERROR"
        $results.Failed++
        $results.Tests += @{
            Name   = $Name
            Status = "ERROR"
            Error  = $_.Exception.Message
        }
        return $null
    }
}

# ====================================================================
# PRE-TEST CHECKS
# ====================================================================

Write-Host ""
Write-Log "╔═══════════════════════════════════════════════════════════╗" "INFO"
Write-Log "║  Content Generation System v2.0 - API Test Suite (FIXED) ║" "INFO"
Write-Log "║  Base URL: $BASE_URL" "INFO"
Write-Log "╚═══════════════════════════════════════════════════════════╝" "INFO"
Write-Host ""

Write-Log "Using test IDs:" "INFO"
Write-Log "  Project ID: $testProjectId" "INFO"
Write-Log "  Content ID: $testContentId" "INFO"

# Check if server is running
Write-Log "Checking if backend server is running..." "INFO"
try {
    $healthCheck = Invoke-WebRequest -Uri "http://localhost:4006/health" -Method GET -ErrorAction Stop
    Write-Log "✅ Backend is running" "SUCCESS"
} catch {
    Write-Log "❌ Backend is NOT running. Please start: node backend/server.js" "ERROR"
    exit 1
}

Write-Host ""

# ====================================================================
# TEST SUITE
# ====================================================================

# Test 1: Create Configuration
Write-Log "Creating test configuration..." "INFO"
$configResponse = Test-Endpoint `
    -Name "POST /config - Create Configuration" `
    -Method "POST" `
    -Endpoint "/config" `
    -Body @{
        projectId = $testProjectId
        name = "Test Blog Config"
        description = "Configuration for testing"
        keywordsNiche = @("AI", "content generation")
        keywordsLongtail = @("how to generate AI content")
        tone = "professional"
        enabledFormats = @{
            blog = $true
            email = $true
            social_linkedin = $true
            social_instagram = $false
            whatsapp = $false
            pdf = $false
        }
        isTemplate = $true
    } `
    -ExpectedStatusCode 201

if ($configResponse.Status -eq "PASSED") {
    $testConfigId = $configResponse.Data.id
    Write-Log "✅ Config created: $testConfigId" "SUCCESS"
}

Write-Host ""

# Test 2: Get Configurations for Project
Test-Endpoint `
    -Name "GET /config/:projectId - List Configurations" `
    -Method "GET" `
    -Endpoint "/config/$testProjectId" `
    -ExpectedStatusCode 200 | Out-Null

Write-Host ""

# Test 3: List Email Templates
$templatesResponse = Test-Endpoint `
    -Name "GET /email-templates - List System Templates" `
    -Method "GET" `
    -Endpoint "/email-templates?projectId=$testProjectId" `
    -ExpectedStatusCode 200

Write-Host ""

# Test 4: Generate Content (Inline Config)
Write-Log "Generating content inline (without saving to DB)..." "INFO"
$generateResponse = Test-Endpoint `
    -Name "POST /generate - Generate Content Inline" `
    -Method "POST" `
    -Endpoint "/generate" `
    -Body @{
        contentId = $testContentId
        keywordsNiche = @("automation", "workflow")
        keywordsLongtail = @("workflow automation tools")
        tone = "friendly"
        enabledFormats = @{
            blog = $true
            email = $true
            social_linkedin = $false
            social_instagram = $false
            whatsapp = $false
            pdf = $false
        }
    } `
    -ExpectedStatusCode 200

Write-Host ""

# Test 5: Generate Content Using Saved Config (if config was created)
if ($testConfigId) {
    $anotherContentId = New-UUID
    Test-Endpoint `
        -Name "POST /generate - Generate with Saved Config" `
        -Method "POST" `
        -Endpoint "/generate" `
        -Body @{
            contentId = $anotherContentId
            configId = $testConfigId
        } `
        -ExpectedStatusCode 200 | Out-Null

    Write-Host ""
}

# Test 6: Start Batch Job (if config exists)
if ($testConfigId) {
    Write-Log "Starting batch job with 3 test contents..." "INFO"
    $batchResponse = Test-Endpoint `
        -Name "POST /batch - Start Batch Processing" `
        -Method "POST" `
        -Endpoint "/batch" `
        -Body @{
            projectId = $testProjectId
            configId = $testConfigId
            contentIds = @((New-UUID), (New-UUID), (New-UUID))
            concurrencyLimit = 2
        } `
        -ExpectedStatusCode 202

    if ($batchResponse.Status -eq "PASSED") {
        $testBatchJobId = $batchResponse.Data.batchJobId
        Write-Log "✅ Batch job started: $testBatchJobId" "SUCCESS"
    }

    Write-Host ""

    # Test 7: Check Batch Progress
    if ($testBatchJobId) {
        Start-Sleep -Milliseconds 500
        Test-Endpoint `
            -Name "GET /batch/:jobId - Check Batch Progress" `
            -Method "GET" `
            -Endpoint "/batch/$testBatchJobId" `
            -ExpectedStatusCode 200 | Out-Null

        Write-Host ""
    }
}

# ====================================================================
# TEST SUMMARY
# ====================================================================

Write-Log "╔═══════════════════════════════════════════════════════════╗" "INFO"
Write-Log "║  TEST SUMMARY                                             ║" "INFO"
Write-Log "╚═══════════════════════════════════════════════════════════╝" "INFO"

Write-Host ""
Write-Log "Total Tests: $($results.Total)" "INFO"
Write-Log "Passed: $($results.Passed)" "SUCCESS"
Write-Log "Failed: $($results.Failed)" $(if ($results.Failed -eq 0) { "SUCCESS" } else { "ERROR" })

Write-Host ""
Write-Log "Detailed Results:" "INFO"
Write-Host ""

foreach ($test in $results.Tests) {
    $statusColor = if ($test.Status -eq "PASSED") { "Green" } else { "Red" }
    Write-Host "  [$($test.Status)] $($test.Name)" -ForegroundColor $statusColor
}

Write-Host ""

$passRate = if ($results.Total -gt 0) {
    [math]::Round(($results.Passed / $results.Total) * 100, 2)
} else {
    0
}

Write-Log "Pass Rate: $passRate%" $(if ($passRate -eq 100) { "SUCCESS" } else { "WARNING" })

Write-Host ""
Write-Log "Log file saved to: $LOG_FILE" "INFO"

if ($results.Failed -eq 0) {
    Write-Log "✅ All tests passed!" "SUCCESS"
    exit 0
} else {
    Write-Log "❌ Some tests failed. Review the log file." "ERROR"
    exit 1
}
