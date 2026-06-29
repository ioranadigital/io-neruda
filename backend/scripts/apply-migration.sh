#!/bin/bash
# ====================================================================
# Script: Aplicar migraciones de Supabase
# Uso: ./scripts/apply-migration.sh [migration-number]
# ====================================================================

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
MIGRATIONS_DIR="./supabase-migrations"
PROJECT_ID="${SUPABASE_PROJECT_ID:-}"

# Defaults
MIGRATION="${1:-002}"

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Supabase Migration Runner${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Check if migrations directory exists
if [ ! -d "$MIGRATIONS_DIR" ]; then
  echo -e "${RED}Error: $MIGRATIONS_DIR directory not found${NC}"
  exit 1
fi

# Find migration file
MIGRATION_FILE=$(find "$MIGRATIONS_DIR" -name "${MIGRATION}*.sql" | head -1)

if [ -z "$MIGRATION_FILE" ]; then
  echo -e "${RED}Error: Migration file not found for pattern: ${MIGRATION}*.sql${NC}"
  echo "Available files:"
  ls -1 "$MIGRATIONS_DIR"
  exit 1
fi

echo -e "${GREEN}✓ Found migration: $MIGRATION_FILE${NC}"
echo ""

# Check Supabase CLI
if ! command -v supabase &> /dev/null; then
  echo -e "${RED}Error: supabase CLI not installed${NC}"
  echo "Install with: npm install -g @supabase/supabase-cli"
  exit 1
fi

echo -e "${BLUE}Running migration...${NC}"
echo ""

# Check if PROJECT_ID is set
if [ -z "$PROJECT_ID" ]; then
  echo -e "${BLUE}Using local Supabase instance${NC}"
  supabase db execute --file "$MIGRATION_FILE"
else
  echo -e "${BLUE}Using remote project: $PROJECT_ID${NC}"
  supabase db execute --file "$MIGRATION_FILE" --project-id "$PROJECT_ID"
fi

echo ""
echo -e "${GREEN}✓ Migration completed successfully!${NC}"
echo ""
echo -e "${BLUE}Verification queries:${NC}"
echo ""
echo "SELECT COUNT(*) as total_clients FROM clients;"
echo "SELECT COUNT(*) as total_configs WITH client_id FROM content_configurations WHERE client_id IS NOT NULL;"
echo ""
