# Simple test runner for API endpoints

$BASE_URL = "http://localhost:4006/api/generators"
$results = @{ passed = 0; failed = 0 }

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "Content Generation System - API Tests" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4006/health" -Method GET -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "PASSED: Backend is running" -ForegroundColor Green
        $results.passed++
    }
} catch {
    Write-Host "FAILED: Backend not responding" -ForegroundColor Red
    $results.failed++
    exit 1
}

Write-Host ""

# Test 2: Email Templates
Write-Host "Test 2: GET /email-templates" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/email-templates" -Method GET -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    if ($data.system.Count -gt 0) {
        Write-Host "PASSED: Retrieved $($data.system.Count) email templates" -ForegroundColor Green
        $results.passed++
    } else {
        Write-Host "FAILED: No templates found" -ForegroundColor Red
        $results.failed++
    }
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    $results.failed++
}

Write-Host ""

# Test 3: Get Configurations
Write-Host "Test 3: GET /config/:projectId" -ForegroundColor Yellow
try {
    $projectId = [guid]::NewGuid().ToString()
    $response = Invoke-WebRequest -Uri "$BASE_URL/config/$projectId" -Method GET -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "PASSED: Query executed successfully" -ForegroundColor Green
        $results.passed++
    }
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    $results.failed++
}

Write-Host ""

# Summary
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Total Tests: $($results.passed + $results.failed)"
Write-Host "Passed: $($results.passed)" -ForegroundColor Green
Write-Host "Failed: $($results.failed)" -ForegroundColor $(if ($results.failed -eq 0) { "Green" } else { "Red" })
Write-Host ""

if ($results.failed -eq 0) {
    Write-Host "All tests PASSED! Backend is ready for Phase 2." -ForegroundColor Green
} else {
    Write-Host "Some tests failed. Check the output above." -ForegroundColor Red
}

Write-Host ""
