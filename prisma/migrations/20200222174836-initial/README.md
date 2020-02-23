# Migration `20200222174836-initial`

This migration has been generated by Richard Ward at 2/22/2020, 5:48:36 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "QuestionType" AS ENUM ('TEXT', 'DROPDOWN', 'TOGGLE', 'TEXTAREA');

CREATE TABLE "public"."User" (
    "contact" text   ,
    "email" text  NOT NULL DEFAULT '',
    "id" text  NOT NULL ,
    "name" text  NOT NULL DEFAULT '',
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."Question" (
    "active" boolean  NOT NULL DEFAULT false,
    "createdAt" timestamp(3)  NOT NULL DEFAULT '1970-01-01 00:00:00',
    "id" text  NOT NULL ,
    "label" text  NOT NULL DEFAULT '',
    "order" integer  NOT NULL DEFAULT 0,
    "type" "QuestionType" NOT NULL DEFAULT 'TEXT',
    "updateddAt" timestamp(3)  NOT NULL DEFAULT '1970-01-01 00:00:00',
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."Answer" (
    "answer" text  NOT NULL DEFAULT '',
    "createdAt" timestamp(3)  NOT NULL DEFAULT '1970-01-01 00:00:00',
    "id" text  NOT NULL ,
    "question" text  NOT NULL ,
    "updatedAt" timestamp(3)  NOT NULL DEFAULT '1970-01-01 00:00:00',
    "user" text  NOT NULL ,
    PRIMARY KEY ("id")
) 

CREATE UNIQUE INDEX "User.email" ON "public"."User"("email")

CREATE UNIQUE INDEX "Question.order" ON "public"."Question"("order")

ALTER TABLE "public"."Answer" ADD FOREIGN KEY ("user")REFERENCES "public"."User"("id") ON DELETE RESTRICT  ON UPDATE CASCADE

ALTER TABLE "public"."Answer" ADD FOREIGN KEY ("question")REFERENCES "public"."Question"("id") ON DELETE RESTRICT  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200222174836-initial
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,42 @@
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+datasource db {
+  provider = "postgresql"
+  url      = env("DATABASE_URL")
+}
+
+generator client {
+  provider      = "prisma-client-js"
+  binaryTargets = ["native", "rhel-openssl-1.0.x"]
+}
+
+enum QuestionType {
+  TEXT DROPDOWN TOGGLE TEXTAREA
+}
+
+model User {
+  id      String  @id @default(cuid())
+  name    String
+  email   String  @unique
+  contact String?
+}
+
+model Question {
+  id         String       @id @default(cuid())
+  order      Int          @unique
+  label      String
+  type       QuestionType
+  active     Boolean
+  createdAt  DateTime     @default(now())
+  updateddAt DateTime     @default(now())
+}
+
+model Answer {
+  id        String   @id @default(cuid())
+  question  Question
+  user      User
+  answer    String
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+}
```

