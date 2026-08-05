// Matches the `menu_items` table in Supabase
export interface MenuItem {
  id: string;
  business_id: string;
  name: string;
  price: number;
  cost_price: number;
  description: string | null;
  category: string | null;
  image_url: string | null;
  created_at: string;
}

// A menu item once added to the cart, with a quantity attached
export interface CartItem extends MenuItem {
  quantity: number;
}

// A single line item as stored inside an order's `items` JSON column
export interface OrderLineItem {
  name: string;
  price: number;
  cost_price: number;
  quantity: number;
}

// Matches the `orders` table in Supabase
export interface Order {
  id: string;
  business_id: string;
  customer_name: string;
  phone: string;
  delivery_area: string;
  address: string;
  notes: string | null;
  items: OrderLineItem[];
  total_revenue: number;
  total_cost: number;
  total_profit: number;
  created_at: string;
}