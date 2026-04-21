export type Product = {
  id: string
  name: string
  price: number
  stock: number
}

export type CartItem = {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

export type Sale = {
  id: string
  items: CartItem[]
  total: number
  paymentMethod: "cash" | "mpesa" | "card"
  createdAt: string
}

export type PaymentMethod = "cash" | "mpesa" | "card"