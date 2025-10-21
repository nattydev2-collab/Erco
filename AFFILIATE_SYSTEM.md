# ERCO Affiliate System Documentation

## Overview

The ERCO Affiliate System (similar to Jumia's JForce) is a comprehensive affiliate marketing platform that allows individuals to earn commissions by promoting ERCO solar products. The system includes detailed registration, tracking, commission management, and payout features.

## Features

### 1. Affiliate Registration
- **Two-Step Registration Process**
  - Step 1: Create account (email, password)
  - Step 2: Complete detailed profile with personal, professional, and payment information

- **Comprehensive Data Collection**
  - Personal Information: Name, phone, WhatsApp, date of birth, gender
  - Address: Complete Nigerian address with state selection
  - Professional: Occupation, company, website
  - Social Media: Facebook, Instagram, Twitter/X, LinkedIn
  - Payment Details: Bank information, payment method preferences
  - Referral Source: How they heard about the program

### 2. Affiliate Dashboard
- **Performance Metrics**
  - Total Earnings
  - Pending Commission
  - Total Clicks
  - Total Referrals
  - Total Sales
  - Conversion Rate

- **Quick Actions**
  - Copy referral link
  - Access marketing materials
  - Request payouts
  - View commission history

- **Recent Commissions Table**
  - Order number
  - Date
  - Order amount
  - Commission earned
  - Payment status

### 3. Database Schema

#### affiliate_profiles
Stores detailed affiliate information:
- Personal details (name, phone, address)
- Professional information (occupation, company, website)
- Social media links
- Banking/payment details
- Unique affiliate code (auto-generated)
- Commission rate (default 5%)
- Tier level (for multi-tier commissions)
- Status (pending, active, suspended, inactive)
- Performance statistics

#### affiliate_links
Track custom referral links:
- General marketplace links
- Product-specific links
- Category links
- Campaign-specific links
- Click and conversion tracking
- Expiration dates

#### affiliate_clicks
Record every click on affiliate links:
- IP address, user agent
- Referrer, country, city
- Device type
- Session tracking
- Conversion status

#### affiliate_referrals
Track referred customers:
- Customer information
- First purchase date
- Total orders and spending
- Commission generated
- Status tracking

#### affiliate_commissions
Record all commission transactions:
- Order details
- Commission rate and amount
- Status (pending, approved, paid, cancelled)
- Approval workflow
- Payout linkage

#### affiliate_payouts
Manage payout requests:
- Payout number (unique identifier)
- Amount and currency
- Payment method and details
- Status tracking
- Processing workflow
- Transaction references

#### affiliate_marketing_materials
Store promotional content:
- Banners, images, videos
- Email templates
- Social media posts
- Download tracking

#### affiliate_daily_stats
Daily performance summaries:
- Clicks, visitors, referrals
- Orders and revenue
- Commission earned
- Conversion rates

## Commission Structure

### Default Rates
- **Tier 1**: 5% commission (default for new affiliates)
- **Tier 2**: 7% commission (high performers)
- **Tier 3**: 10% commission (top affiliates)

### Commission Flow
1. Customer clicks affiliate link
2. System tracks click and session
3. Customer makes purchase
4. Commission calculated based on order value
5. Status: Pending → Approved → Paid

### Minimum Payout
- $50 minimum withdrawal amount
- Payouts processed within 7-14 business days

## Payment Methods

Supported payment methods:
1. **Bank Transfer** (Nigerian banks)
2. **Mobile Money** (MTN, Airtel, etc.)
3. **PayPal** (international)
4. **Cryptocurrency** (Bitcoin, USDT)

## Referral Link Structure

```
https://erco.solar?ref=AFF-XXXXXXXX
https://erco.solar/products?ref=AFF-XXXXXXXX
https://erco.solar/products/solar-panel-450w?ref=AFF-XXXXXXXX
```

Where `AFF-XXXXXXXX` is the unique affiliate code.

## Security Features

### Row Level Security (RLS)
- Affiliates can only view their own data
- Admin has oversight of all affiliate activities
- Secure commission calculations
- Protected payout processing

### Data Privacy
- Personal information encrypted
- Banking details secured
- GDPR-compliant data handling
- Right to data export and deletion

## Affiliate Journey

### 1. Registration
1. Visit `/affiliate/register`
2. Create account with email and password
3. Complete detailed profile form
4. Accept terms and conditions
5. Submit application

### 2. Approval
1. Admin reviews application
2. Verification of provided information
3. Account approval (within 24-48 hours)
4. Affiliate code generated
5. Welcome email sent

### 3. Promotion
1. Access affiliate dashboard
2. Get unique referral links
3. Download marketing materials
4. Share links on social media, website, WhatsApp
5. Track clicks and conversions

### 4. Earning
1. Customers purchase through affiliate links
2. Commissions automatically calculated
3. View earnings in dashboard
4. Track performance metrics

### 5. Payout
1. Reach minimum payout threshold ($50)
2. Request withdrawal from dashboard
3. Admin processes payout
4. Payment sent to registered account
5. Confirmation and receipt

## API Integration Points

### Generate Affiliate Code
```sql
SELECT generate_affiliate_code();
```

### Generate Payout Number
```sql
SELECT generate_payout_number();
```

### Track Click
```typescript
await supabase.from('affiliate_clicks').insert({
  affiliate_id: affiliateId,
  link_id: linkId,
  ip_address: clientIp,
  user_agent: userAgent,
  session_id: sessionId
});
```

### Calculate Commission
```typescript
const commissionRate = affiliateProfile.commission_rate;
const commissionAmount = orderAmount * (commissionRate / 100);

await supabase.from('affiliate_commissions').insert({
  affiliate_id: affiliateId,
  order_id: orderId,
  order_amount: orderAmount,
  commission_rate: commissionRate,
  commission_amount: commissionAmount,
  status: 'pending'
});
```

## Admin Dashboard Features

### Vendor Approval
- View pending affiliate applications
- Review submitted documents
- Approve or reject applications
- Set custom commission rates

### Commission Management
- Review pending commissions
- Approve commission payments
- Handle disputes
- Cancel fraudulent commissions

### Payout Processing
- View payout requests
- Verify payment details
- Process payments
- Track transaction status

### Analytics & Reports
- Total affiliates
- Active vs inactive
- Top performers
- Commission trends
- Payout history

## Marketing Materials

### Available Resources
1. **Banners** (various sizes)
   - Leaderboard (728x90)
   - Rectangle (300x250)
   - Skyscraper (160x600)

2. **Social Media Graphics**
   - Facebook posts
   - Instagram stories
   - Twitter cards

3. **Email Templates**
   - Product promotions
   - Seasonal campaigns
   - Newsletter content

4. **Text Content**
   - Product descriptions
   - Benefits copy
   - Call-to-action phrases

## Best Practices for Affiliates

### Effective Promotion
1. Share genuine product experiences
2. Target relevant audiences
3. Use multiple channels (social media, WhatsApp, email)
4. Create valuable content (reviews, comparisons, tutorials)
5. Be transparent about affiliate relationships

### Compliance
1. Disclose affiliate relationships
2. Don't make false claims
3. Respect trademark guidelines
4. Follow advertising standards
5. Maintain ethical practices

## Future Enhancements

### Phase 2
- Multi-tier affiliate program (recruit sub-affiliates)
- Custom landing page builder
- A/B testing for campaigns
- Advanced analytics dashboard
- Mobile app for affiliates

### Phase 3
- Automated email sequences
- Integration with CRM systems
- Webinar hosting platform
- Training and certification program
- Gamification and leaderboards

## Support

### For Affiliates
- Email: affiliates@erco.solar
- WhatsApp: +234 800 000 0000
- Help Center: https://erco.solar/help/affiliates

### For Admins
- Admin Portal: `/admin/affiliates`
- Documentation: Internal wiki
- Technical Support: tech@erco.solar

## Getting Started

### For New Affiliates
1. Visit https://erco.solar/affiliate/register
2. Complete registration form
3. Wait for approval (24-48 hours)
4. Access dashboard and get your referral link
5. Start promoting and earning!

### For Admins
1. Access admin dashboard
2. Navigate to Affiliates section
3. Review pending applications
4. Approve qualified affiliates
5. Monitor performance and process payouts

---

**Note**: This system is designed to scale from individual affiliates to large networks, with robust tracking, fair commission structures, and transparent payout processes.
