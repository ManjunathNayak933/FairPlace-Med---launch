# Backend for Quick Medication Delivery System

This backend serves all three frontends (Admin, Buyer, Seller) and provides APIs for authentication, medicine management, order placement, and order tracking.

## Setup

1. Install dependencies:
   ```powershell
   cd backend
   npm install
   ```
2. Create a `.env` file (already provided) and set your MongoDB URI and port if needed.
3. Start the backend server:
   ```powershell
   npm run dev
   ```

## API Endpoints

- `/api/auth` - Authentication (to be implemented)
- `/api/medicines` - Medicine management (to be implemented)
- `/api/orders` - Order placement and tracking (to be implemented)

## Integration

- All three frontends should point their API requests to the backend server (default: `http://localhost:5000`).
- CORS is enabled for development.

---

**Next steps:**

- Implement routes and models for users, medicines, and orders.
- Connect each frontend to the backend by updating their API service URLs.
