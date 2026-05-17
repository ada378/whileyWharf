import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 'Must contain uppercase, number & special character'),
  phone: z.string().optional(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 'Must contain uppercase, number & special character'),
})

export const addressSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid phone is required'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(5, 'Valid pincode is required'),
  country: z.string().min(2, 'Country is required'),
  isDefault: z.boolean().optional(),
})

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(2000),
})

export const profileSchema = z.object({
  name: z.string().min(2).max(50),
  phone: z.string().optional(),
})

export const couponSchema = z.object({
  code: z.string().min(4).max(20),
  description: z.string().min(3).max(200),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().min(1),
  minOrderAmount: z.number().min(0),
  maxDiscount: z.number().optional(),
  usageLimit: z.number().min(1),
  expiryDate: z.string().min(1, 'Expiry date is required'),
})

export const productSchema = z.object({
  name: z.string().min(3).max(200),
  description: z.string().min(20),
  shortDescription: z.string().max(500).optional(),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().min(1, 'Brand is required'),
  basePrice: z.number().min(0),
  salePrice: z.number().min(0),
  stock: z.number().min(0),
  isFeatured: z.boolean().optional(),
  tags: z.string().optional(),
})
