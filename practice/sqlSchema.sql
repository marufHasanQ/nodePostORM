CREATE DATABASE "TEST2";

\c "TEST2";

CREATE TABLE "table_name" (
         "id" INTEGER,
         "name" TEXT,
         PRIMARY KEY ("id")

  );

INSERT INTO "table_name" VALUES (5, 'user1'), (6, 'user2');

