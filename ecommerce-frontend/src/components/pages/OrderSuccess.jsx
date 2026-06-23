import { Link } from "react-router-dom";
import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useToast } from "../../ui/Toast";

export default function OrderSuccess() {
  const { showToast } = useToast();

  useEffect(() => {
    showToast({
      type: "success",
      message: "Order placed successfully",
    });
  }, [showToast]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f2] px-4 py-20 sm:px-6">
      <div className="w-full max-w-xl rounded-4xl border border-black/5 bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-black text-white sm:h-24 sm:w-24">
          <CheckCircle size={44} />
        </div>

        <h1 className="mb-4 text-4xl font-black tracking-tighter sm:text-5xl">
          Order Placed Successfully
        </h1>

        <p className="mb-10 text-base leading-7 text-neutral-500 sm:text-lg">
          Thank you for your purchase. We have received your order and will
          begin processing it shortly.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap">
          <Link
            to="/my-orders"
            className="rounded-full bg-black px-7 py-4 text-sm uppercase tracking-widest text-white hover:bg-neutral-800"
          >
            View My Orders
          </Link>

          <Link
            to="/shop"
            className="rounded-full border border-black/20 px-7 py-4 text-sm uppercase tracking-widest hover:bg-black hover:text-white"
          >
            Continue Shopping
          </Link>

          <Link
            to="/"
            className="rounded-full border border-black px-7 py-4 text-sm uppercase tracking-widest hover:bg-black hover:text-white"
          >
            Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}
