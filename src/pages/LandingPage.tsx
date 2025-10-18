import { Link } from 'react-router-dom';
import { Sparkles, ShoppingBag, Shield, TrendingUp, Sun, Battery, Zap, Package } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export function LandingPage() {
  const categories = [
    { name: 'Solar Panels', icon: Sun, color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
    { name: 'Inverters', icon: Zap, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { name: 'Batteries', icon: Battery, color: 'text-green-500', bgColor: 'bg-green-50' },
    { name: 'Solar Kits', icon: Package, color: 'text-orange-500', bgColor: 'bg-orange-50' },
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Recommendations',
      description: 'Get personalized solar product suggestions based on your energy needs, budget, and location.',
    },
    {
      icon: ShoppingBag,
      title: 'Verified Vendors',
      description: 'Shop with confidence from thoroughly vetted and approved solar equipment vendors.',
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'Your payments are protected with bank-level security and buyer protection policies.',
    },
    {
      icon: TrendingUp,
      title: 'Best Prices',
      description: 'Compare prices across multiple vendors to get the best deals on quality solar products.',
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGg3Ljl2LTRIMzZ2NHptMCAxMGg3Ljl2LTRINMZ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-2 mb-6">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium text-yellow-300">AI-Powered Solar Shopping</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Your Gateway to
                <span className="block bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                  Affordable Solar Energy
                </span>
              </h1>

              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                Discover quality solar products from verified vendors across Africa and beyond. Get personalized recommendations powered by AI to find the perfect solar solution for your home or business.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/ai-recommend">
                  <Button size="lg" className="text-lg group">
                    <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Get AI Recommendations
                  </Button>
                </Link>
                <Link to="/products">
                  <Button size="lg" variant="outline" className="text-lg bg-white/10 border-white/30 text-white hover:bg-white/20">
                    Browse Products
                  </Button>
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-bold text-yellow-400">500+</div>
                  <div className="text-sm text-blue-200">Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400">100+</div>
                  <div className="text-sm text-blue-200">Vendors</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400">98%</div>
                  <div className="text-sm text-blue-200">Satisfaction</div>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative z-10">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-yellow-500 rounded-lg">
                      <Sparkles className="h-6 w-6 text-gray-900" />
                    </div>
                    <div>
                      <div className="text-sm text-blue-200">AI Assistant</div>
                      <div className="font-semibold">Ready to help you</div>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="bg-white/10 rounded-lg p-3 border border-white/10">
                      What's your monthly energy consumption?
                    </div>
                    <div className="bg-yellow-500 text-gray-900 rounded-lg p-3 ml-8">
                      About 400 kWh per month
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 border border-white/10">
                      Based on your needs, I recommend a 5kW system. Here are the top options...
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 text-lg">
              Find the perfect solar products for your needs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.name} to={`/products?category=${category.name.toLowerCase().replace(' ', '-')}`}>
                  <Card hover className="text-center h-full">
                    <CardContent className="py-8">
                      <div className={`inline-flex p-4 ${category.bgColor} rounded-xl mb-4`}>
                        <Icon className={`h-8 w-8 ${category.color}`} />
                      </div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ERCO?
            </h2>
            <p className="text-gray-600 text-lg">
              Your trusted partner in the solar energy transition
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="text-center">
                  <CardContent className="py-8">
                    <div className="inline-flex p-4 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl mb-4">
                      <Icon className="h-8 w-8 text-gray-900" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Go Solar?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Let our AI assistant guide you to the perfect solar solution for your needs
          </p>
          <Link to="/ai-recommend">
            <Button size="lg" className="text-lg">
              <Sparkles className="h-5 w-5" />
              Start AI Recommendation Quiz
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
