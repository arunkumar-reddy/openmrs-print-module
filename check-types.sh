#!/bin/bash
echo "Checking TypeScript errors in source files..."
errors=$(npx tsc --noEmit 2>&1 | grep -E "^src/" | wc -l)
if [ $errors -eq 0 ]; then
  echo "✓ No TypeScript errors in source files"
  exit 0
else
  echo "✗ Found $errors TypeScript errors in source files"
  npx tsc --noEmit 2>&1 | grep -E "^src/"
  exit 1
fi
