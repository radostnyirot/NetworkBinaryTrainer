import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertProgressSchema,
  insertCertificateSchema,
  insertUserSchema as registerSchema
} from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { hash, compare } from "bcrypt";
import { pool } from "./db";
import { z } from "zod";

// Создаем схему валидации для регистрации
const extendedRegisterSchema = registerSchema.extend({
  password: z.string().min(6, "Пароль должен содержать не менее 6 символов"),
  email: z.string().email("Некорректный формат email"),
  passwordConfirm: z.string()
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Пароли не совпадают",
  path: ["passwordConfirm"]
});

// Используем PostgreSQL для хранения сессий
const PgStore = connectPg(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Инициализируем данные, если базы пустые
  await storage.initializeData();
  
  // Настройка сессий с использованием PostgreSQL
  app.use(
    session({
      store: new PgStore({
        pool,
        tableName: 'sessions',
        createTableIfMissing: true
      }),
      secret: process.env.SESSION_SECRET || "netbits-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: { 
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
      }
    })
  );

  // Настройка Passport.js
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Проверяем, является ли username емейлом
        const isEmail = username.includes('@');
        
        let user;
        if (isEmail) {
          user = await storage.getUserByEmail(username);
        } else {
          user = await storage.getUserByUsername(username);
        }
        
        if (!user) {
          return done(null, false, { message: isEmail ? "Email не найден" : "Пользователь не найден" });
        }
        
        // Используем bcrypt для проверки пароля
        const passwordMatch = await compare(password, user.password);
        if (!passwordMatch) {
          return done(null, false, { message: "Неверный пароль" });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // API-маршруты
  
  // Регистрация нового пользователя
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      const userData = extendedRegisterSchema.parse(req.body);
      
      // Проверяем, существует ли пользователь с таким именем
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(409).json({ message: "Имя пользователя уже занято" });
      }
      
      // Проверяем, существует ли пользователь с таким email
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(409).json({ message: "Email уже зарегистрирован" });
      }
      
      // Хэшируем пароль
      const hashedPassword = await hash(userData.password, 10);
      
      // Создаем пользователя (без passwordConfirm)
      const { passwordConfirm, ...userDataWithoutConfirm } = userData;
      const user = await storage.createUser({
        ...userDataWithoutConfirm,
        password: hashedPassword
      });
      
      // Исключаем пароль из ответа
      const { password, ...userWithoutPassword } = user;
      
      // Авторизуем пользователя после регистрации
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Ошибка при авторизации после регистрации" });
        }
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Ошибка валидации", 
          errors: error.errors 
        });
      }
      
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      
      return res.status(500).json({ message: "Произошла неизвестная ошибка" });
    }
  });

  // Авторизация пользователя
  app.post("/api/login", (req: Request, res: Response, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      
      if (!user) {
        return res.status(401).json({ message: info?.message || "Ошибка авторизации" });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        
        const { password, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  // Выход пользователя
  app.get("/api/logout", (req: Request, res: Response) => {
    req.logout(() => {
      res.status(200).json({ message: "Выход выполнен успешно" });
    });
  });

  // Получение данных текущего пользователя
  app.get("/api/user", (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Не авторизован" });
    }
    
    const { password, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });

  // Получение всех модулей
  app.get("/api/modules", async (_req: Request, res: Response) => {
    try {
      const modules = await storage.getModules();
      res.json(modules);
    } catch (error) {
      res.status(500).json({ message: "Не удалось получить модули" });
    }
  });

  // Получение уроков для модуля
  app.get("/api/lessons/:moduleId", async (req: Request, res: Response) => {
    try {
      const { moduleId } = req.params;
      const lessons = await storage.getLessons(moduleId);
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: "Не удалось получить уроки" });
    }
  });

  // Получение прогресса пользователя
  app.get("/api/progress", async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Не авторизован" });
    }
    
    try {
      const userId = (req.user as any).id;
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Не удалось получить прогресс" });
    }
  });

  // Обновление прогресса пользователя
  app.post("/api/progress", async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Не авторизован" });
    }
    
    try {
      const userId = (req.user as any).id;
      const { moduleId, lessonId, completed, score } = req.body;
      
      const updatedProgress = await storage.updateProgress(
        userId,
        moduleId,
        lessonId,
        completed || false,
        score || 0
      );
      
      res.json(updatedProgress);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Произошла неизвестная ошибка" });
      }
    }
  });

  // Обновление языка пользователя
  app.put("/api/user/language", async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Не авторизован" });
    }
    
    try {
      const { language } = req.body;
      if (language !== 'ru' && language !== 'en') {
        return res.status(400).json({ message: "Недопустимый язык" });
      }
      
      const userId = (req.user as any).id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }
      
      const updatedUser = await storage.createUser({
        ...user,
        language
      });
      
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Не удалось обновить языковые настройки" });
    }
  });

  // Получение сертификата пользователя
  app.get("/api/certificate", async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Не авторизован" });
    }
    
    try {
      const userId = (req.user as any).id;
      const certificate = await storage.getCertificate(userId);
      
      if (!certificate) {
        return res.status(404).json({ message: "Сертификат не найден" });
      }
      
      res.json(certificate);
    } catch (error) {
      res.status(500).json({ message: "Не удалось получить сертификат" });
    }
  });

  // Создание сертификата для пользователя
  app.post("/api/certificate", async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Не авторизован" });
    }
    
    try {
      const userId = (req.user as any).id;
      
      // Проверяем, существует ли уже сертификат
      const existingCertificate = await storage.getCertificate(userId);
      
      if (existingCertificate) {
        return res.status(409).json({ 
          message: "Сертификат уже существует", 
          certificate: existingCertificate 
        });
      }
      
      // Проверяем, завершил ли пользователь все уроки
      const completedLessons = await storage.getUserCompletedLessons(userId);
      const totalLessons = await storage.getTotalLessonsCount();
      
      if (completedLessons < totalLessons) {
        return res.status(400).json({ 
          message: "Необходимо завершить все уроки для получения сертификата",
          completed: completedLessons,
          total: totalLessons
        });
      }
      
      // Рассчитываем общий балл (среднее значение из всех уроков)
      const progress = await storage.getUserProgress(userId);
      const totalScore = Math.round(
        progress.reduce((sum, p) => sum + p.score, 0) / progress.length
      );
      
      // Создаем сертификат
      const certificate = await storage.createCertificate(userId, totalScore);
      
      res.status(201).json(certificate);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Произошла неизвестная ошибка" });
      }
    }
  });

  // Получение статистики прогресса
  app.get("/api/progress/stats", async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Не авторизован" });
    }
    
    try {
      const userId = (req.user as any).id;
      const completedLessons = await storage.getUserCompletedLessons(userId);
      const totalLessons = await storage.getTotalLessonsCount();
      const progress = await storage.getUserProgress(userId);
      
      const averageScore = progress.length > 0
        ? Math.round(progress.reduce((sum, p) => sum + p.score, 0) / progress.length)
        : 0;
      
      res.json({
        completedLessons,
        totalLessons,
        completionPercentage: Math.round((completedLessons / totalLessons) * 100),
        averageScore
      });
    } catch (error) {
      res.status(500).json({ message: "Не удалось получить статистику" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
