-- Sample vendor profile (you'll need to create a user first through the UI)
-- This is just reference data showing the structure

-- Sample products to populate the marketplace
-- Note: You'll need to replace the vendor_id with actual vendor IDs after creating vendor accounts

-- Example product structure:
INSERT INTO products (
  vendor_id,
  category_id,
  name,
  slug,
  description,
  price,
  compare_at_price,
  capacity,
  voltage,
  warranty_years,
  brand,
  stock_quantity,
  sku,
  weight_kg,
  is_featured,
  is_active,
  specifications
) VALUES
-- Solar Panels
(
  (SELECT id FROM vendor_profiles LIMIT 1),
  (SELECT id FROM product_categories WHERE slug = 'solar-panels'),
  'Premium 450W Monocrystalline Solar Panel',
  'premium-450w-mono-solar-panel',
  'High-efficiency monocrystalline solar panel perfect for residential and commercial installations. Features advanced cell technology for maximum power output even in low-light conditions.',
  299.99,
  349.99,
  '450W',
  '48V',
  25,
  'SolarMax',
  50,
  'SM-450-MONO',
  22.5,
  true,
  true,
  '{"cell_type": "Monocrystalline", "efficiency": "21.5%", "dimensions": "1956x992x40mm", "temperature_coefficient": "-0.35%/°C"}'
),
(
  (SELECT id FROM vendor_profiles LIMIT 1),
  (SELECT id FROM product_categories WHERE slug = 'solar-panels'),
  'Economy 330W Polycrystalline Solar Panel',
  'economy-330w-poly-solar-panel',
  'Cost-effective polycrystalline solar panel ideal for budget-conscious solar installations. Reliable performance with excellent value for money.',
  199.99,
  NULL,
  '330W',
  '36V',
  20,
  'EcoSolar',
  100,
  'ES-330-POLY',
  19.5,
  false,
  true,
  '{"cell_type": "Polycrystalline", "efficiency": "17.2%", "dimensions": "1650x992x35mm", "temperature_coefficient": "-0.42%/°C"}'
),

-- Inverters
(
  (SELECT id FROM vendor_profiles LIMIT 1),
  (SELECT id FROM product_categories WHERE slug = 'inverters'),
  '5kW Hybrid Solar Inverter',
  '5kw-hybrid-solar-inverter',
  'Advanced hybrid inverter with battery storage capability. Perfect for homes wanting both grid-tied and backup power solutions.',
  1299.99,
  1499.99,
  '5000W',
  '48V',
  10,
  'PowerTech',
  25,
  'PT-5K-HYB',
  18.0,
  true,
  true,
  '{"type": "Hybrid", "output_voltage": "230V", "efficiency": "97.5%", "display": "LCD with WiFi monitoring"}'
),
(
  (SELECT id FROM vendor_profiles LIMIT 1),
  (SELECT id FROM product_categories WHERE slug = 'inverters'),
  '3kW Grid-Tie Solar Inverter',
  '3kw-grid-tie-inverter',
  'Efficient grid-tie inverter for residential solar systems. Easy installation with smart monitoring capabilities.',
  799.99,
  NULL,
  '3000W',
  '48V',
  10,
  'GridConnect',
  40,
  'GC-3K-GT',
  12.5,
  false,
  true,
  '{"type": "Grid-Tie", "output_voltage": "230V", "efficiency": "98.2%", "display": "LED indicators"}'
),

-- Batteries
(
  (SELECT id FROM vendor_profiles LIMIT 1),
  (SELECT id FROM product_categories WHERE slug = 'batteries'),
  '200Ah Lithium Battery Bank',
  '200ah-lithium-battery',
  'High-capacity lithium battery bank with BMS protection. Long cycle life and fast charging capability for solar energy storage.',
  1899.99,
  2199.99,
  '10.24kWh',
  '48V',
  10,
  'LithiumPro',
  15,
  'LP-200-48V',
  45.0,
  true,
  true,
  '{"chemistry": "LiFePO4", "cycles": "6000+", "charge_time": "3-4 hours", "bms": "Built-in protection"}'
),
(
  (SELECT id FROM vendor_profiles LIMIT 1),
  (SELECT id FROM product_categories WHERE slug = 'batteries'),
  '150Ah Deep Cycle AGM Battery',
  '150ah-agm-battery',
  'Reliable AGM deep cycle battery for solar energy storage. Maintenance-free with excellent performance.',
  599.99,
  NULL,
  '7.2kWh',
  '48V',
  5,
  'PowerStore',
  30,
  'PS-150-AGM',
  52.0,
  false,
  true,
  '{"chemistry": "AGM", "cycles": "1200", "charge_time": "6-8 hours", "maintenance": "Maintenance-free"}'
),

-- Solar Kits
(
  (SELECT id FROM vendor_profiles LIMIT 1),
  (SELECT id FROM product_categories WHERE slug = 'solar-kits'),
  'Complete 5kW Off-Grid Solar Kit',
  'complete-5kw-offgrid-kit',
  'Everything you need for off-grid living! Includes solar panels, inverter, batteries, charge controller, and mounting hardware.',
  6999.99,
  7999.99,
  '5000W',
  '48V',
  10,
  'SolarComplete',
  10,
  'SC-5K-OG-KIT',
  250.0,
  true,
  true,
  '{"includes": ["12x 450W panels", "5kW inverter", "2x 200Ah batteries", "MPPT controller", "Mounting rails", "Cables"], "installation": "DIY-friendly"}'
),
(
  (SELECT id FROM vendor_profiles LIMIT 1),
  (SELECT id FROM product_categories WHERE slug = 'solar-kits'),
  '3kW Grid-Tie Starter Kit',
  '3kw-gridtie-starter-kit',
  'Perfect starter kit for grid-tied solar. Reduce your electricity bills with this easy-to-install system.',
  3499.99,
  NULL,
  '3000W',
  '48V',
  10,
  'GridStart',
  20,
  'GS-3K-GT-KIT',
  180.0,
  false,
  true,
  '{"includes": ["8x 400W panels", "3kW grid-tie inverter", "Mounting hardware", "MC4 connectors"], "installation": "Professional recommended"}'
),

-- Accessories
(
  (SELECT id FROM vendor_profiles LIMIT 1),
  (SELECT id FROM product_categories WHERE slug = 'accessories'),
  'MPPT Solar Charge Controller 60A',
  'mppt-charge-controller-60a',
  'Maximum Power Point Tracking charge controller for optimal solar panel performance. LCD display with multiple protection features.',
  249.99,
  NULL,
  '60A',
  '48V',
  5,
  'ChargePro',
  50,
  'CP-MPPT-60A',
  2.5,
  false,
  true,
  '{"type": "MPPT", "max_pv_voltage": "150V", "efficiency": "98%", "display": "LCD with USB", "protections": ["Overload", "Short circuit", "Reverse polarity"]}'
),
(
  (SELECT id FROM vendor_profiles LIMIT 1),
  (SELECT id FROM product_categories WHERE slug = 'accessories'),
  'Solar Panel Mounting Rails Kit',
  'solar-mounting-rails-kit',
  'Heavy-duty aluminum mounting rails for secure solar panel installation. Suitable for various roof types.',
  199.99,
  NULL,
  NULL,
  NULL,
  20,
  'MountSecure',
  100,
  'MS-RAIL-KIT',
  35.0,
  false,
  true,
  '{"material": "Aluminum", "length": "4.2m rails", "includes": ["Rails", "Clamps", "End caps", "Hardware"], "panels_supported": "Up to 10 panels"}'
);

-- Add product images (using Pexels stock photos)
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT
  p.id,
  'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg',
  p.name,
  0,
  true
FROM products p
WHERE p.slug IN ('premium-450w-mono-solar-panel', 'economy-330w-poly-solar-panel', 'complete-5kw-offgrid-kit', '3kw-gridtie-starter-kit');

INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT
  p.id,
  'https://images.pexels.com/photos/9875463/pexels-photo-9875463.jpeg',
  p.name,
  0,
  true
FROM products p
WHERE p.slug IN ('5kw-hybrid-solar-inverter', '3kw-grid-tie-inverter');

INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT
  p.id,
  'https://images.pexels.com/photos/5207262/pexels-photo-5207262.jpeg',
  p.name,
  0,
  true
FROM products p
WHERE p.slug IN ('200ah-lithium-battery', '150ah-agm-battery');

INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT
  p.id,
  'https://images.pexels.com/photos/2850347/pexels-photo-2850347.jpeg',
  p.name,
  0,
  true
FROM products p
WHERE p.slug IN ('mppt-charge-controller-60a', 'solar-mounting-rails-kit');
