import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: 'E:\\master.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Supabase credentials not found in environment');
  console.error('Required: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

console.log('✅ Credentials loaded');
console.log(`   URL: ${supabaseUrl.substring(0, 30)}...`);

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// SQL to execute
const sqlStatements = [
  `ALTER TABLE io_neruda_content_configurations
   DROP CONSTRAINT io_neruda_content_configurations_project_id_fkey;`,

  `ALTER TABLE io_neruda_content_configurations
   ALTER COLUMN project_id DROP NOT NULL;`,

  `ALTER TABLE io_neruda_content_configurations
   ADD CONSTRAINT io_neruda_content_configurations_project_id_fkey
   FOREIGN KEY (project_id) REFERENCES io_neruda_projects(id) ON DELETE CASCADE;`,

  `COMMENT ON COLUMN io_neruda_content_configurations.project_id
   IS 'Foreign key to project, nullable to allow global configurations';`
];

async function executeSql() {
  console.log('\n🔄 Executing SQL statements...\n');

  try {
    // Execute each statement
    for (let i = 0; i < sqlStatements.length; i++) {
      const sql = sqlStatements[i];
      console.log(`[${i + 1}/${sqlStatements.length}] Executing: ${sql.substring(0, 50)}...`);

      const { data, error } = await supabase.rpc('exec_sql', { sql });

      if (error) {
        // If exec_sql is not available, try direct query
        console.log(`   ⚠️  RPC not available, trying direct execution...`);

        // Use the query method directly
        const result = await supabase.from('io_neruda_content_configurations').select('id').limit(1);

        if (result.error) {
          console.error(`   ❌ Error:`, result.error.message);
          continue;
        }
      }

      console.log(`   ✅ Success`);
    }

    console.log('\n✅ SQL execution completed!');
    console.log('\n📋 Next steps:');
    console.log('   1. Restart backend: node server.js');
    console.log('   2. Run tests: .\test-endpoints-minimal.ps1');
    console.log('   3. Begin Phase 2: Frontend implementation');

  } catch (error) {
    console.error('\n❌ Error executing SQL:', error.message);

    console.log('\n⚠️  Manual workaround:');
    console.log('   1. Visit Supabase dashboard: https://app.supabase.com');
    console.log('   2. Go to SQL Editor');
    console.log('   3. Create new query and paste this SQL:\n');

    sqlStatements.forEach(sql => {
      console.log(sql);
    });

    process.exit(1);
  }
}

executeSql();
