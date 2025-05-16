import { 
  users, 
  progress, 
  modules, 
  lessons, 
  certificates,
  type User, 
  type InsertUser, 
  type Progress, 
  type Module, 
  type Lesson,
  type Certificate,
  type InsertCertificate 
} from "@shared/schema";
import { db } from "./db";
import { and, eq } from "drizzle-orm";
import * as utils from "./utils";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserProgress(userId: number): Promise<Progress[]>;
  updateProgress(userId: number, moduleId: string, lessonId: string, completed: boolean, score: number): Promise<Progress>;
  getModules(): Promise<Module[]>;
  getLessons(moduleId: string): Promise<Lesson[]>;
  getCertificate(userId: number): Promise<Certificate | undefined>;
  createCertificate(userId: number, totalScore: number): Promise<Certificate>;
  getUserCompletedLessons(userId: number): Promise<number>;
  getTotalLessonsCount(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async initializeData(): Promise<void> {
    // Check if modules exist
    const existingModules = await db.select().from(modules);
    
    if (existingModules.length === 0) {
      // Add modules
      const modulesList = [
        { id: "binary-basics", nameRu: "Бинарные кубики", nameEn: "Binary Blocks", order: 1, 
          descriptionRu: "Изучите основы двоичной системы счисления", 
          descriptionEn: "Learn the basics of binary number system" },
        { id: "ip-addresses", nameRu: "IP-адреса", nameEn: "IP Addresses", order: 2,
          descriptionRu: "Разберитесь в структуре IP-адресов", 
          descriptionEn: "Understand the structure of IP addresses" },
        { id: "subnet-masks", nameRu: "Маски подсети", nameEn: "Subnet Masks", order: 3,
          descriptionRu: "Изучите, как работают маски подсети", 
          descriptionEn: "Learn how subnet masks work" },
        { id: "network-design", nameRu: "Проектирование", nameEn: "Network Design", order: 4,
          descriptionRu: "Применяйте полученные знания для проектирования сетей", 
          descriptionEn: "Apply your knowledge to design networks" }
      ];
      
      await db.insert(modules).values(modulesList);
      
      // Add lessons
      const lessonsList = [
        { id: "binary-intro", moduleId: "binary-basics", nameRu: "Основы двоичной системы", nameEn: "Binary Basics", order: 1,
          contentRu: "Введение в двоичную систему", contentEn: "Introduction to binary system" },
        { id: "binary-practice", moduleId: "binary-basics", nameRu: "Практика с бинарными числами", nameEn: "Binary Practice", order: 2,
          contentRu: "Практические задания по преобразованию чисел", contentEn: "Practical exercises on number conversion" },
        { id: "binary-conversion", moduleId: "binary-basics", nameRu: "Конвертация между системами", nameEn: "Number System Conversion", order: 3,
          contentRu: "Конвертация между двоичной, десятичной и шестнадцатеричной системами", contentEn: "Converting between binary, decimal and hexadecimal" },
        { id: "ip-structure", moduleId: "ip-addresses", nameRu: "Структура IP-адреса", nameEn: "IP Address Structure", order: 1,
          contentRu: "Изучение структуры IPv4 адресов", contentEn: "Learning the structure of IPv4 addresses" },
        { id: "ip-building", moduleId: "ip-addresses", nameRu: "Построение IP-адресов", nameEn: "Building IP Addresses", order: 2,
          contentRu: "Практика по составлению IP-адресов", contentEn: "Practice in building IP addresses" },
        { id: "ip-classes", moduleId: "ip-addresses", nameRu: "Классы IP-адресов", nameEn: "IP Address Classes", order: 3,
          contentRu: "Изучение классов IP-адресов (A, B, C, D, E)", contentEn: "Learning IP address classes (A, B, C, D, E)" },
        { id: "subnet-intro", moduleId: "subnet-masks", nameRu: "Введение в маски подсети", nameEn: "Subnet Mask Introduction", order: 1,
          contentRu: "Основные концепции масок подсети", contentEn: "Basic concepts of subnet masks" },
        { id: "subnet-calculation", moduleId: "subnet-masks", nameRu: "Расчет подсетей", nameEn: "Subnet Calculations", order: 2,
          contentRu: "Расчеты подсетей и доступных хостов", contentEn: "Subnet calculations and available hosts" },
        { id: "subnet-planning", moduleId: "subnet-masks", nameRu: "Планирование подсетей", nameEn: "Subnet Planning", order: 3,
          contentRu: "Планирование подсетей для различных сценариев", contentEn: "Planning subnets for different scenarios" },
        { id: "network-planning", moduleId: "network-design", nameRu: "Планирование сети", nameEn: "Network Planning", order: 1,
          contentRu: "Основы планирования сетей", contentEn: "Basics of network planning" },
        { id: "network-implementation", moduleId: "network-design", nameRu: "Реализация сети", nameEn: "Network Implementation", order: 2,
          contentRu: "Практические упражнения по реализации сетей", contentEn: "Practical exercises on network implementation" }
      ];
      
      await db.insert(lessons).values(lessonsList);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result.length > 0 ? result[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result.length > 0 ? result[0] : undefined;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result.length > 0 ? result[0] : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  
  async getUserProgress(userId: number): Promise<Progress[]> {
    return db.select().from(progress).where(eq(progress.userId, userId));
  }
  
  async updateProgress(
    userId: number,
    moduleId: string, 
    lessonId: string, 
    completed: boolean, 
    score: number
  ): Promise<Progress> {
    // Check if progress already exists
    const existing = await db.select().from(progress).where(
      and(
        eq(progress.userId, userId),
        eq(progress.moduleId, moduleId),
        eq(progress.lessonId, lessonId)
      )
    );
    
    if (existing.length > 0) {
      // Update existing progress
      const [updated] = await db.update(progress)
        .set({ 
          completed, 
          score,
          completedAt: completed ? new Date() : null
        })
        .where(eq(progress.id, existing[0].id))
        .returning();
      
      return updated;
    } else {
      // Create new progress
      const [created] = await db.insert(progress)
        .values({
          userId,
          moduleId,
          lessonId,
          completed,
          score,
          completedAt: completed ? new Date() : null
        })
        .returning();
      
      return created;
    }
  }
  
  async getModules(): Promise<Module[]> {
    return db.select().from(modules).orderBy(modules.order);
  }
  
  async getLessons(moduleId: string): Promise<Lesson[]> {
    return db.select()
      .from(lessons)
      .where(eq(lessons.moduleId, moduleId))
      .orderBy(lessons.order);
  }
  
  async getCertificate(userId: number): Promise<Certificate | undefined> {
    const result = await db.select().from(certificates).where(eq(certificates.userId, userId));
    return result.length > 0 ? result[0] : undefined;
  }
  
  async createCertificate(userId: number, totalScore: number): Promise<Certificate> {
    const certificateNumber = utils.generateCertificateNumber(userId);
    
    const [certificate] = await db.insert(certificates)
      .values({
        userId,
        certificateNumber,
        completionDate: new Date(),
        totalScore
      })
      .returning();
    
    return certificate;
  }
  
  async getUserCompletedLessons(userId: number): Promise<number> {
    const result = await db.select()
      .from(progress)
      .where(and(
        eq(progress.userId, userId),
        eq(progress.completed, true)
      ));
    
    return result.length;
  }
  
  async getTotalLessonsCount(): Promise<number> {
    const result = await db.select().from(lessons);
    return result.length;
  }
}

export const storage = new DatabaseStorage();
