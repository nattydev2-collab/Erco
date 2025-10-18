import { useState } from 'react';
import { Sparkles, ArrowRight, Zap, MapPin, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

export function AIRecommendationPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    budget: '',
    homeSize: '',
    energyConsumption: '',
    location: '',
    useCase: 'residential',
    backupNeeded: 'yes',
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    alert('AI Recommendation feature coming soon! This will analyze your inputs and suggest the best solar products for your needs.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-2 mb-4">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-300">AI-Powered Recommendations</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Find Your Perfect Solar Solution
          </h1>
          <p className="text-blue-200">
            Answer a few questions and let AI guide you to the best products
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1 flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    s <= step
                      ? 'bg-yellow-500 text-gray-900'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      s < step ? 'bg-yellow-500' : 'bg-white/10'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Budget & Size</h2>
                </div>

                <Input
                  type="number"
                  label="What's your budget? (USD)"
                  placeholder="e.g., 5000"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  required
                />

                <Select
                  label="Home/Business Size"
                  value={formData.homeSize}
                  onChange={(e) => setFormData({ ...formData, homeSize: e.target.value })}
                  options={[
                    { value: '', label: 'Select size' },
                    { value: 'small', label: 'Small (1-2 bedroom apartment)' },
                    { value: 'medium', label: 'Medium (3-4 bedroom house)' },
                    { value: 'large', label: 'Large (5+ bedrooms)' },
                    { value: 'commercial', label: 'Small Business' },
                  ]}
                  required
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Energy Needs</h2>
                </div>

                <Select
                  label="Monthly Energy Consumption"
                  value={formData.energyConsumption}
                  onChange={(e) => setFormData({ ...formData, energyConsumption: e.target.value })}
                  options={[
                    { value: '', label: 'Select consumption' },
                    { value: 'low', label: 'Low (0-200 kWh/month)' },
                    { value: 'medium', label: 'Medium (200-400 kWh/month)' },
                    { value: 'high', label: 'High (400-800 kWh/month)' },
                    { value: 'very-high', label: 'Very High (800+ kWh/month)' },
                  ]}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Do you need backup power?
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, backupNeeded: 'yes' })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.backupNeeded === 'yes'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-gray-900">Yes</p>
                      <p className="text-sm text-gray-500">With batteries</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, backupNeeded: 'no' })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.backupNeeded === 'no'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-gray-900">No</p>
                      <p className="text-sm text-gray-500">Grid-tied only</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Location & Use Case</h2>
                </div>

                <Input
                  type="text"
                  label="Your Location (City, Country)"
                  placeholder="e.g., Lagos, Nigeria"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />

                <Select
                  label="Primary Use Case"
                  value={formData.useCase}
                  onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                  options={[
                    { value: 'residential', label: 'Residential Home' },
                    { value: 'commercial', label: 'Small Business' },
                    { value: 'off-grid', label: 'Off-Grid/Remote Location' },
                    { value: 'hybrid', label: 'Hybrid System' },
                  ]}
                  required
                />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Budget</p>
                    <p className="font-semibold text-gray-900">${formData.budget}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Home Size</p>
                    <p className="font-semibold text-gray-900 capitalize">{formData.homeSize}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Energy Consumption</p>
                    <p className="font-semibold text-gray-900 capitalize">{formData.energyConsumption}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">{formData.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Backup Power</p>
                    <p className="font-semibold text-gray-900 capitalize">{formData.backupNeeded}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Our AI will analyze your requirements and recommend the best solar products from our marketplace based on your specific needs and budget.
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  Back
                </Button>
              )}
              {step < 4 ? (
                <Button onClick={handleNext} className="flex-1">
                  Next <ArrowRight className="h-5 w-5" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="flex-1">
                  <Sparkles className="h-5 w-5" />
                  Get Recommendations
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
