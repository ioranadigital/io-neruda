# ====================================================================
# Content Generation System v2.0 - API Testing Script
# ====================================================================

$BASE_URL = "http://localhost:4006/api/generators"
$TIMESTAMP = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$LOG_FILE = "test-results-$TIMESTAMP.log"

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

    # Console output
    switch ($Level) {
        "SUCCESS" { Write-Host $logMessage -ForegroundColor $Colors.Success }
        "ERROR"   { Write-Host $logMessage -ForegroundColor $Colors.Error }
        "WARNING" { Write-Host $logMessage -ForegroundColor $Colors.Warning }
        "INFO"    { Write-Host $logMessage -ForegroundColor $Colors.Info }
        default   { Write-Host $logMessage }
    }

    # File logging
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

        # Prepare request
        $requestParams = @{
            Uri             = $url
            Method          = $Method
            ContentType     = "application/json"
            ErrorAction     = "Stop"
            SkipHttpErrorCheck = $true
        }

        if ($Body) {
            $requestParams.Body = ($Body | ConvertTo-Json -Depth 10)
            Write-Log "Request Body: $($requestParams.Body)" "INFO"
        }

        # Make request
        $startTime = Get-Date
        $response = Invoke-WebRequest @requestParams
        $endTime = Get-Date
        $duration = ($endTime - $startTime).TotalMilliseconds

        $statusCode = $response.StatusCode
        $content = $response.Content | ConvertFrom-Json

        Write-Log "Status: $statusCode | Duration: ${duration}ms" "INFO"
        Write-Log "Response: $($content | ConvertTo-Json -Compress)" "INFO"

        # Check if status code matches expected
        if ($statusCode -eq $ExpectedStatusCode -or ($statusCode -ge 200 -and $statusCode -lt 300)) {
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
Write-Log "║  Content Generation System v2.0 - API Test Suite         ║" "INFO"
Write-Log "║  Base URL: $BASE_URL" "INFO"
Write-Log "╚═══════════════════════════════════════════════════════════╝" "INFO"
Write-Host ""

# Check if server is running
Write-Log "Checking if backend server is running..." "INFO"
try {
    $healthCheck = Invoke-WebRequest -Uri "http://localhost:4006/health" -Method GET -ErrorAction Stop
    Write-Log "✅ Backend is running" "SUCCESS"
} catch {
    Write-Log "❌ Backend is NOT running. Please start: node backend/server.js" "ERROR"
    Write-Log "Exiting tests..." "WARNING"
    exit 1
}

Write-Host ""

# ====================================================================
# TEST SUITE
# ====================================================================

# Test 1: Create Configuration
$configResponse = Test-Endpoint `
    -Name "POST /config - Create Configuration" `
    -Method "POST" `
    -Endpoint "/config" `
    -Body @{
        projectId = "proj_test_$(Get-Date -Format 'yyyyMMddHHmmss')"
        name = "Test Blog Config"
        description = "Configuration for testing"
        keywordsNiche = @("AI", "content generation")
        keywordsLongtail = @("how to generate AI content")
        tone = "professional"
        toneCustomText = $null
        enabledFormats = @{
            blog = $true
            email = $true
            social_linkedin = $true
            social_instagram = $false
            whatsapp = $false
            pdf = $false
        }
        emailTemplateId = $null
        isTemplate = $true
    } `
    -ExpectedStatusCode 201

$configId = $configResponse.Data.id
$projectId = $configResponse.Data.project_id

Write-Host ""

# Test 2: Get Configurations for Project
if ($projectId) {
    Test-Endpoint `
        -Name "GET /config/:projectId - List Configurations" `
        -Method "GET" `
        -Endpoint "/config/$projectId" `
        -ExpectedStatusCode 200
}

Write-Host ""

# Test 3: Generate Content (Using Saved Config)
$generateResponse = Test-Endpoint `
    -Name "POST /generate - Generate Content with Config" `
    -Method "POST" `
    -Endpoint "/generate" `
    -Body @{
        contentId = "content_test_$(Get-Date -Format 'yyyyMMddHHmmss')"
        configId = $configId
    } `
    -ExpectedStatusCode 200

$contentId = $generateResponse.Data.contentId

Write-Host ""

# Test 4: Generate Content (Inline Config)
Test-Endpoint `
    -Name "POST /generate - Generate Content Inline" `
    -Method "POST" `
    -Endpoint "/generate" `
    -Body @{
        contentId = "content_inline_$(Get-Date -Format 'yyyyMMddHHmmss')"
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

# Test 5: List Generated Content
if ($contentId) {
    $generatedResponse = Test-Endpoint `
        -Name "GET /generated/:contentId - List Generated Content" `
        -Method "GET" `
        -Endpoint "/generated/$contentId" `
        -ExpectedStatusCode 200

    $generatedId = $generatedResponse.Data[0].id
}

Write-Host ""

# Test 6: Update Generated Content
if ($generatedId) {
    Test-Endpoint `
        -Name "PUT /generated/:generatedId - Update Generated Content" `
        -Method "PUT" `
        -Endpoint "/generated/$generatedId" `
        -Body @{
            status = "published"
            notes = "Approved by editor"
        } `
        -ExpectedStatusCode 200
}

Write-Host ""

# Test 7: List Email Templates
Test-Endpoint `
    -Name "GET /email-templates - List System Templates" `
    -Method "GET" `
    -Endpoint "/email-templates" `
    -ExpectedStatusCode 200

Write-Host ""

# Test 8: List Email Templates with Project ID
if ($projectId) {
    Test-Endpoint `
        -Name "GET /email-templates - List with Project ID" `
        -Method "GET" `
        -Endpoint "/email-templates?projectId=$projectId" `
        -ExpectedStatusCode 200
}

Write-Host ""

# Test 9: Start Batch Job
$batchResponse = Test-Endpoint `
    -Name "POST /batch - Start Batch Processing" `
    -Method "POST" `
    -Endpoint "/batch" `
    -Body @{
        projectId = $projectId
        configId = $configId
        contentIds = @("batch_content_001", "batch_content_002", "batch_content_003")
        concurrencyLimit = 2
    } `
    -ExpectedStatusCode 202

$batchJobId = $batchResponse.Data.batchJobId

Write-Host ""

# Test 10: Check Batch Progress
if ($batchJobId) {
    Start-Sleep -Milliseconds 500  # Give batch a moment to start
    Test-Endpoint `
        -Name "GET /batch/:jobId - Check Batch Progress" `
        -Method "GET" `
        -Endpoint "/batch/$batchJobId" `
        -ExpectedStatusCode 200
}

Write-Host ""

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

# Calculate pass rate
$passRate = if ($results.Total -gt 0) {
    [math]::Round(($results.Passed / $results.Total) * 100, 2)
} else {
    0
}

Write-Log "Pass Rate: $passRate%" $(if ($passRate -eq 100) { "SUCCESS" } else { "WARNING" })

Write-Host ""
Write-Log "Log file saved to: $LOG_FILE" "INFO"

# Exit with appropriate code
if ($results.Failed -eq 0) {
    Write-Log "✅ All tests passed!" "SUCCESS"
    exit 0
} else {
    Write-Log "❌ Some tests failed. Review the log file." "ERROR"
    exit 1
}
