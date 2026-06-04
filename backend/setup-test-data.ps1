# ====================================================================
# Setup Test Data for API Testing
# ====================================================================

param(
    [string]$SupabaseUrl = $env:SUPABASE_URL,
    [string]$SupabaseKey = $env:SUPABASE_ANON_KEY
)

if (-not $SupabaseUrl -or -not $SupabaseKey) {
    Write-Host "⚠️ Loading from E:\master.env..." -ForegroundColor Yellow
    $envContent = Get-Content "E:\master.env" | Select-String "SUPABASE" | ForEach-Object { $_ -replace '^\s*', '' }

    foreach ($line in $envContent) {
        if ($line.StartsWith("SUPABASE_URL=")) {
            $SupabaseUrl = $line.Replace("SUPABASE_URL=", "").Trim('"')
        }
        if ($line.StartsWith("SUPABASE_ANON_KEY=")) {
            $SupabaseKey = $line.Replace("SUPABASE_ANON_KEY=", "").Trim('"')
        }
    }
}

if (-not $SupabaseUrl -or -not $SupabaseKey) {
    Write-Host "❌ Supabase credentials not found" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Supabase URL loaded: $($SupabaseUrl.Substring(0, 20))..." -ForegroundColor Green
Write-Host "✅ Supabase Key loaded" -ForegroundColor Green
Write-Host ""

# Generate test IDs
$testProjectId = [guid]::NewGuid().ToString()
$testContentId1 = [guid]::NewGuid().ToString()
$testContentId2 = [guid]::NewGuid().ToString()
$testContentId3 = [guid]::NewGuid().ToString()

Write-Host "📋 Generated Test IDs:" -ForegroundColor Cyan
Write-Host "  Project: $testProjectId" -ForegroundColor Gray
Write-Host "  Content 1: $testContentId1" -ForegroundColor Gray
Write-Host "  Content 2: $testContentId2" -ForegroundColor Gray
Write-Host "  Content 3: $testContentId3" -ForegroundColor Gray
Write-Host ""

# Function to make Supabase API call
function Invoke-SupabaseAPI {
    param(
        [string]$Table,
        [object]$Data,
        [string]$Method = "POST"
    )

    $headers = @{
        "Authorization" = "Bearer $SupabaseKey"
        "Content-Type"  = "application/json"
        "Prefer"        = "return=representation"
    }

    $url = "$SupabaseUrl/rest/v1/$Table"

    try {
        $response = Invoke-WebRequest `
            -Uri $url `
            -Method $Method `
            -Headers $headers `
            -Body ($Data | ConvertTo-Json -Depth 10) `
            -ErrorAction Stop

        return $response.Content | ConvertFrom-Json
    } catch {
        Write-Host "❌ API Error: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# 1. Create Test Project
Write-Host "1️⃣  Creating test project..." -ForegroundColor Cyan
$projectData = @{
    id = $testProjectId
    name = "Test Project - API Testing"
    slug = "test-project-api"
    description = "Project created for API endpoint testing"
    client_id = [guid]::NewGuid().ToString()
    status = "active"
}

$projectResult = Invoke-SupabaseAPI -Table "io_neruda_projects" -Data $projectData
if ($projectResult) {
    Write-Host "✅ Project created: $($projectResult[0].id)" -ForegroundColor Green
} else {
    Write-Host "⚠️ Project creation failed, but may already exist" -ForegroundColor Yellow
}

Write-Host ""

# 2. Create Test Content
Write-Host "2️⃣  Creating test content (3 items)..." -ForegroundColor Cyan

$contents = @(
    @{
        id = $testContentId1
        project_id = $testProjectId
        title = "Test Blog Post 1"
        body = "This is a test blog post for API testing purposes."
        status = "draft"
    },
    @{
        id = $testContentId2
        project_id = $testProjectId
        title = "Test Blog Post 2"
        body = "Another test blog post for generation testing."
        status = "draft"
    },
    @{
        id = $testContentId3
        project_id = $testProjectId
        title = "Test Blog Post 3"
        body = "Third test content for batch processing."
        status = "draft"
    }
)

foreach ($content in $contents) {
    $contentResult = Invoke-SupabaseAPI -Table "io_neruda_contents" -Data $content
    if ($contentResult) {
        Write-Host "✅ Content created: $($content.id.Substring(0, 8))..." -ForegroundColor Green
    } else {
        Write-Host "⚠️ Content creation failed: $($content.title)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ Test data setup complete!" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

Write-Host "Use these IDs in your tests:" -ForegroundColor Cyan
Write-Host "  `$testProjectId = '$testProjectId'" -ForegroundColor Gray
Write-Host "  `$testContentId = '$testContentId1'" -ForegroundColor Gray
Write-Host ""

# Save to file for reference
$testConfig = @{
    projectId = $testProjectId
    contentIds = @($testContentId1, $testContentId2, $testContentId3)
    timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
}

$testConfig | ConvertTo-Json | Out-File -FilePath "test-data.json"
Write-Host "Saved to test-data.json" -ForegroundColor Cyan
