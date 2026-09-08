import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { 
  ConflictSchema, 
  PersonSchema, 
  OperationSchema, 
  EquipmentSchema, 
  SourceRecordSchema, 
} from '../src/lib/schemas';

const CONTENT_DIR = path.join(process.cwd(), 'content');

type ValidationSchema = {
  safeParse(input: unknown):
    | { success: true; data: unknown }
    | { success: false; error: { issues: Array<{ path: PropertyKey[]; message: string }> } };
};

const schemas: Record<string, ValidationSchema> = {
  conflicts: ConflictSchema,
  people: PersonSchema,
  operations: OperationSchema,
  equipment: EquipmentSchema,
  sources: SourceRecordSchema,
};

function validateDirectory(dirName: string) {
  const schema = schemas[dirName];
  if (!schema) return 0;
  
  const dirPath = path.join(CONTENT_DIR, dirName);
  if (!fs.existsSync(dirPath)) return 0;

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  let errors = 0;

  console.log(`Validating ${files.length} files in /${dirName}...`);
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(content);
    
    const result = schema.safeParse(data);
    
    if (!result.success) {
      console.error(`\n❌ Validation failed for ${dirName}/${file}:`);
      result.error.issues.forEach((issue) => {
        console.error(`  - [${issue.path.join('.')}] ${issue.message}`);
      });
      errors++;
    }
  });
  
  return errors;
}

function main() {
  console.log("Starting content validation...");
  let totalErrors = 0;
  
  for (const dir of Object.keys(schemas)) {
    totalErrors += validateDirectory(dir);
  }
  
  if (totalErrors > 0) {
    console.error(`\nValidation failed with ${totalErrors} errors.`);
    process.exitCode = 1;
  } else {
    console.log("\n✅ All content valid!");
  }
}

main();
