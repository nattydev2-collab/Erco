import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types/database';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          vendor_profile:vendor_profiles(business_name, rating_average),
          category:product_categories(name),
          images:product_images(image_url, is_primary)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(12);

      if (selectedCategory !== 'all') {
        query = query.eq('category.slug', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'solar-panels', label: 'Solar Panels' },
    { value: 'inverters', label: 'Inverters' },
    { value: 'batteries', label: 'Batteries' },
    { value: 'solar-kits', label: 'Solar Kits' },
    { value: 'accessories', label: 'Accessories' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Solar Products</h1>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Filters
            </Button>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                <CardContent className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const primaryImage = product.images?.find((img) => img.is_primary)?.image_url ||
                                   product.images?.[0]?.image_url ||
                                   'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg';

              return (
                <Link key={product.id} to={`/products/${product.slug}`}>
                  <Card hover className="h-full">
                    <div className="relative h-48 bg-gray-100 rounded-t-xl overflow-hidden">
                      <img
                        src={primaryImage}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.is_featured && (
                        <Badge variant="warning" className="absolute top-3 left-3">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardContent className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {product.vendor_profile?.business_name}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{product.vendor_profile?.rating_average?.toFixed(1) || '5.0'}</span>
                        <span className="text-gray-500">(24)</span>
                      </div>

                      {product.capacity && (
                        <Badge variant="info" size="sm">
                          {product.capacity}
                        </Badge>
                      )}

                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          ${product.price.toLocaleString()}
                        </span>
                        {product.compare_at_price && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.compare_at_price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {product.stock_quantity > 0 ? (
                        <Badge variant="success" size="sm">
                          In Stock
                        </Badge>
                      ) : (
                        <Badge variant="error" size="sm">
                          Out of Stock
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
