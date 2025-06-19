# Orders API - Separated Routes

The orders functionality has been split into separate routes for better performance and cleaner organization:

## New API Endpoints

### Buyer Orders (`/api/buyer-orders`)
Routes specifically for buyers to manage their orders.

**GET /api/buyer-orders**
- Fetches orders for a specific buyer
- Required query parameter: `buyerId`
- Returns orders with buyer-specific formatting

**POST /api/buyer-orders**
- Creates a new order
- Body: `{ buyer, items, total, address, prescriptionImage }`

**GET /api/buyer-orders/:id**
- Fetches a specific order by ID for a buyer
- Required query parameter: `buyerId`
- Ensures buyer can only access their own orders

### Seller Orders (`/api/seller-orders`)
Routes specifically for sellers to manage orders containing their products.

**GET /api/seller-orders**
- Fetches orders containing the seller's products
- Required query parameter: `sellerId`
- Returns orders filtered to show only the seller's items
- Calculates totals based on seller's items only

**PUT /api/seller-orders/:id**
- Updates order status
- Body: `{ status, sellerId }`
- Verifies seller has products in the order before allowing updates

**GET /api/seller-orders/:id**
- Fetches a specific order by ID for a seller
- Required query parameter: `sellerId`
- Ensures seller can only access orders containing their products

### Legacy Orders (`/api/orders`)
Minimal routes kept for backward compatibility.

**GET /api/orders/:id**
- Generic order fetch by ID

**PUT /api/orders/:id**
- Generic order status update

## Performance Improvements

1. **Targeted Queries**: Each route type has optimized queries for its specific use case
2. **Reduced Data Transfer**: Seller routes only return relevant items and calculate appropriate totals
3. **Better Caching**: Separate endpoints allow for more granular caching strategies
4. **Cleaner Logic**: Separation of concerns makes the code more maintainable

## Migration Guide

### For Frontend Applications

**Old approach:**
```javascript
// Buyer orders
fetch('/api/orders?buyerId=123')

// Seller orders  
fetch('/api/orders?sellerId=456')
```

**New approach:**
```javascript
// Buyer orders
fetch('/api/buyer-orders?buyerId=123')

// Seller orders
fetch('/api/seller-orders?sellerId=456')
```

The response format remains the same, but performance should be significantly improved.
