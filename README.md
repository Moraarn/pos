# Point of Sale (POS) System

A fully functional Point of Sale system built with Next.js, TypeScript, and Zustand for state management.

## Features

- **Product Management**: Display products with stock availability
- **Cart System**: Add/remove items, update quantities, stock validation
- **Checkout Process**: Multiple payment methods (Cash, M-Pesa, Card)
- **Receipt Generation**: Automatic receipt creation after sales
- **Sales History**: Track all transactions with detailed views
- **Local Storage**: Persistent cart and sales data
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 16 with App Router
- **Language**: TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Storage**: LocalStorage
- **Icons**: Unicode emojis (no external dependencies)

## Project Structure

```
/pos
├── /app
│   └── /pos
│       └── page.tsx          # Main POS page
├── /components
│   ├── ProductList.tsx       # Product display
│   ├── Cart.tsx             # Shopping cart
│   ├── Checkout.tsx         # Payment processing
│   ├── Receipt.tsx          # Receipt modal
│   └── SalesHistory.tsx     # Sales history
├── /store
│   ├── useCartStore.ts      # Cart state management
│   └── useSalesStore.ts     # Sales state management
├── /lib
│   └── storage.ts           # LocalStorage utilities
└── /types
    └── index.ts             # TypeScript definitions
```

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Install Zustand** (required for state management):
   ```bash
   npm install zustand
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000/pos
   ```

## Usage

### Adding Products to Cart
1. Browse the product list
2. Click "Add to Cart" on any product
3. Stock availability is automatically checked
4. Quantity updates are limited by available stock

### Managing Cart
- **Increase/Decrease**: Use + and − buttons
- **Remove Item**: Click the 🗑️ icon
- **Clear All**: Click "Clear All" button

### Checkout Process
1. Select payment method (Cash, M-Pesa, or Card)
2. Review total amount including 16% VAT
3. Click "Complete Sale"
4. Receipt automatically appears

### Viewing Sales History
1. Click "Sales History" tab
2. View all past transactions
3. Click on any sale to see detailed items
4. Total revenue is displayed at the bottom

## Key Features

### Stock Management
- Real-time stock validation
- Prevents adding items beyond available stock
- Visual indicators for stock levels

### Payment Processing
- Three payment methods supported
- Simulated payment processing with loading state
- Automatic receipt generation

### Data Persistence
- Cart state saved to localStorage
- Sales history persisted across sessions
- Automatic data recovery on page reload

### Calculations
- Accurate subtotal calculation
- 16% VAT automatically applied
- No hardcoded values - all calculated dynamically

## Products Included

The system comes pre-configured with sample products:
- iPhone 13 - KES 80,000 (10 units)
- AirPods Pro - KES 25,000 (15 units)
- MacBook Air M2 - KES 150,000 (5 units)
- iPad Pro - KES 90,000 (8 units)
- Apple Watch - KES 45,000 (12 units)
- Magic Keyboard - KES 12,000 (20 units)
- AirTag - KES 3,000 (50 units)
- Lightning Cable - KES 2,000 (30 units)

## Technical Implementation

### State Management
- **Zustand** for lightweight, performant state management
- Separate stores for cart and sales logic
- Persistent middleware for localStorage integration

### Type Safety
- Full TypeScript implementation
- Defined interfaces for all data structures
- Type-safe props and state management

### UI/UX Features
- Clean, modern POS interface
- Responsive grid layout
- Smooth transitions and hover states
- Loading indicators for async operations
- Modal receipts for better UX

## Development Notes

### Architecture Decisions
- **Component-based structure**: Each feature in its own component
- **Separation of concerns**: UI separate from business logic
- **Type safety**: Full TypeScript coverage
- **Performance**: Optimized re-renders with Zustand

### No External Dependencies
- Uses built-in browser APIs
- Unicode emojis instead of icon libraries
- Minimal dependencies for faster setup

## Future Enhancements

Potential features for future versions:
- Product search functionality
- Keyboard shortcuts for faster checkout
- Dark mode support
- Export sales data to CSV
- Product categories
- Discount and coupon support
- Multi-user support
- Barcode scanning integration
