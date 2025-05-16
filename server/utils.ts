import * as crypto from 'crypto';
import { z } from 'zod';

/**
 * Генерирует уникальный номер сертификата
 * @param userId ID пользователя
 * @returns Строка с номером сертификата
 */
export function generateCertificateNumber(userId: number): string {
  const prefix = "NB"; // NetBits
  const timestamp = Date.now().toString().slice(-6);
  const userPart = userId.toString().padStart(4, "0");
  const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  
  return `${prefix}-${timestamp}-${userPart}-${randomPart}`;
}

/**
 * Хэширует пароль с использованием bcrypt
 * @param password Пароль в открытом виде
 * @returns Хэшированный пароль
 */
export function hashPassword(password: string): Promise<string> {
  // Импортируем bcrypt динамически для предотвращения ошибок при загрузке
  return import('bcrypt').then(bcrypt => {
    return bcrypt.hash(password, 10);
  });
}

/**
 * Проверяет соответствие пароля хэшу
 * @param password Пароль в открытом виде
 * @param hash Хэшированный пароль
 * @returns true, если пароль соответствует хэшу
 */
export function comparePassword(password: string, hash: string): Promise<boolean> {
  return import('bcrypt').then(bcrypt => {
    return bcrypt.compare(password, hash);
  });
}

/**
 * Генерирует случайный токен
 * @param length Длина токена
 * @returns Случайный токен
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Валидирует email
 * @param email Email для проверки
 * @returns true, если email валиден
 */
export function isValidEmail(email: string): boolean {
  const emailSchema = z.string().email();
  try {
    emailSchema.parse(email);
    return true;
  } catch (error) {
    return false;
  }
}