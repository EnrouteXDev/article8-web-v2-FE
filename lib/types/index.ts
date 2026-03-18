// ─── Enums ────────────────────────────────────────────────────────────────────

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  CUSTOMER_SUPPORT = 'customer_support',
  SITE_ADMIN = 'site_admin',
}

export enum AdminPermission {
  ALL = 'all',
  SUPPORT = 'support',
  PRODUCT = 'product',
  CATEGORY = 'category',
  REVIEW = 'review',
  RULES = 'rules',
  POLICY = 'policy',
}

export enum ProductStatus {
  VISIBLE = 'visible',
  HIDDEN = 'hidden',
  OUT_OF_STOCK = 'out of stock',
}

// ─── Entities ─────────────────────────────────────────────────────────────────

export interface Admin {
  _id: string
  firstname: string
  lastname: string
  email: string
  role: AdminRole
  permissions: AdminPermission[]
  createdAt: string
  updatedAt: string
}

export interface Product {
  _id: string
  name: string
  url: string
  price: number
  quantity: number
  description: string
  images: string[]
  status: ProductStatus
  createdAt: string
  updatedAt: string
}

export interface Category {
  _id: string
  name: string
  products: Product[]
  createdAt: string
  updatedAt: string
}

// ─── Request Inputs ───────────────────────────────────────────────────────────

export interface LoginInput {
  email: string
  password: string
}

export interface CreateProductInput {
  name: string
  url: string
  price: number
  quantity: number
  description: string
  images?: string[]
  status?: ProductStatus
}

export interface ProductFilters {
  search?: string
  status?: ProductStatus
  page?: number
  limit?: number
}

export interface CreateCategoryInput {
  name: string
  products?: string[]
}

export interface CategoryFilters {
  search?: string
  page?: number
  limit?: number
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface LoginResponse {
  access_token: string
  data: Admin
}

export interface ProductResponse {
  message: string
  product: Product
}

export interface ProductsResponse {
  message: string
  data: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface DeleteProductResponse {
  message: string
  deletedProduct: []
}

export interface CategoryResponse {
  message: string
  category: Category
}

export interface CategoriesResponse {
  message: string
  data: Category[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface DeleteCategoryResponse {
  message: string
}

export interface ForgotPasswordInput {
  email: string
}

export interface ResetPasswordInput {
  email: string
  newPassword: string
  confirmPassword: string
}

export interface MessageResponse {
  message: string
}
