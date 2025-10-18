# ERCO - AI-Powered Solar E-Commerce Marketplace

A modern, mobile-first solar energy marketplace platform connecting customers with verified solar product vendors across Africa and globally. Features AI-powered product recommendations, intelligent chatbot assistance, and comprehensive vendor management.

## Features

### Customer Features
- **AI-Powered Recommendations**: Smart quiz-based system to match customers with ideal solar products
- **Product Catalog**: Browse and search thousands of solar panels, inverters, batteries, and kits
- **AI Chatbot Assistant**: 24/7 intelligent help with solar questions and product guidance
- **Shopping Cart & Checkout**: Seamless purchasing experience with multiple payment options
- **Order Tracking**: Real-time order status updates and delivery tracking
- **Product Reviews**: Read and write verified purchase reviews

### Vendor Features
- **Vendor Dashboard**: Comprehensive analytics and sales insights
- **Product Management**: Easy product listing with AI-assisted categorization
- **Order Fulfillment**: Streamlined order processing and shipping management
- **Performance Analytics**: Track views, conversions, and revenue trends
- **Vendor Verification**: Trust-building verification badges and ratings

### Admin Features
- **Vendor Approval System**: Review and approve new vendor applications
- **Transaction Monitoring**: Oversee all platform transactions and activities
- **Content Management**: Manage categories, featured products, and promotions
- **AI System Oversight**: Monitor recommendation accuracy and chatbot performance
- **Platform Analytics**: Comprehensive insights into user growth and revenue

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router v6
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **State Management**: React Context API

## Design System

### Colors
- **Primary**: Solar Yellow (#FBBF24) - Energy, optimism, solar power
- **Secondary**: Deep Blue (#1E40AF) - Trust, reliability, technology
- **Accent**: Eco Green (#10B981) - Sustainability, growth
- **Neutral**: Gray scale for balance and readability

### Typography
- Modern sans-serif fonts optimized for readability
- Clear hierarchy with 3 weight variations
- 150% line-height for body text, 120% for headings

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account (database is pre-configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. The environment variables are already configured in `.env` file

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

### First-Time Setup

#### Create Test Accounts

1. **Create a Customer Account**:
   - Navigate to `/signup`
   - Select "Customer" role
   - Complete registration

2. **Create a Vendor Account**:
   - Navigate to `/signup`
   - Select "Vendor" role
   - Complete registration
   - After login, complete vendor onboarding

3. **Create an Admin Account**:
   - Sign up as a customer first
   - Manually update the role in Supabase:
     ```sql
     UPDATE profiles SET role = 'admin' WHERE email = 'your-admin@email.com';
     ```

#### Seed Sample Products

The database comes with product categories pre-configured. To add sample products:

1. Create a vendor account first (vendors can only add products after verification)
2. As an admin, approve the vendor:
   ```sql
   UPDATE vendor_profiles SET verification_status = 'approved' WHERE user_id = 'vendor-user-id';
   ```
3. Optionally run the sample data script in `seed-data.sql` (update vendor_id references first)

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (Button, Input, Card, etc.)
│   ├── layout/          # Layout components (Header, Footer)
│   └── AIChatbot.tsx    # AI chatbot widget
├── contexts/
│   ├── AuthContext.tsx  # Authentication state management
│   └── CartContext.tsx  # Shopping cart state management
├── pages/
│   ├── auth/            # Login and signup pages
│   ├── LandingPage.tsx  # Homepage
│   ├── ProductsPage.tsx # Product catalog
│   ├── Dashboard.tsx    # User dashboard
│   ├── CartPage.tsx     # Shopping cart
│   └── AIRecommendationPage.tsx  # AI quiz
├── types/
│   └── database.ts      # TypeScript type definitions
├── lib/
│   └── supabase.ts      # Supabase client configuration
└── App.tsx              # Main app component with routing
```

## Key Features Implementation

### Authentication Flow
- Email/password authentication via Supabase
- Role-based access control (Customer, Vendor, Admin)
- Protected routes with automatic redirects
- Profile management and persistence

### Shopping Experience
- Persistent cart across sessions (stored in database)
- Real-time inventory tracking
- Multi-vendor checkout support
- Secure payment integration ready

### AI Features
- **Recommendation Engine**: Multi-step quiz collecting user requirements
- **Chatbot Assistant**: Context-aware responses with quick question presets
- **Auto-Tagging**: AI-powered product categorization (prepared for integration)

### Database Architecture
- Row Level Security (RLS) policies on all tables
- Comprehensive indexing for performance
- Automatic timestamp management
- Foreign key constraints for data integrity

## Environment Variables

The following environment variables are pre-configured in `.env`:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Mobile-First Design

The platform is optimized for mobile devices with:
- Touch-friendly interface elements
- Responsive breakpoints (sm, md, lg, xl)
- Mobile navigation drawer
- Optimized images and lazy loading
- Progressive web app ready

## Security Features

- Row Level Security (RLS) on all database tables
- Input sanitization and validation
- Protected API routes
- Secure authentication flow
- HTTPS-only in production

## Future Enhancements

### Phase 2 Features
- Real payment gateway integration (Stripe/Flutterwave)
- Advanced AI recommendation algorithms
- Real-time chat with vendors
- Mobile app (React Native)
- Multi-language support
- Solar system design tool
- Installation partner network
- Financing options

### Phase 3 Features
- Vendor analytics API
- Wholesale marketplace
- Solar equipment leasing
- Carbon offset tracking
- Community solar projects
- Referral program

## Contributing

This is a production-ready MVP for the ERCO solar marketplace platform. Future development will focus on:
1. Integrating real AI services (OpenAI, Anthropic)
2. Payment gateway implementation
3. Enhanced vendor analytics
4. Mobile application
5. Advanced filtering and search

## License

Proprietary - ERCO Solar Marketplace Platform

## Support

For questions and support, contact: support@erco.solar

---

Built with modern web technologies, designed for the future of solar energy commerce in Africa and beyond.
