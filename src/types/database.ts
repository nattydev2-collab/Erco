export type UserRole = 'customer' | 'vendor' | 'admin';

export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type FulfillmentStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface VendorProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_description?: string;
  business_address?: string;
  business_phone?: string;
  business_email?: string;
  tax_id?: string;
  logo_url?: string;
  banner_url?: string;
  verification_status: VerificationStatus;
  verification_documents: any[];
  rating_average: number;
  rating_count: number;
  total_sales: number;
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parent_id?: string;
  display_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  vendor_id: string;
  category_id?: string;
  name: string;
  slug: string;
  description?: string;
  specifications: Record<string, any>;
  price: number;
  compare_at_price?: number;
  capacity?: string;
  voltage?: string;
  warranty_years: number;
  brand?: string;
  stock_quantity: number;
  sku?: string;
  weight_kg?: number;
  is_featured: boolean;
  is_active: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  vendor_profile?: VendorProfile;
  category?: ProductCategory;
  images?: ProductImage[];
  tags?: ProductTag[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface ProductTag {
  id: string;
  product_id: string;
  tag: string;
  source: 'manual' | 'ai';
  confidence_score?: number;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method?: string;
  subtotal: number;
  tax: number;
  shipping_cost: number;
  discount: number;
  total: number;
  currency: string;
  shipping_address: ShippingAddress;
  billing_address?: ShippingAddress;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  vendor_id: string;
  product_name: string;
  product_sku?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  fulfillment_status: FulfillmentStatus;
  created_at: string;
  product?: Product;
}

export interface Review {
  id: string;
  product_id: string;
  customer_id: string;
  order_id?: string;
  rating: number;
  title?: string;
  comment?: string;
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  customer?: Profile;
}

export interface AIRecommendation {
  id: string;
  user_id?: string;
  session_id: string;
  quiz_data: QuizData;
  recommended_products: any[];
  explanation?: string;
  created_at: string;
}

export interface QuizData {
  budget?: number;
  home_size?: string;
  energy_consumption?: string;
  location?: string;
  use_case?: string;
  backup_needed?: boolean;
}

export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIChatSession {
  id: string;
  user_id?: string;
  session_id: string;
  messages: AIChatMessage[];
  context?: string;
  created_at: string;
  updated_at: string;
}

export interface VendorAnalytics {
  id: string;
  vendor_id: string;
  date: string;
  total_views: number;
  total_orders: number;
  total_revenue: number;
  total_products_sold: number;
  average_order_value: number;
  created_at: string;
}

export interface ProductView {
  id: string;
  product_id: string;
  user_id?: string;
  session_id?: string;
  viewed_at: string;
}

export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  target_type?: string;
  target_id?: string;
  details: Record<string, any>;
  created_at: string;
}
