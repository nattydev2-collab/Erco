import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign, Users, MousePointer, ShoppingCart, TrendingUp,
  Copy, Check, ExternalLink, Download, CreditCard
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { AffiliateProfile, AffiliateCommission } from '../../types/database';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function AffiliateDashboardPage() {
  const { user } = useAuth();
  const [affiliateProfile, setAffiliateProfile] = useState<AffiliateProfile | null>(null);
  const [commissions, setCommissions] = useState<AffiliateCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAffiliateData();
    }
  }, [user]);

  const fetchAffiliateData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('affiliate_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      setAffiliateProfile(profileData);

      if (profileData) {
        const { data: commissionsData, error: commissionsError } = await supabase
          .from('affiliate_commissions')
          .select('*')
          .eq('affiliate_id', profileData.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (commissionsError) throw commissionsError;
        setCommissions(commissionsData || []);
      }
    } catch (error) {
      console.error('Error fetching affiliate data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (!affiliateProfile) return;

    const referralLink = `${window.location.origin}?ref=${affiliateProfile.affiliate_code}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
      active: 'success',
      pending: 'warning',
      suspended: 'error',
      inactive: 'info',
    };
    return <Badge variant={variants[status] || 'default'}>{status.toUpperCase()}</Badge>;
  };

  const getCommissionStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
      paid: 'success',
      approved: 'info',
      pending: 'warning',
      cancelled: 'error',
    };
    return <Badge variant={variants[status] || 'default'} size="sm">{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!affiliateProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Affiliate Profile Found</h2>
            <p className="text-gray-600 mb-6">
              You haven't registered as an affiliate yet.
            </p>
            <Link to="/affiliate/register">
              <Button size="lg">Register as Affiliate</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      icon: DollarSign,
      label: 'Total Earnings',
      value: `$${affiliateProfile.total_commission_earned.toFixed(2)}`,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: CreditCard,
      label: 'Pending Commission',
      value: `$${affiliateProfile.pending_commission.toFixed(2)}`,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      icon: MousePointer,
      label: 'Total Clicks',
      value: affiliateProfile.total_clicks.toLocaleString(),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Users,
      label: 'Total Referrals',
      value: affiliateProfile.total_referrals.toLocaleString(),
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: ShoppingCart,
      label: 'Total Sales',
      value: affiliateProfile.total_sales.toLocaleString(),
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      icon: TrendingUp,
      label: 'Conversion Rate',
      value: affiliateProfile.total_clicks > 0
        ? `${((affiliateProfile.total_sales / affiliateProfile.total_clicks) * 100).toFixed(1)}%`
        : '0%',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
  ];

  const referralLink = `${window.location.origin}?ref=${affiliateProfile.affiliate_code}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome, {affiliateProfile.first_name}!
              </h1>
              <p className="text-green-100">
                Affiliate Code: <span className="font-semibold">{affiliateProfile.affiliate_code}</span>
              </p>
            </div>
            {getStatusBadge(affiliateProfile.status)}
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Referral Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={referralLink}
                      readOnly
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                    />
                    <Button onClick={copyReferralLink} variant="outline">
                      {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Link to="/affiliate/links" className="block">
            <Card hover>
              <CardContent className="p-6">
                <ExternalLink className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Referral Links</h3>
                <p className="text-sm text-gray-600">Create custom tracking links</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/affiliate/materials" className="block">
            <Card hover>
              <CardContent className="p-6">
                <Download className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Marketing Materials</h3>
                <p className="text-sm text-gray-600">Banners, images, and content</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/affiliate/payouts" className="block">
            <Card hover>
              <CardContent className="p-6">
                <CreditCard className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Request Payout</h3>
                <p className="text-sm text-gray-600">Withdraw your earnings</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Recent Commissions</h2>
          </CardHeader>
          <CardContent>
            {commissions.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No commissions yet</p>
                <p className="text-sm text-gray-400 mt-1">Start promoting to earn commissions</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Order</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Order Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Commission</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commissions.map((commission) => (
                      <tr key={commission.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                          {commission.order_number}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(commission.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          ${commission.order_amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-green-600">
                          ${commission.commission_amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          {getCommissionStatusBadge(commission.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
