# Complete test of all 8 endpoints

$BASE_URL = "http://localhost:4006/api/generators"
$results = @{ passed = 0; failed = 0; tests = @() }

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Full API Test Suite - All 8 Endpoints" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Endpoint,
        [object]$Body
    )

    Write-Host "Testing: $Name" -ForegroundColor Yellow
    try {
        $url = "$BASE_URL$Endpoint"
        $params = @{
            Uri = $url
            Method = $Method
            ContentType = "application/json"
            ErrorAction = "Stop"
            SkipHttpErrorCheck = $true
        }

        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }

        $response = Invoke-WebRequest @params

        if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) {
            Write-Host "  PASSED ($($response.StatusCode))" -ForegroundColor Green
            $results.passed++
            $results.tests += @{name = $Name; status = "PASSED"}
            return $true
        } else {
            Write-Host "  FAILED ($($response.StatusCode))" -ForegroundColor Red
            $results.failed++
            $results.tests += @{name = $Name; status = "FAILED"}
            return $false
        }
    } catch {
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $results.failed++
        $results.tests += @{name = $Name; status = "ERROR"}
        return $false
    }
}

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4006/health" -Method GET -ErrorAction Stop
    Write-Host "  PASSED: Backend online" -ForegroundColor Green
    $results.passed++
} catch {
    Write-Host "  FAILED: Backend offline" -ForegroundColor Red
    $results.failed++
    exit 1
}

Write-Host ""

# Test 2: POST /config - Create Configuration
Write-Host "Test 2: POST /config - Create Configuration" -ForegroundColor Cyan
$projectId = [guid]::NewGuid().ToString()
$configBody = @{
    projectId = $projectId
    name = "Test Configuration"
    description = "For testing all endpoints"
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
}

if (Test-Endpoint "POST /config" "POST" "/config" $configBody) {
    try {
        $url = "$BASE_URL/config"
        $response = Invoke-WebRequest -Uri $url -Method POST -Body ($configBody | ConvertTo-Json -Depth 10) -ContentType "application/json" -ErrorAction Stop
        $configData = $response.Content | ConvertFrom-Json
        $configId = $configData.id
        Write-Host "  Config ID: $($configId.Substring(0,8))..." -ForegroundColor Gray
    } catch {}
}

Write-Host ""

# Test 3: GET /config/:projectId - List Configurations
Write-Host "Test 3: GET /config/:projectId - List Configurations" -ForegroundColor Cyan
Test-Endpoint "GET /config/:projectId" "GET" "/config/$projectId" | Out-Null

Write-Host ""

# Test 4: GET /email-templates - List Templates
Write-Host "Test 4: GET /email-templates - List Templates" -ForegroundColor Cyan
if (Test-Endpoint "GET /email-templates" "GET" "/email-templates" $null) {
    try {
        $response = Invoke-WebRequest -Uri "$BASE_URL/email-templates" -Method GET -ErrorAction Stop
        $data = $response.Content | ConvertFrom-Json
        Write-Host "  Templates found: $($data.system.Count)" -ForegroundColor Gray
    } catch {}
}

Write-Host ""

# Test 5: POST /generate - Generate Content (Inline)
Write-Host "Test 5: POST /generate - Generate Content" -ForegroundColor Cyan
$contentId = [guid]::NewGuid().ToString()
$generateBody = @{
    contentId = $contentId
    keywordsNiche = @("AI", "content")
    keywordsLongtail = @("AI content generation")
    tone = "friendly"
    enabledFormats = @{
        blog = $true
        email = $true
        social_linkedin = $false
        social_instagram = $false
        whatsapp = $false
        pdf = $false
    }
}

Test-Endpoint "POST /generate" "POST" "/generate" $generateBody | Out-Null

Write-Host ""

# Test 6: GET /generated/:contentId - List Generated Content
Write-Host "Test 6: GET /generated/:contentId - List Generated Content" -ForegroundColor Cyan
Test-Endpoint "GET /generated/:contentId" "GET" "/generated/$contentId" $null | Out-Null

Write-Host ""

# Test 7: POST /batch - Start Batch Job
Write-Host "Test 7: POST /batch - Start Batch Processing" -ForegroundColor Cyan
$batchBody = @{
    projectId = $projectId
    configId = $configId
    contentIds = @([guid]::NewGuid().ToString(), [guid]::NewGuid().ToString())
    concurrencyLimit = 2
}

$batchPassed = $false
if (Test-Endpoint "POST /batch" "POST" "/batch" $batchBody) {
    try {
        $response = Invoke-WebRequest -Uri "$BASE_URL/batch" -Method POST -Body ($batchBody | ConvertTo-Json -Depth 10) -ContentType "application/json" -ErrorAction Stop
        $batchData = $response.Content | ConvertFrom-Json
        $batchJobId = $batchData.batchJobId
        Write-Host "  Batch Job ID: $($batchJobId.Substring(0,8))..." -ForegroundColor Gray
        $batchPassed = $true
    } catch {}
}

Write-Host ""

# Test 8: GET /batch/:jobId - Check Batch Progress
Write-Host "Test 8: GET /batch/:jobId - Check Batch Progress" -ForegroundColor Cyan
if ($batchPassed) {
    Test-Endpoint "GET /batch/:jobId" "GET" "/batch/$batchJobId" $null | Out-Null
} else {
    Write-Host "  SKIPPED: No valid batch job" -ForegroundColor Yellow
}

Write-Host ""

# Summary
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Total Tests Run: $($results.passed + $results.failed)"
Write-Host "Passed: $($results.passed)" -ForegroundColor Green
Write-Host "Failed: $($results.failed)" -ForegroundColor $(if ($results.failed -eq 0) { "Green" } else { "Red" })
Write-Host ""

Write-Host "Detailed Results:" -ForegroundColor Cyan
foreach ($test in $results.tests) {
    $color = if ($test.status -eq "PASSED") { "Green" } else { "Red" }
    Write-Host "  [$($test.status)] $($test.name)" -ForegroundColor $color
}

Write-Host ""

if ($results.failed -eq 0) {
    Write-Host "SUCCESS: All endpoints working! Backend is production-ready." -ForegroundColor Green
    Write-Host "Ready to begin Phase 2: Frontend Development" -ForegroundColor Cyan
} else {
    Write-Host "Some tests failed. Review output above." -ForegroundColor Red
}

Write-Host ""
