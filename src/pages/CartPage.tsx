import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, loading } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
          <Link to="/products">
            <Button size="lg">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const primaryImage = item.product?.images?.find((img) => img.is_primary)?.image_url ||
                                   item.product?.images?.[0]?.image_url ||
                                   'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg';

              return (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <img
                        src={primaryImage}
                        alt={item.product?.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.product?.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          {item.product?.vendor_profile?.business_name}
                        </p>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 rounded hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="h-4 w-4 text-gray-600" />
                            </button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          ${((item.product?.price || 0) * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${item.product?.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>${cartTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Button fullWidth size="lg" onClick={() => alert('Checkout feature coming soon!')}>
                  Proceed to Checkout
                </Button>

                <Link to="/products">
                  <Button fullWidth variant="outline" className="mt-3">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
