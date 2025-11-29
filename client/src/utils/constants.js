export const PRODUCT_CATEGORIES = {
  Vegetables: [
    'Tomato', 'Potato', 'Onion', 'Carrot', 'Cabbage', 'Cauliflower', 'Spinach', 'Broccoli', 'Peas', 'Beans', 'Cucumber', 'Eggplant', 'Garlic', 'Ginger', 'Chili', 'Capsicum', 'Pumpkin', 'Radish', 'Beetroot'
  ],
  Fruits: [
    'Apple', 'Banana', 'Orange', 'Mango', 'Grapes', 'Papaya', 'Watermelon', 'Pineapple', 'Pomegranate', 'Guava', 'Strawberry', 'Lemon', 'Coconut'
  ],
  Grains: [
    'Rice', 'Wheat', 'Corn', 'Barley', 'Millet'
  ]
};

export const ALL_ITEMS = [
  ...PRODUCT_CATEGORIES.Vegetables,
  ...PRODUCT_CATEGORIES.Fruits,
  ...PRODUCT_CATEGORIES.Grains
].sort();
