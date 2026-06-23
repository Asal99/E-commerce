import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Package,
  Tag,
  Layers,
  Pencil,
  Search,
} from "lucide-react";

const API = `${import.meta.env.VITE_API_URL}/api/products`;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [edit, setEdit] = useState(null);
  const [search, setSearch] = useState("");

  const emptyForm = {
    name: "",
    price: "",
    category: "",
    type: "",
    tag: "",
    image: "",
    description: "",
    stock: "",
  };

  const [form, setForm] = useState(emptyForm);

  const token = () => localStorage.getItem("adminToken");

  const loadProducts = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((item) => {
    const keyword = search.toLowerCase();

    return [item.name, item.category, item.type, item.tag].some((value) =>
      value?.toLowerCase().includes(keyword),
    );
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const openAdd = () => {
    setEdit(null);
    setForm(emptyForm);
    setOpenModal(true);
  };

  const openEdit = (product) => {
    setEdit(product);
    setForm({
      name: product.name || "",
      price: product.price || "",
      category: product.category || "",
      type: product.type || "",
      tag: product.tag || "",
      image: product.image || "",
      description: product.description || "",
      stock: product.stock || "",
    });
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setEdit(null);
    setForm(emptyForm);
  };

  const saveProduct = async (e) => {
    e.preventDefault();

    const res = await fetch(edit ? `${API}/${edit._id}` : API, {
      method: edit ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token()}`,
      },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.message || "Save failed");
      return;
    }

    closeModal();
    loadProducts();
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;

    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token()}` },
    });

    loadProducts();
  };

  return (
    <div className="min-h-screen text-white">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            Store Management
          </p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Products</h1>
          <p className="mt-2 text-sm text-white/50">
            Add, edit, delete and manage your store products.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-black sm:w-auto"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Stat icon={Package} title="Total Products" value={products.length} />
        <Stat
          icon={Layers}
          title="Categories"
          value={new Set(products.map((p) => p.category)).size}
        />
        <Stat
          icon={Tag}
          title="Tagged Products"
          value={products.filter((p) => p.tag).length}
        />
      </div>

      <div className="relative mb-6 max-w-md">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
        />

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] py-4 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/30"
        />
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-10 text-center">
          <Package className="mx-auto text-white/30" size={44} />
          <h2 className="mt-4 text-xl font-bold">No products yet</h2>
          <p className="mt-2 text-white/40">Add your first product.</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-10 text-center">
          <h2 className="text-xl font-bold">No matching products</h2>
          <p className="mt-2 text-white/40">Try another product name.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((item) => (
            <div
              key={item._id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-[#1a1a1a]"
            >
              <div className="aspect-4/3 bg-black/40">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-5">
                <div className="flex justify-between gap-4">
                  <div>
                    <h2 className="line-clamp-1 text-lg font-bold">
                      {item.name}
                    </h2>
                    <p className="mt-1 text-sm text-white/40">
                      {item.category} · {item.type || "No type"}
                    </p>
                  </div>
                  <p className="font-black">Rs. {item.price}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tag && <Badge>{item.tag}</Badge>}
                  <Badge>Stock: {item.stock || 0}</Badge>
                </div>

                <p className="mt-4 line-clamp-2 text-sm text-white/40">
                  {item.description || "No description added."}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white py-3 font-bold text-black"
                  >
                    <Pencil size={17} />
                    Edit
                  </button>

                  <button
                    onClick={() => deleteProduct(item._id)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-3 font-bold text-red-400"
                  >
                    <Trash2 size={17} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#1a1a1a] p-5">
            <h2 className="mb-5 text-2xl font-black">
              {edit ? "Edit Product" : "Add Product"}
            </h2>

            <form
              onSubmit={saveProduct}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              {["name", "price", "type", "tag", "stock", "image"].map(
                (field) => (
                  <input
                    key={field}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    placeholder={field}
                    type={
                      field === "price" || field === "stock" ? "number" : "text"
                    }
                    required={["name", "price", "type", "image"].includes(
                      field,
                    )}
                    className={`rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none ${
                      field === "image" ? "md:col-span-2" : ""
                    }`}
                  />
                ),
              )}

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
              >
                <option value="">Select Category</option>
                <option value="apparel">Apparel</option>
                <option value="headwear">Headwear</option>
                <option value="eyewear">Eyewear</option>
                <option value="accessories">Accessories</option>
              </select>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="description"
                className="min-h-28 rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none md:col-span-2"
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end md:col-span-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-white/10 px-5 py-3 text-white/70"
                >
                  Cancel
                </button>

                <button className="rounded-xl bg-white px-5 py-3 font-bold text-black">
                  {edit ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ icon: Icon, title, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-5">
      <Icon className="text-white/40" size={22} />
      <p className="mt-4 text-sm text-white/40">{title}</p>
      <h2 className="mt-2 text-3xl font-black">{value}</h2>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
      {children}
    </span>
  );
}
