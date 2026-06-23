const CART_KEY = "cart";

export const getCart = () => {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
};

export const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

export const addToCart = (product, size = "M") => {
  const cart = getCart();

  const existing = cart.find(
    (item) => item._id === product._id && item.size === size,
  );

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      size,
      qty: 1,
    });
  }

  saveCart(cart);
};

export const removeFromCart = (id, size) => {
  const cart = getCart().filter(
    (item) => !(item._id === id && item.size === size),
  );

  saveCart(cart);
};
