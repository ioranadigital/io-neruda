# Supabase SQL Fix - IO Neruda Backend

## ⚠️ Issue: project_id Foreign Key Constraint

The table `io_neruda_content_configurations` currently has `project_id` as **NOT NULL**, but we need it to be **nullable** to support global configurations.

---

## 🚀 QUICK FIX (2 minutes)

### Step 1: Go to Supabase Dashboard
https://app.supabase.com

### Step 2: Navigate to SQL Editor
- Left sidebar → **SQL Editor**
- Click **+ New Query**

### Step 3: Copy & Paste This SQL

```sql
-- Step 1: Drop existing constraint
ALTER TABLE io_neruda_content_configurations
DROP CONSTRAINT io_neruda_content_configurations_project_id_fkey;

-- Step 2: Make project_id nullable
ALTER TABLE io_neruda_content_configurations
ALTER COLUMN project_id DROP NOT NULL;

-- Step 3: Re-add constraint (now allowing NULL)
ALTER TABLE io_neruda_content_configurations
ADD CONSTRAINT io_neruda_content_configurations_project_id_fkey
FOREIGN KEY (project_id) REFERENCES io_neruda_projects(id) ON DELETE CASCADE;

-- Step 4: Add documentation
COMMENT ON COLUMN io_neruda_content_configurations.project_id
IS 'Foreign key to project, nullable to allow global configurations';
```

### Step 4: Execute
Click the **▶️ Run** button (or `Ctrl+Enter`)

### Step 5: Confirm Success
- You should see: "Query executed successfully"
- No errors displayed

---

## ✅ What This Does

| Before | After |
|--------|-------|
| `project_id` NOT NULL | `project_id` nullable |
| Requires project | Optional project |
| Cannot create global configs | Can create global configs |

---

## 🧪 Verify It Worked

After executing, restart backend and run test:

```powershell
cd E:\git\app\tools\io-neruda\backend
node server.js

# In another terminal:
.\test-endpoints-minimal.ps1
```

Expected result: **✅ All 3 tests should PASS**

---

## 🆘 If Something Goes Wrong

### Error: "ALTER TABLE ... does not exist"
- Make sure you're in the correct database
- Database should be: `postgres` (default)

### Error: "Constraint does not exist"
- The constraint name might be different
- Check table definition: 
  1. Left sidebar → Tables
  2. Click `io_neruda_content_configurations`
  3. Look for FK constraints

### Error: "Cannot drop constraint"
- Make sure no other tables reference this column
- All dependencies should be auto-managed

---

## 📋 Alternative: Direct Table Edit

If SQL doesn't work, you can edit via UI:

1. Go to **Tables** → `io_neruda_content_configurations`
2. Click **Design**
3. Click `project_id` column
4. Under "Constraints", toggle **Required** to OFF
5. Save

---

## ✨ Time to Fix
- **Execution time:** 5-10 seconds
- **UI interaction:** 2 minutes total
- **Restart backend:** 1 minute
- **Re-test:** 1 minute

**Total time:** ~5 minutes ⚡

---

**Status:** ⏳ Waiting for manual SQL execution  
**Next step:** Restart backend → Run tests → Begin Phase 2

📞 Contact if issues arise!
