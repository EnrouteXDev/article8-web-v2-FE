// ─── Enums ────────────────────────────────────────────────────────────────────

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  CUSTOMER_SUPPORT = 'customer_support',
  SITE_ADMIN = 'site_admin',
  MEMBER = 'member',
}

export enum AdminPermission {
  ALL = 'all',
  INVITE = 'invite',
  SUPPORT = 'support',
  PRODUCT = 'product',
  CATEGORY = 'category',
  REVIEW = 'review',
  RULES = 'rules',
  POLICY = 'policy',
  BLOG = 'blog',
}

export enum ReturnRule {
  CUSTOMER_PAYS = 'customerPaysReturnShipping',
  FREE_RETURN = 'freeReturnShipping',
}

export enum ProductStatus {
  VISIBLE = 'visible',
  HIDDEN = 'hidden',
  OUT_OF_STOCK = 'out of stock',
}

export enum ProductAvailability {
  AVAILABLE = 'available',
  OUT_OF_STOCK = 'out_of_stock',
}

export enum ProductPriceSort {
  LOW_TO_HIGH = 'low_to_high',
  HIGH_TO_LOW = 'high_to_low',
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

export interface InviteAdminInput {
  firstname: string
  lastname: string
  email: string
  role: AdminRole
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: AdminRole
  lastActive: string | null
}

export interface AdminUsersResponse {
  message: string
  data: AdminUser[]
}

export interface UpdateAdminRoleInput {
  role: AdminRole
}

export interface CreateProductInput {
  name: string
  url: string
  price: number
  quantity: number
  description: string
  images?: string[]
}

export interface UpdateProductInput {
  name?: string
  url?: string
  price?: number
  quantity?: number
  description?: string
  images?: string[]
  status?: ProductStatus
}

export interface ProductFilters {
  search?: string
  status?: ProductStatus
  category?: string
  minPrice?: number
  maxPrice?: number
  availability?: ProductAvailability
  priceSort?: ProductPriceSort
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

export interface Policy {
  _id: string
  key: string
  shippingPolicy: string
  returnPolicy: string
  returnWindow: number
  returnRules: ReturnRule
  createdAt: string
  updatedAt: string
}

export interface PolicyResponse {
  message: string
  policy: Policy
}

export interface UpsertPolicyInput {
  shippingPolicy: string
  returnPolicy: string
  returnWindow: number
  returnRules: ReturnRule
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

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  _id: string
  sessionId: string
  items: CartItem[]
  createdAt: string
  updatedAt: string
}

export interface CartResponse {
  message: string
  cart: Cart
  sessionId?: string
}

export interface AddToCartInput {
  productId: string
  quantity: number
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

// ─── Orders ───────────────────────────────────────────────────────────────────

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum DeliveryStatus {
  PENDING = 'pending',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  FAILED = 'failed',
}

export interface OrderCustomer {
  firstName: string
  lastName: string
  email: string
  phone: string
  addressLine1: string
  addressLine2?: string
  addressLine3?: string
  city: string
  state: string
  postalCode: string
  countryCode: string
}

export interface OrderItem {
  product: string
  name: string
  quantity: number
  priceGBP: number
  priceNGN: number
}

export interface Order {
  _id: string
  orderNumber: string
  customer: OrderCustomer
  items: OrderItem[]
  subtotalNGN: number
  shippingCostNGN: number
  shippingCostGBP?: number
  discountNGN: number
  totalNGN: number
  exchangeRate: number
  status: OrderStatus
  paymentReference?: string
  dhlTrackingNumber?: string
  dhlShipmentId?: string
  estimatedDeliveryDate?: string
  deliveryStatus: DeliveryStatus
  createdAt: string
  updatedAt: string
}

export interface OrderFilters {
  page?: number
  limit?: number
}

export interface OrderResponse {
  message: string
  order: Order
}

export interface OrdersResponse {
  message: string
  data: Order[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface OrderTrackingResponse {
  message: string
  orderNumber: string
  orderStatus: OrderStatus
  deliveryStatus: DeliveryStatus
  dhlTrackingNumber?: string
  estimatedDeliveryDate?: string
  tracking: Record<string, unknown> | null
}

export interface OrderDashboardMetrics {
  totalSales: number
  totalOrders: number
  totalShippedOrders: number
  totalProcessingOrders: number
  totalCancelledOrders: number
}

export interface OrderDashboardResponse {
  message: string
  metrics: OrderDashboardMetrics
  orders: Array<{
    orderId: string
    date: string
    customerName: string
    customerEmail: string
    totalAmount: number
    status: OrderStatus
  }>
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CancelOrderInput {
  cancellationReason: string
}

// ─── Support Tickets ──────────────────────────────────────────────────────────

export enum SupportTicketStatus {
  PENDING = 'pending',
  RESOLVED = 'resolved',
}

export interface SupportTicketProduct {
  _id: string
  name: string
  price: number
  quantity: number
  images: string[]
  status: string
}

export interface SupportTicket {
  id: string
  status: SupportTicketStatus
  name: string
  email: string
  phoneNumber: string
  orderId: string
  complaint: string
  images: string[]
  reply?: string
  respondedAt?: string
  createdAt: string
  product?: SupportTicketProduct
  order?: {
    orderNumber: string
    customer: OrderCustomer
    status: OrderStatus
    createdAt: string
  }
}

export interface SupportTicketsResponse {
  message: string
  data: SupportTicket[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ReplySupportTicketInput {
  reply: string
}

export interface CreateSupportTicketInput {
  orderId: string
  productId: string
  complaint: string
  images?: string[]
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export interface AdminReview {
  id: string
  rating: number
  comment: string
  product: Product
  order: { _id: string; orderNumber: string }
  userName: string
  userEmail: string
  productName: string
  quantityOrdered: number
  isHidden: boolean
  hiddenAt?: string
  createdAt: string
}

export interface PublicReview {
  id: string
  rating: number
  comment: string
  productId: string
  orderId: string
  userName: string
  productName: string
  quantityOrdered: number
  isHidden: boolean
  createdAt: string
}

export interface ReviewFilters {
  page?: number
  limit?: number
  userName?: string
  productName?: string
  userEmail?: string
  isHidden?: boolean
}

export interface AdminReviewsResponse {
  message: string
  data: AdminReview[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PublicReviewsResponse {
  message: string
  data: PublicReview[]
  total: number
  page: number
  limit: number
  totalPages: number
  averageRating: number
}

export interface CreateReviewInput {
  orderId: string
  productId: string
  rating: number
  comment: string
}
