import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AIChatbot } from './components/AIChatbot';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { ProductsPage } from './pages/ProductsPage';
import { Dashboard } from './pages/Dashboard';
import { AIRecommendationPage } from './pages/AIRecommendationPage';
import { CartPage } from './pages/CartPage';
import { AffiliateRegistrationPage } from './pages/affiliate/AffiliateRegistrationPage';
import { AffiliateDashboardPage } from './pages/affiliate/AffiliateDashboardPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <AIChatbot />
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout><LandingPage /></AppLayout>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/products" element={<AppLayout><ProductsPage /></AppLayout>} />
      <Route path="/ai-recommend" element={<AppLayout><AIRecommendationPage /></AppLayout>} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout><Dashboard /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <AppLayout><CartPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <AppLayout>
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Orders</h2>
                  <p className="text-gray-600">Your order history will appear here</p>
                </div>
              </div>
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h2>
                  <p className="text-gray-600">Manage your account settings</p>
                </div>
              </div>
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/affiliate/register" element={<AffiliateRegistrationPage />} />
      <Route
        path="/affiliate/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout><AffiliateDashboardPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/affiliate/links"
        element={
          <ProtectedRoute>
            <AppLayout>
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Referral Links</h2>
                  <p className="text-gray-600">Create and manage your affiliate links</p>
                </div>
              </div>
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/affiliate/materials"
        element={
          <ProtectedRoute>
            <AppLayout>
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Marketing Materials</h2>
                  <p className="text-gray-600">Download banners and promotional content</p>
                </div>
              </div>
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/affiliate/payouts"
        element={
          <ProtectedRoute>
            <AppLayout>
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Payouts</h2>
                  <p className="text-gray-600">Request and track your affiliate payouts</p>
                </div>
              </div>
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendor Dashboard</h2>
                  <p className="text-gray-600">Vendor features coming soon</p>
                </div>
              </div>
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
                  <p className="text-gray-600">Admin features coming soon</p>
                </div>
              </div>
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
