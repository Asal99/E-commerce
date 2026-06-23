import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  const { q, category, type, tag } = req.query;
  const filter = {};

  if (q) filter.$text = { $search: q };
  if (category) filter.category = category.toLowerCase();
  if (type) filter.type = type.toLowerCase();
  if (tag) filter.tag = tag.toLowerCase();

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
};
