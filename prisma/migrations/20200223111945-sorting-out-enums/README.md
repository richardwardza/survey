# Migration `20200223111945-sorting-out-enums`

This migration has been generated by Richard Ward at 2/23/2020, 11:19:45 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "QuestionType_new" AS ENUM ('TEXT', 'DROPDOWN', 'BOOLEAN', 'TEXTAREA', 'EMAIL', 'DATE');
ALTER TABLE "public"."Question" ALTER COLUMN "questionType" DROP DEFAULT,
                        ALTER COLUMN "questionType" TYPE "QuestionType_new" USING (QuestionType::text::"QuestionType_new"),
                        ALTER COLUMN "questionType" SET DEFAULT 'TEXT';
ALTER TYPE "QuestionType" RENAME TO "QuestionType_old";
ALTER TYPE "QuestionType_new" RENAME TO "QuestionType";
DROP TYPE "QuestionType_old"
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200223111308-adding-email-enum..20200223111945-sorting-out-enums
--- datamodel.dml
+++ datamodel.dml
@@ -2,18 +2,18 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = env("DATABASE_URL")
 }
 generator client {
   provider      = "prisma-client-js"
   binaryTargets = ["native", "rhel-openssl-1.0.x"]
 }
 enum QuestionType {
-  TEXT DROPDOWN TOGGLE TEXTAREA EMAIL
+  TEXT DROPDOWN TOGGLE TEXTAREA EMAIL DATE
 }
 model User {
   id      String  @id @default(cuid())
```
