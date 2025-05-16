import { users, progress, modules, lessons, type User, type InsertUser, type Progress, type Module, type Lesson } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserProgress(userId: number): Promise<Progress[]>;
  updateProgress(progressData: Progress): Promise<Progress>;
  getModules(): Promise<Module[]>;
  getLessons(moduleId: string): Promise<Lesson[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private progressItems: Map<number, Progress>;
  private moduleItems: Map<string, Module>;
  private lessonItems: Map<string, Lesson>;
  
  currentId: number;
  currentProgressId: number;

  constructor() {
    this.users = new Map();
    this.progressItems = new Map();
    this.moduleItems = new Map();
    this.lessonItems = new Map();
    this.currentId = 1;
    this.currentProgressId = 1;
    
    // Initialize with default modules and lessons
    this.initializeData();
  }

  private initializeData() {
    // Add modules
    const modulesList: Module[] = [
      { id: "binary-basics", nameRu: "Бинарные кубики", nameEn: "Binary Blocks", order: 1 },
      { id: "ip-addresses", nameRu: "IP-адреса", nameEn: "IP Addresses", order: 2 },
      { id: "subnet-masks", nameRu: "Маски подсети", nameEn: "Subnet Masks", order: 3 },
      { id: "network-design", nameRu: "Проектирование", nameEn: "Network Design", order: 4 }
    ];
    
    for (const module of modulesList) {
      this.moduleItems.set(module.id, module);
    }
    
    // Add lessons
    const lessonsList: Lesson[] = [
      { id: "binary-intro", moduleId: "binary-basics", nameRu: "Основы двоичной системы", nameEn: "Binary Basics", order: 1 },
      { id: "binary-practice", moduleId: "binary-basics", nameRu: "Практика с бинарными числами", nameEn: "Binary Practice", order: 2 },
      { id: "ip-structure", moduleId: "ip-addresses", nameRu: "Структура IP-адреса", nameEn: "IP Address Structure", order: 1 },
      { id: "ip-building", moduleId: "ip-addresses", nameRu: "Построение IP-адресов", nameEn: "Building IP Addresses", order: 2 },
      { id: "subnet-intro", moduleId: "subnet-masks", nameRu: "Введение в маски подсети", nameEn: "Subnet Mask Introduction", order: 1 },
      { id: "subnet-calculation", moduleId: "subnet-masks", nameRu: "Расчет подсетей", nameEn: "Subnet Calculations", order: 2 },
      { id: "network-planning", moduleId: "network-design", nameRu: "Планирование сети", nameEn: "Network Planning", order: 1 },
      { id: "network-implementation", moduleId: "network-design", nameRu: "Реализация сети", nameEn: "Network Implementation", order: 2 }
    ];
    
    for (const lesson of lessonsList) {
      this.lessonItems.set(lesson.id, lesson);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getUserProgress(userId: number): Promise<Progress[]> {
    return Array.from(this.progressItems.values()).filter(
      (progress) => progress.userId === userId
    );
  }
  
  async updateProgress(progressData: Progress): Promise<Progress> {
    // Check if progress exists for this user, module, and lesson
    const existingProgress = Array.from(this.progressItems.values()).find(
      (p) => p.userId === progressData.userId && 
             p.moduleId === progressData.moduleId && 
             p.lessonId === progressData.lessonId
    );
    
    if (existingProgress) {
      // Update existing progress
      const updatedProgress: Progress = {
        ...existingProgress,
        completed: progressData.completed,
        score: progressData.score
      };
      this.progressItems.set(existingProgress.id, updatedProgress);
      return updatedProgress;
    } else {
      // Create new progress entry
      const id = this.currentProgressId++;
      const newProgress: Progress = { ...progressData, id };
      this.progressItems.set(id, newProgress);
      return newProgress;
    }
  }
  
  async getModules(): Promise<Module[]> {
    return Array.from(this.moduleItems.values()).sort((a, b) => a.order - b.order);
  }
  
  async getLessons(moduleId: string): Promise<Lesson[]> {
    return Array.from(this.lessonItems.values())
      .filter((lesson) => lesson.moduleId === moduleId)
      .sort((a, b) => a.order - b.order);
  }
}

export const storage = new MemStorage();
