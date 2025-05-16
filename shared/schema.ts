import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  language: text("language").notNull().default("ru"),
});

export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  moduleId: text("module_id").notNull(),
  lessonId: text("lesson_id").notNull(),
  completed: boolean("completed").notNull().default(false),
  score: integer("score").notNull().default(0),
});

export const modules = pgTable("modules", {
  id: text("id").primaryKey(),
  nameRu: text("name_ru").notNull(),
  nameEn: text("name_en").notNull(),
  order: integer("order").notNull(),
});

export const lessons = pgTable("lessons", {
  id: text("id").primaryKey(),
  moduleId: text("module_id").notNull().references(() => modules.id),
  nameRu: text("name_ru").notNull(),
  nameEn: text("name_en").notNull(),
  order: integer("order").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  language: true,
});

export const insertProgressSchema = createInsertSchema(progress).pick({
  userId: true,
  moduleId: true,
  lessonId: true,
  completed: true,
  score: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Progress = typeof progress.$inferSelect;
export type Module = typeof modules.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;

// Module IDs
export const BINARY_BASICS_MODULE = "binary-basics";
export const IP_ADDRESSES_MODULE = "ip-addresses";
export const SUBNET_MASKS_MODULE = "subnet-masks";
export const NETWORK_DESIGN_MODULE = "network-design";

// Lesson IDs
export const BINARY_INTRO_LESSON = "binary-intro";
export const BINARY_PRACTICE_LESSON = "binary-practice";
export const IP_STRUCTURE_LESSON = "ip-structure";
export const IP_BUILDING_LESSON = "ip-building";
export const SUBNET_INTRO_LESSON = "subnet-intro";
export const SUBNET_CALCULATION_LESSON = "subnet-calculation";
