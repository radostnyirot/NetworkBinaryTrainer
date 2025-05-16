import * as schema from "./shared/schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from "ws";

neonConfig.webSocketConstructor = ws;

async function main() {
  console.log("Начало миграции...");
  
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
  }
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });
  
  // Выполняем миграцию БД на основе схемы
  console.log("Создание таблиц...");
  
  try {
    // Использование drizzle.schema позволяет создать таблицы напрямую из схемы
    await db.execute(schema.sessions.createIfNotExists());
    await db.execute(schema.users.createIfNotExists());
    await db.execute(schema.modules.createIfNotExists());
    await db.execute(schema.lessons.createIfNotExists());
    await db.execute(schema.progress.createIfNotExists());
    await db.execute(schema.certificates.createIfNotExists());
    
    console.log("Миграция завершена успешно!");
  } catch (error) {
    console.error("Ошибка при миграции:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

main().catch(console.error);