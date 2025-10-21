import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, DollarSign, TrendingUp, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardContent } from '../../components/ui/Card';

export function AffiliateRegistrationPage() {
  const { user, signUp } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [accountData, setAccountData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    whatsappNumber: '',
    dateOfBirth: '',
    gender: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Nigeria',
    occupation: '',
    companyName: '',
    websiteUrl: '',
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    paymentMethod: 'bank_transfer',
    referralSource: '',
  });

  const handleAccountSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signUp(accountData.email, accountData.password, accountData.fullName, 'affiliate');
      if (error) {
        setError(error.message);
      } else {
        setStep(2);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setLoading(true);

    try {
      const affiliateCode = await generateAffiliateCode();

      const { error } = await supabase
        .from('affiliate_profiles')
        .insert({
          user_id: user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          whatsapp_number: formData.whatsappNumber || null,
          date_of_birth: formData.dateOfBirth || null,
          gender: formData.gender || null,
          address_line1: formData.addressLine1,
          address_line2: formData.addressLine2 || null,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postalCode || null,
          country: formData.country,
          occupation: formData.occupation || null,
          company_name: formData.companyName || null,
          website_url: formData.websiteUrl || null,
          social_media_links: {
            facebook: formData.facebook,
            instagram: formData.instagram,
            twitter: formData.twitter,
            linkedin: formData.linkedin,
          },
          bank_name: formData.bankName || null,
          account_number: formData.accountNumber || null,
          account_name: formData.accountName || null,
          payment_method: formData.paymentMethod,
          referral_source: formData.referralSource || null,
          affiliate_code: affiliateCode,
          terms_accepted: true,
          terms_accepted_at: new Date().toISOString(),
        });

      if (error) throw error;

      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Failed to complete registration');
    } finally {
      setLoading(false);
    }
  };

  const generateAffiliateCode = async (): Promise<string> => {
    const { data, error } = await supabase.rpc('generate_affiliate_code');
    if (error) throw error;
    return data;
  };

  const benefits = [
    { icon: DollarSign, title: 'Earn 5-10% Commission', description: 'Competitive rates on all sales' },
    { icon: TrendingUp, title: 'No Sales Limit', description: 'Unlimited earning potential' },
    { icon: Users, title: 'Marketing Support', description: 'Free banners and promotional materials' },
    { icon: CheckCircle, title: 'Quick Payouts', description: 'Get paid within 7-14 days' },
  ];

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River',
    'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano',
    'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
    'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ];

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-blue-900 flex items-center justify-center px-4 py-12">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to ERCO Affiliates!
            </h1>
            <p className="text-gray-600 mb-8">
              Your application has been submitted successfully. Our team will review your application and get back to you within 24-48 hours.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-blue-900 mb-3">What happens next?</h3>
              <ol className="space-y-2 text-sm text-blue-800">
                <li className="flex gap-2">
                  <span className="font-semibold">1.</span>
                  <span>We'll verify your information and approve your account</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">2.</span>
                  <span>You'll receive your unique affiliate code and tracking links</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">3.</span>
                  <span>Start promoting ERCO products and earn commissions</span>
                </li>
              </ol>
            </div>
            <Button size="lg" onClick={() => navigate('/affiliate/dashboard')}>
              Go to Affiliate Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-blue-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {step === 1 && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Become an ERCO Affiliate
              </h1>
              <p className="text-xl text-green-100">
                Join thousands earning passive income by promoting solar products
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <Card key={benefit.title}>
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex p-3 bg-green-100 rounded-lg mb-4">
                        <Icon className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="max-w-md mx-auto">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Your Account</h2>

                <form onSubmit={handleAccountSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <Input
                    type="text"
                    label="Full Name"
                    placeholder="John Doe"
                    value={accountData.fullName}
                    onChange={(e) => setAccountData({ ...accountData, fullName: e.target.value })}
                    required
                  />

                  <Input
                    type="email"
                    label="Email Address"
                    placeholder="your@email.com"
                    value={accountData.email}
                    onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                    required
                  />

                  <Input
                    type="password"
                    label="Password"
                    placeholder="At least 6 characters"
                    value={accountData.password}
                    onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
                    helperText="Must be at least 6 characters"
                    required
                  />

                  <Button type="submit" fullWidth size="lg" loading={loading}>
                    Continue to Application
                  </Button>
                </form>
              </CardContent>
            </Card>
          </>
        )}

        {step === 2 && (
          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Profile</h2>

              <form onSubmit={handleDetailsSubmit} className="space-y-8">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                    <Input
                      label="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                    <Input
                      type="tel"
                      label="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                    <Input
                      type="tel"
                      label="WhatsApp Number (Optional)"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    />
                    <Input
                      type="date"
                      label="Date of Birth (Optional)"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                    <Select
                      label="Gender (Optional)"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      options={[
                        { value: '', label: 'Select gender' },
                        { value: 'male', label: 'Male' },
                        { value: 'female', label: 'Female' },
                        { value: 'other', label: 'Other' },
                        { value: 'prefer_not_to_say', label: 'Prefer not to say' },
                      ]}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
                  <div className="space-y-4">
                    <Input
                      label="Address Line 1"
                      value={formData.addressLine1}
                      onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                      required
                    />
                    <Input
                      label="Address Line 2 (Optional)"
                      value={formData.addressLine2}
                      onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                    />
                    <div className="grid md:grid-cols-3 gap-4">
                      <Input
                        label="City"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                      <Select
                        label="State"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        options={[
                          { value: '', label: 'Select state' },
                          ...nigerianStates.map(state => ({ value: state, label: state }))
                        ]}
                        required
                      />
                      <Input
                        label="Postal Code (Optional)"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information (Optional)</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Occupation"
                      value={formData.occupation}
                      onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    />
                    <Input
                      label="Company Name"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    />
                    <Input
                      type="url"
                      label="Website URL"
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media (Optional)</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Facebook"
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      placeholder="facebook.com/username"
                    />
                    <Input
                      label="Instagram"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      placeholder="instagram.com/username"
                    />
                    <Input
                      label="Twitter/X"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      placeholder="twitter.com/username"
                    />
                    <Input
                      label="LinkedIn"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      placeholder="linkedin.com/in/username"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                  <div className="space-y-4">
                    <Select
                      label="Payment Method"
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      options={[
                        { value: 'bank_transfer', label: 'Bank Transfer' },
                        { value: 'mobile_money', label: 'Mobile Money' },
                        { value: 'paypal', label: 'PayPal' },
                        { value: 'crypto', label: 'Cryptocurrency' },
                      ]}
                      required
                    />
                    {formData.paymentMethod === 'bank_transfer' && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input
                          label="Bank Name"
                          value={formData.bankName}
                          onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        />
                        <Input
                          label="Account Number"
                          value={formData.accountNumber}
                          onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                        />
                        <Input
                          label="Account Name"
                          value={formData.accountName}
                          onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                          className="md:col-span-2"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                  <Select
                    label="How did you hear about us?"
                    value={formData.referralSource}
                    onChange={(e) => setFormData({ ...formData, referralSource: e.target.value })}
                    options={[
                      { value: '', label: 'Select an option' },
                      { value: 'social_media', label: 'Social Media' },
                      { value: 'search_engine', label: 'Search Engine' },
                      { value: 'friend_referral', label: 'Friend Referral' },
                      { value: 'blog_article', label: 'Blog/Article' },
                      { value: 'advertisement', label: 'Advertisement' },
                      { value: 'other', label: 'Other' },
                    ]}
                  />
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <label className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1" required />
                    <span className="text-sm text-gray-700">
                      I agree to the ERCO Affiliate Terms and Conditions, and understand that commissions are earned on completed sales only.
                    </span>
                  </label>
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" size="lg" loading={loading}>
                    Submit Application
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
