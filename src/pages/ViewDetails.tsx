import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

/**
 * ViewDetails page:
 * - fetches car by id
 * - shows full specs, seller info
 * - EMI calculator
 * - Send message form + call seller button (number added)
 * - Razorpay payment integration (client side)
 * - Shows payment history (if provided by API)
 */

const formatINR = (value: number | string) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    Number(String(value).replace(/[^\d.-]/g, "")) || 0
  );

const CALL_NUMBER = "+918847784496"; // as requested

const ViewDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [car, setCar] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [emi, setEmi] = useState({ principal: 0, years: 5, rate: 9.5, monthly: 0 });
  const [message, setMessage] = useState("");
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);

  useEffect(() => {
    // Fetch car details (replace endpoint with your API)
    fetch(`/api/cars/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setCar(data);
        // fill default EMI principal from car price if available
        const priceNum = data?.price ? Number(String(data.price).replace(/[^\d.-]/g, "")) : 0;
        setEmi((e) => ({ ...e, principal: priceNum }));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    // Fetch payment history
    fetch(`/api/payments/history?carId=${id}`)
      .then((r) => r.json())
      .then((h) => setPaymentHistory(h || []))
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    // compute monthly EMI formula
    const P = Number(emi.principal) || 0;
    const annualRate = Number(emi.rate) / 100;
    const n = Number(emi.years) * 12;
    if (P <= 0 || n === 0) {
      setEmi((prev) => ({ ...prev, monthly: 0 }));
      return;
    }
    const r = annualRate / 12;
    const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setEmi((prev) => ({ ...prev, monthly: Math.round(monthly) }));
  }, [emi.principal, emi.years, emi.rate]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!car) return <div className="p-6">Car not found</div>;

  function handleSendMessage() {
    // POST message to seller
    fetch(`/api/messages`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        carId: car.id,
        sellerId: car.sellerId,
        message,
      }),
    })
      .then((r) => r.json())
      .then(() => {
        alert("Message sent to seller");
        setMessage("");
      })
      .catch(() => alert("Error sending message"));
  }

  async function handlePayment() {
    // Create order on server, then call Razorpay checkout
    const res = await fetch(`/api/payments/create-order`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ amount: Number(car.price).toFixed(0) || 0, carId: car.id }),
    });
    const data = await res.json();
    if (!data?.orderId) return alert("Payment initialization failed");

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);

    script.onload = () => {
      // Open Razorpay
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY || "rzp_test_xxx", // set env
        amount: data.amount,
        currency: "INR",
        name: "Car Connect",
        description: `Payment for ${car.name}`,
        order_id: data.orderId,
        handler: function (response: any) {
          // verify on server
          fetch("/api/payments/verify", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ ...response, orderId: data.orderId, carId: car.id }),
          })
            .then((r) => r.json())
            .then((r) => {
              if (r.success) {
                alert("Payment successful");
                // refresh payment history
                fetch(`/api/payments/history?carId=${id}`)
                  .then((r) => r.json())
                  .then((h) => setPaymentHistory(h || []))
                  .catch(() => {});
              } else {
                alert("Payment verification failed");
              }
            });
        },
        prefill: {
          name: car.sellerName ?? "",
          contact: car.sellerPhone ?? "",
        },
        theme: { color: "#2563eb" },
      };
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    };
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3 bg-white rounded-xl shadow p-4">
          <img src={car.image} alt={car.name} className="w-full h-80 object-cover rounded-lg" />
          <h1 className="text-2xl font-bold mt-4">{car.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="text-xl font-semibold">{formatINR(car.price)}</div>
            <div className="text-sm text-gray-600">| {car.location ?? "Location not set"}</div>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-500">Horsepower</div>
              <div className="font-medium">{car.specs?.hp ?? "—"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Seats</div>
              <div className="font-medium">{car.specs?.seats ?? "—"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Transmission</div>
              <div className="font-medium">{car.specs?.transmission ?? "—"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Fuel</div>
              <div className="font-medium">{car.fuel ?? "—"}</div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="text-sm text-gray-700 mt-2">{car.description ?? "No description provided."}</p>
          </div>

          {/* EMI Calculator */}
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold">EMI Calculator</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <div>
                <label className="text-xs text-gray-500">Loan Amount</label>
                <input
                  type="number"
                  value={emi.principal}
                  onChange={(e) => setEmi((s) => ({ ...s, principal: Number(e.target.value) }))}
                  className="mt-1 w-full rounded border p-2"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Tenure (years)</label>
                <input
                  type="number"
                  value={emi.years}
                  min={1}
                  onChange={(e) => setEmi((s) => ({ ...s, years: Number(e.target.value) }))}
                  className="mt-1 w-full rounded border p-2"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Interest Rate (p.a.)</label>
                <input
                  type="number"
                  value={emi.rate}
                  step="0.1"
                  onChange={(e) => setEmi((s) => ({ ...s, rate: Number(e.target.value) }))}
                  className="mt-1 w-full rounded border p-2"
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm text-gray-500">Estimated Monthly EMI</div>
              <div className="text-2xl font-bold">{formatINR(emi.monthly)}</div>
            </div>
          </div>
        </div>

        {/* Right column: seller + actions */}
        <aside className="md:w-1/3 space-y-4">
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Seller</div>
                <div className="font-semibold">{car.sellerName ?? "Seller name"}</div>
                <div className="text-xs text-gray-500">{car.sellerLocation ?? ""}</div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <a href={`tel:${CALL_NUMBER}`} className="block w-full text-center py-2 rounded-lg bg-green-600 text-white">
                Call Seller (+91 88477 84496)
              </a>
              <button onClick={() => {
                navigate(`/chat/${car.id}`);
              }} className="w-full py-2 rounded-lg border">
                Message Seller
              </button>

              <button onClick={() => {
                // Book test drive route (stub)
                navigate(`/book-drive?carId=${car.id}`);
              }} className="w-full py-2 rounded-lg bg-blue-600 text-white">
                Book Test Drive
              </button>

              <button onClick={handlePayment} className="w-full py-2 rounded-lg bg-amber-500 text-white">
                Pay / Purchase
              </button>
            </div>
          </div>

          {/* Send direct message */}
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-sm text-gray-600">Send a message to seller</div>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="mt-2 w-full rounded border p-2" rows={4} />
            <button onClick={handleSendMessage} className="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg">
              Send Message
            </button>
          </div>

          {/* Payment history */}
          <div className="bg-white rounded-xl p-4 shadow">
            <h4 className="font-semibold">Payment History</h4>
            {paymentHistory.length === 0 ? (
              <div className="text-sm text-gray-500 mt-2">No payments yet.</div>
            ) : (
              <ul className="mt-2 space-y-2">
                {paymentHistory.map((p) => (
                  <li key={p._id} className="text-sm flex justify-between">
                    <div>{p.purpose ?? "Purchase"}</div>
                    <div>{formatINR(p.amount)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ViewDetails;
