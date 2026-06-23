export const products = [
  {
    id: 1,
    name: "Beige Oversized Shirt",
    price: 2499,
    category: "shirts",
    tag: "new",
    image: "https://picsum.photos/300?random=1",
  },
  {
    id: 2,
    name: "Striped Linen Pants",
    price: 3299,
    category: "bottoms",
    tag: "bestseller",
    image: "https://picsum.photos/300?random=2",
  },
  {
    id: 3,
    name: "Casual Shorts",
    price: 1999,
    category: "bottoms",
    tag: "new",
    image: "https://picsum.photos/300?random=3",
  },
  {
    id: 4,
    name: "Olive Utility Jacket",
    price: 4999,
    category: "jackets",
    tag: "bestseller",
    image: "https://picsum.photos/300?random=4",
  },

  // 🧢 HATS
  {
    id: 5,
    name: "Black Snapback Cap",
    price: 1299,
    category: "headwear",
    type: "snapback",
    tag: "new",
    image: "https://picsum.photos/300?random=5",
  },
  {
    id: 6,
    name: "Classic Dad Cap",
    price: 999,
    category: "headwear",
    tag: "bestseller",
    type: "dad",
    image: "https://picsum.photos/300?random=6",
  },
  {
    id: 59,
    name: "Classic Dad Cap",
    price: 923,
    category: "headwear",
    tag: "bestseller",
    type: "baseball",
    image: "https://picsum.photos/300?random=6",
  },

  // 👕 T-SHIRTS
  {
    id: 7,
    name: "Graphic Print Tee",
    price: 1499,
    category: "tshirts",
    tag: "new",
    image: "https://picsum.photos/300?random=7",
  },
  {
    id: 8,
    name: "Minimal White Tee",
    price: 999,
    category: "tshirts",
    tag: "bestseller",
    image: "https://picsum.photos/300?random=8",
  },

  // 👓 EYEWEAR
  {
    id: 9,
    name: "Round Sunglasses",
    price: 1999,
    category: "eyewear",
    type: "sunglasses",
    tag: "new",
    image: "...",
  },

  {
    id: 10,
    name: "Aviator Glasses",
    price: 2499,
    category: "eyewear",
    type: "sunglasses",
    tag: "bestseller",
    image: "...",
  },

  {
    id: 100,
    name: "Blue Light Pro",
    price: 2299,
    category: "eyewear",
    type: "bluelight",
    tag: "new",
    image: "...",
  },
  // 🎒 ACCESSORIES
  {
    id: 11,
    name: "Leather Wallet",
    price: 1499,
    category: "accessories",
    tag: "new",
    image: "https://picsum.photos/300?random=11",
  },
  {
    id: 12,
    name: "Street Backpack",
    price: 2999,
    category: "accessories",
    tag: "bestseller",
    image: "https://picsum.photos/300?random=12",
  },

  // 👕 MORE PRODUCTS (to make it big)
  ...Array.from({ length: 40 }, (_, i) => ({
    id: 13 + i,
    name: `Product ${13 + i}`,
    price: Math.floor(Math.random() * 4000) + 1000,
    category: ["shirts", "tshirts", "headwear", "eyewear", "bottoms"][i % 5],
    tag: ["new", "bestseller"][i % 2],
    image: `https://picsum.photos/300?random=${13 + i}`,
  })),
];
