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

export const heroSlideButtonSchema = z
  .object({
    text: z.string().min(1, 'Button text is required'),
    variant: z.enum(['solid', 'outline']),
    action: z.enum(['link', 'showreel']),
    href: z.string().optional(),
    videoUrl: z.string().optional(),
  })
  .superRefine((button, ctx) => {
    if (button.action === 'link' && !button.href?.trim()) {
      ctx.addIssue({ code: 'custom', message: 'Enter a link for this button', path: ['href'] })
    }
    if (button.action === 'showreel' && !button.videoUrl?.trim()) {
      ctx.addIssue({ code: 'custom', message: 'Enter the video URL to play', path: ['videoUrl'] })
    }
  })

export const heroSlideSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    topSubtitle: z.string().optional(),
    bottomSubtitle: z.string().optional(),
    image: z.string().min(1, 'A background image is required'),
    mobileImage: z.string().optional(),
    imageAlt: z.string().optional(),
    backgroundVideo: z.string().optional(),
    hideText: z.boolean(),
    comingSoon: z.boolean(),
    textAlign: z.enum(['left', 'center']),
    showOverlay: z.boolean(),
    overlayOpacity: z.number().min(0).max(1),
    order: z.number().int('Order must be a whole number').min(0, 'Order cannot be negative'),
    isActive: z.boolean(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    buttons: z.array(heroSlideButtonSchema).max(2, 'A slide can have up to 2 buttons'),
  })
  .superRefine((slide, ctx) => {
    if (slide.startDate && slide.endDate && slide.endDate < slide.startDate) {
      ctx.addIssue({ code: 'custom', message: 'End date must be after the start date', path: ['endDate'] })
    }
  })

export type HeroSlideFormValues = z.infer<typeof heroSlideSchema>
