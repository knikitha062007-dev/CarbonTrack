INSERT INTO emission_factors (category, activity_type, unit, emission_factor) VALUES

-- =========================
-- TRANSPORT
-- =========================
('TRANSPORT', 'Petrol Car', 'km', 0.192),
('TRANSPORT', 'Diesel Car', 'km', 0.171),
('TRANSPORT', 'Hybrid Car', 'km', 0.100),
('TRANSPORT', 'Electric Car', 'km', 0.050),
('TRANSPORT', 'Public Transit', 'km', 0.080),
('TRANSPORT', 'Bicycle/Walk', 'km', 0.000),

-- =========================
-- ELECTRICITY
-- =========================
('ELECTRICITY', 'Air Conditioner', 'hours', 0.82),
('ELECTRICITY', 'Heater', 'hours', 2.00),
('ELECTRICITY', 'Desktop PC', 'hours', 0.25),
('ELECTRICITY', 'Washing Machine', 'hours', 0.60),
('ELECTRICITY', 'Refrigerator', 'hours', 0.15),
('ELECTRICITY', 'LED Bulbs', 'hours', 0.02),

-- =========================
-- FOOD
-- =========================
('FOOD', 'Red Meat', 'meal', 5.00),
('FOOD', 'Poultry/Fish', 'meal', 3.00),
('FOOD', 'Vegetarian', 'meal', 1.50),
('FOOD', 'Vegan', 'meal', 1.00),

-- =========================
-- SHOPPING
-- =========================
('SHOPPING', 'Clothing', 'item', 10.00),
('SHOPPING', 'Electronics', 'item', 50.00),
('SHOPPING', 'Home Goods', 'item', 20.00),
('SHOPPING', 'Plastic/Packaging', 'item', 5.00);