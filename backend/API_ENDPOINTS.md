# Content Generation System v2.0 - API Endpoints

**Base URL:** `http://localhost:4006/api/generators`

---

## 1. POST /api/generators/config
Create or save a reusable content configuration.

**Request:**
```json
{
  "projectId": "proj_123",
  "name": "Blog Professional",
  "description": "Professional blog posts with SEO optimization",
  "keywordsNiche": ["content generation", "AI writing"],
  "keywordsLongtail": ["how to generate blog content with AI"],
  "tone": "professional",
  "toneCustomText": null,
  "enabledFormats": {
    "blog": true,
    "email": true,
    "social_linkedin": false,
    "social_instagram": false,
    "whatsapp": false,
    "pdf": false
  },
  "emailTemplateId": null,
  "isTemplate": true
}
```

**Response:** (201 Created)
```json
{
  "id": "config_xyz123",
  "project_id": "proj_123",
  "name": "Blog Professional",
  "description": "Professional blog posts with SEO optimization",
  "created_at": "2026-06-04T10:00:00Z",
  ...
}
```

---

## 2. GET /api/generators/config/:projectId
List all configurations for a project.

**URL:** `GET /api/generators/config/proj_123`

**Response:** (200 OK)
```json
[
  {
    "id": "config_xyz123",
    "project_id": "proj_123",
    "name": "Blog Professional",
    ...
  },
  {
    "id": "config_abc456",
    "project_id": "proj_123",
    "name": "Email Newsletter",
    ...
  }
]
```

---

## 3. POST /api/generators/generate
Generate content in multiple formats for a Plan (content).

**Request Option A - Using Saved Config:**
```json
{
  "contentId": "content_001",
  "configId": "config_xyz123"
}
```

**Request Option B - Inline Config:**
```json
{
  "contentId": "content_001",
  "keywordsNiche": ["AI", "content"],
  "keywordsLongtail": ["AI content generation"],
  "tone": "friendly",
  "enabledFormats": {
    "blog": true,
    "email": true,
    "social_linkedin": true,
    "social_instagram": false,
    "whatsapp": false,
    "pdf": false
  }
}
```

**Response:** (200 OK)
```json
{
  "jobId": null,
  "contentId": "content_001",
  "generatedContents": {
    "blog": {
      "id": "gen_001",
      "format": "blog",
      "generated_text": "# Blog Title\n\nIntroduction...",
      "word_count": 1850,
      "keywords_used": ["AI", "content"],
      "keyword_density": 2.5,
      "tone_applied": "friendly",
      "version": 1,
      "status": "draft"
    },
    "email": {
      "id": "gen_002",
      "format": "email",
      "generated_text": "Subject: {{subject}}\nGreeting: {{greeting}}...",
      "word_count": 320,
      ...
    },
    "social_linkedin": {
      "id": "gen_003",
      "format": "social_linkedin",
      "generated_text": "Engaging LinkedIn post...",
      ...
    }
  }
}
```

---

## 4. GET /api/generators/generated/:contentId
List all generated content versions for a Plan.

**URL:** `GET /api/generators/generated/content_001`

**Response:** (200 OK)
```json
[
  {
    "id": "gen_001",
    "content_id": "content_001",
    "format": "blog",
    "generated_text": "# Blog Title\n\nIntroduction...",
    "word_count": 1850,
    "keywords_used": ["AI", "content"],
    "keyword_density": 2.5,
    "tone_applied": "friendly",
    "version": 1,
    "is_alternative": false,
    "status": "draft",
    "created_at": "2026-06-04T10:05:00Z"
  },
  {
    "id": "gen_002",
    "content_id": "content_001",
    "format": "email",
    "generated_text": "Subject: {{subject}}\n...",
    "word_count": 320,
    "version": 1,
    "status": "draft",
    "created_at": "2026-06-04T10:05:02Z"
  }
]
```

---

## 5. POST /api/generators/batch
Start batch processing to generate content for multiple Plans in parallel.

**Request:**
```json
{
  "projectId": "proj_123",
  "configId": "config_xyz123",
  "contentIds": ["content_001", "content_002", "content_003"],
  "concurrencyLimit": 3
}
```

**Response:** (202 Accepted)
```json
{
  "batchJobId": "batch_job_123",
  "status": "processing",
  "totalItems": 3,
  "estimatedTimeSeconds": 30
}
```

---

## 6. GET /api/generators/batch/:batchJobId
Get progress of a batch job.

**URL:** `GET /api/generators/batch/batch_job_123`

**Response:** (200 OK)
```json
{
  "batchJobId": "batch_job_123",
  "status": "processing",
  "totalItems": 3,
  "processedItems": 2,
  "failedItems": 0,
  "percentComplete": 66,
  "results": [
    {
      "contentId": "content_001",
      "status": "completed",
      "generatedIds": ["gen_001", "gen_002", "gen_003"]
    },
    {
      "contentId": "content_002",
      "status": "completed",
      "generatedIds": ["gen_004", "gen_005"]
    },
    {
      "contentId": "content_003",
      "status": "processing",
      "generatedIds": []
    }
  ]
}
```

---

## 7. GET /api/generators/email-templates
List system and project email templates.

**URL:** `GET /api/generators/email-templates?projectId=proj_123`

**Response:** (200 OK)
```json
{
  "system": [
    {
      "id": "template_std",
      "name": "Newsletter Estándar",
      "subject": "{{subject}}",
      "body": "Hello {{name}},\n\n{{body}}\n\nBest regards",
      "is_system": true
    },
    {
      "id": "template_welcome",
      "name": "Email de Bienvenida",
      "subject": "Welcome {{name}}!",
      "body": "...",
      "is_system": true
    }
  ],
  "project": [
    {
      "id": "custom_template_001",
      "name": "My Custom Template",
      "subject": "Custom subject",
      "body": "Custom body template",
      "is_system": false,
      "project_id": "proj_123"
    }
  ]
}
```

---

## 8. PUT /api/generators/generated/:generatedId
Update generated content (status, text, etc).

**Request:**
```json
{
  "status": "published",
  "generated_text": "Updated content text...",
  "notes": "Reviewed and approved"
}
```

**Response:** (200 OK)
```json
{
  "id": "gen_001",
  "content_id": "content_001",
  "format": "blog",
  "generated_text": "Updated content text...",
  "status": "published",
  "notes": "Reviewed and approved",
  "updated_at": "2026-06-04T10:15:00Z",
  ...
}
```

---

## Testing with cURL

### Test 1: Create a configuration
```bash
curl -X POST http://localhost:4006/api/generators/config \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "proj_123",
    "name": "Test Config",
    "description": "Testing the API",
    "keywordsNiche": ["test"],
    "keywordsLongtail": ["test keywords"],
    "tone": "professional",
    "enabledFormats": {"blog": true, "email": true, "social_linkedin": false, "social_instagram": false, "whatsapp": false, "pdf": false}
  }'
```

### Test 2: Generate content
```bash
curl -X POST http://localhost:4006/api/generators/generate \
  -H "Content-Type: application/json" \
  -d '{
    "contentId": "content_001",
    "keywordsNiche": ["AI"],
    "keywordsLongtail": ["artificial intelligence"],
    "tone": "friendly",
    "enabledFormats": {"blog": true, "email": true}
  }'
```

### Test 3: Start batch job
```bash
curl -X POST http://localhost:4006/api/generators/batch \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "proj_123",
    "configId": "config_xyz123",
    "contentIds": ["content_001", "content_002"],
    "concurrencyLimit": 2
  }'
```

### Test 4: Check batch progress
```bash
curl http://localhost:4006/api/generators/batch/batch_job_123
```

---

## Validation Errors

All endpoints validate input with Zod. Invalid requests return:

```json
{
  "error": "Validación fallida",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["projectId"],
      "message": "Required"
    }
  ]
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 202 | Accepted (async operation) |
| 400 | Validation error |
| 404 | Not found |
| 500 | Server error |

---

**Version:** 2.0  
**Last Updated:** 2026-06-04  
**Environment:** Development
