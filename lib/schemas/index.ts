import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  url: z.string().min(1, 'Product URL is required'),
  price: z
    .string()
    .min(1, 'Price is required')
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, {
      message: 'Enter a valid price',
    }),
  quantity: z
    .string()
    .min(1, 'Quantity is required')
    .refine((v) => !isNaN(parseInt(v, 10)) && parseInt(v, 10) >= 0, {
      message: 'Enter a valid quantity',
    }),
  description: z.string().min(1, 'Description is required'),
})

export type CreateProductFormValues = z.infer<typeof createProductSchema>

export const editProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  url: z.string().min(1, 'Product URL is required'),
  price: z
    .string()
    .min(1, 'Price is required')
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, {
      message: 'Enter a valid price',
    }),
  quantity: z
    .string()
    .min(1, 'Quantity is required')
    .refine((v) => !isNaN(parseInt(v, 10)) && parseInt(v, 10) >= 0, {
      message: 'Enter a valid quantity',
    }),
  description: z.string().min(1, 'Description is required'),
})

export type EditProductFormValues = z.infer<typeof editProductSchema>

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
})

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email address'),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
