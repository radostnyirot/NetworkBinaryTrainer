import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Table for sessions (needed for auth persistence)
export const sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: text("sess").notNull(),
  expire: timestamp("expire", { mode: "date" }).notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  language: text("language").notNull().default("ru"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  moduleId: text("module_id").notNull(),
  lessonId: text("lesson_id").notNull(),
  completed: boolean("completed").notNull().default(false),
  score: integer("score").notNull().default(0),
  completedAt: timestamp("completed_at", { mode: "date" }),
});

export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  issueDate: timestamp("issue_date", { mode: "date" }).defaultNow(),
  certificateNumber: text("certificate_number").notNull().unique(),
  completionDate: timestamp("completion_date", { mode: "date" }).notNull(),
  totalScore: integer("total_score").notNull(),
});

export const modules = pgTable("modules", {
  id: text("id").primaryKey(),
  nameRu: text("name_ru").notNull(),
  nameEn: text("name_en").notNull(),
  descriptionRu: text("description_ru"),
  descriptionEn: text("description_en"),
  order: integer("order").notNull(),
});

export const lessons = pgTable("lessons", {
  id: text("id").primaryKey(),
  moduleId: text("module_id").notNull().references(() => modules.id),
  nameRu: text("name_ru").notNull(),
  nameEn: text("name_en").notNull(),
  contentRu: text("content_ru"),
  contentEn: text("content_en"),
  order: integer("order").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  language: true,
});

export const insertProgressSchema = createInsertSchema(progress).pick({
  userId: true,
  moduleId: true,
  lessonId: true,
  completed: true,
  score: true,
});

export const insertCertificateSchema = createInsertSchema(certificates).pick({
  userId: true, 
  certificateNumber: true,
  completionDate: true,
  totalScore: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Progress = typeof progress.$inferSelect;
export type Module = typeof modules.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;

// Module IDs
export const BINARY_BASICS_MODULE = "binary-basics";
export const IP_ADDRESSES_MODULE = "ip-addresses";
export const SUBNET_MASKS_MODULE = "subnet-masks";
export const NETWORK_DESIGN_MODULE = "network-design";

// Lesson IDs
export const BINARY_INTRO_LESSON = "binary-intro";
export const BINARY_PRACTICE_LESSON = "binary-practice";
export const BINARY_CONVERSION_LESSON = "binary-conversion";
export const IP_STRUCTURE_LESSON = "ip-structure";
export const IP_BUILDING_LESSON = "ip-building";
export const IP_CLASSES_LESSON = "ip-classes";
export const SUBNET_INTRO_LESSON = "subnet-intro";
export const SUBNET_CALCULATION_LESSON = "subnet-calculation";
export const SUBNET_PLANNING_LESSON = "subnet-planning";
export const NETWORK_PLANNING_LESSON = "network-planning";
export const NETWORK_IMPLEMENTATION_LESSON = "network-implementation";
