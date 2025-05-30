import { z } from "zod";

// Common validation patterns
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[\d\s-()]{10,15}$/,
  indianPhone: /^[6-9]\d{9}$/,
  name: /^[a-zA-Z\s]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  date: /^\d{4}-\d{2}-\d{2}$/,
  time: /^\d{2}:\d{2}$/,
};

// Common validation messages
export const validationMessages = {
  required: (field: string) => `${field} is required`,
  minLength: (field: string, min: number) => `${field} must be at least ${min} characters`,
  maxLength: (field: string, max: number) => `${field} must be less than ${max} characters`,
  email: "Please enter a valid email address",
  phone: "Please enter a valid phone number",
  indianPhone: "Please enter a valid 10-digit Indian mobile number",
  name: "Name can only contain letters and spaces",
  password: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  passwordMatch: "Passwords don't match",
  date: "Please enter a valid date",
  time: "Please enter a valid time",
  number: "Please enter a valid number",
  positive: "Value must be positive",
};

// Utility functions for form validation
export const validateEmail = (email: string): boolean => {
  return validationPatterns.email.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return validationPatterns.phone.test(phone);
};

export const validateIndianPhone = (phone: string): boolean => {
  return validationPatterns.indianPhone.test(phone);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8 && validationPatterns.password.test(password);
};

export const validateName = (name: string): boolean => {
  return name.length >= 2 && validationPatterns.name.test(name);
};

// Date validation helpers
export const validateDate = (dateString: string): boolean => {
  if (!validationPatterns.date.test(dateString)) return false;
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

export const validateTime = (timeString: string): boolean => {
  if (!validationPatterns.time.test(timeString)) return false;
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
};

// Sanitization functions
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/\s+/g, ' ');
};

export const sanitizeName = (name: string): string => {
  return sanitizeInput(name).replace(/[^a-zA-Z\s]/g, '');
};

export const sanitizePhone = (phone: string): string => {
  return phone.replace(/[^\d+\s-()]/g, '');
};

export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

// Form field validation schemas that can be reused
export const commonSchemas = {
  email: z.string()
    .min(1, validationMessages.required("Email"))
    .email(validationMessages.email)
    .max(255, validationMessages.maxLength("Email", 255)),
    
  password: z.string()
    .min(1, validationMessages.required("Password"))
    .min(8, validationMessages.minLength("Password", 8))
    .max(100, validationMessages.maxLength("Password", 100))
    .regex(validationPatterns.password, validationMessages.password),
    
  name: z.string()
    .min(1, validationMessages.required("Name"))
    .min(2, validationMessages.minLength("Name", 2))
    .max(100, validationMessages.maxLength("Name", 100))
    .regex(validationPatterns.name, validationMessages.name),
    
  phone: z.string()
    .min(1, validationMessages.required("Phone number"))
    .regex(validationPatterns.phone, validationMessages.phone),
    
  indianPhone: z.string()
    .min(1, validationMessages.required("Phone number"))
    .regex(validationPatterns.indianPhone, validationMessages.indianPhone),
    
  date: z.string()
    .min(1, validationMessages.required("Date"))
    .regex(validationPatterns.date, validationMessages.date),
    
  time: z.string()
    .min(1, validationMessages.required("Time"))
    .regex(validationPatterns.time, validationMessages.time),
    
  positiveNumber: z.number()
    .min(1, validationMessages.positive),
};