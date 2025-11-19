import React, { useEffect, useMemo, useState } from "react";
import {
  Car,
  Bolt,
  Star,
  Zap,
  Gauge,
  CarFront,
  Search,
  ArrowsUpDown,
  ChevronLeft,
  ChevronRight,
  X,
  Sliders,
} from "lucide-react";

/**
 * Enhanced Categories page:
 * - Fetches from /api/cars (if available) and falls back to local sample data
 * - Search, sort (price asc/desc), pagination
 * - Category-specific banners
 * - Car compare modal (select up to 3 cars)
 *
 * Notes:
 * - Replace fetch URL with your real backend endpoint if different.
 * - Image URLs are remote placeholders; you can replace them with your own images or API data.
 */

/* ---------- Category list ---------- */
const categoriesList = [
  { id: "suv", label: "SUV", icon: CarFront },
  { id: "sedan", label: "Sedan", icon: Car },
  { id: "hatchback", label: "Hatchback", icon: Gauge },
  { id: "sports", label: "Sports", icon: Zap },
  { id: "luxury", label: "Luxury", icon: Star },
  { id: "electric", label: "Electric", icon: Bolt },
];

/* ---------- Sample fallback dataset (used if API unreachable) ---------- */
/* Each car includes basic specs to show in comparison */
const fallbackCars = [
  {
    id: 1,
    name: "Toyota Fortuner",
    category: "suv",
    price: "3299000",
    displayPrice: "₹32,99,000",
    image: "https://images.pexels.com/photos/3580961/pexels-photo-3580961.jpeg",
    specs: { hp: 204, seats: 7, transmission: "AT", range: "—" },
  },
  {
    id: 2,
    name: "Honda City",
    category: "sedan",
    price: "1399000",
    displayPrice: "₹13,99,000",
    image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
    specs: { hp: 121, seats: 5, transmission: "CVT", range: "—" },
  },
  {
    id: 3,
    name: "Tata Punch",
    category: "hatchback",
    price: "899000",
    displayPrice: "₹8,99,000",
    image: "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg",
    specs: { hp: 86, seats: 5, transmission: "MT", range: "—" },
  },
  {
    id: 4,
    name: "BMW M4",
    category: "sports",
    price: "14000000",
    displayPrice: "₹1,40,00,000",
    image: "https://images.pexels.com/photos/102129/pexels-photo-102129.jpeg",
    specs: { hp: 473, seats: 4, transmission: "DCT", range: "—" },
  },
  {
    id: 5,
    name: "Mercedes S-Class",
    category: "luxury",
    price: "17500000",
    displayPrice: "₹1,75,00,000",
    image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
    specs: { hp: 362, seats: 5, transmission: "AT", range: "—" },
  },
  {
    id: 6,
    name: "Tesla Model 3",
    category: "electric",
    price: "4500000",
    displayPrice: "₹45,00,000 (Imported)",
    image: "https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg",
    specs: { hp: 283, seats: 5, transmission: "Single-speed", range: "450 km" },
  },
  // duplicate items to demonstrate pagination
  {
    id: 7,
    name: "Hyundai Creta",
    category: "suv",
    price: "1299000",
    displayPrice: "₹12,99,000",
    image: "https://images.pexels.com/photos/11491307/pexels-photo-11491307.jpeg",
    specs: { hp: 115, seats: 5, transmission: "AT/MT", range: "—" },
  },
  {
    id: 8,
    name: "Kia Seltos",
    category: "suv",
    price: "1399000",
    displayPrice: "₹13,99,000",
    image: "https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg",
    specs: { hp: 138, seats: 5, transmission: "DCT", range: "—" },
  },
];

/* ---------- Category banners ---------- */
const banners: Record<string, { title: string; subtitle: string; image?: string }> = {
  suv: {
    title: "Built for adventure",
    subtitle: "Explore rugged SUVs with space and power.",
    image: "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg",
  },
  sedan: {
    title: "Comfort & Efficiency",
    subtitle: "Stylish sedans for everyday driving.",
    image: "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg",
  },
  hatchback: {
    title: "Compact & Nimble",
    subtitle: "Perfect for city life and easy parking.",
    image: "https://images.pexels.com/photos/11491307/pexels-photo-11491307.jpeg",
  },
  sports: {
    title: "Performance Unleashed",
    subtitle: "Heart-pounding speed and precision handling.",
    image: "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg",
  },
  luxury: {
    title: "Luxury Redefined",
    subtitle: "Top-tier comfort and elegant design.",
    image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
  },
  electric: {
    title: "Drive the Future",
    subtitle: "Electric cars — efficient, silent, powerful.",
    image: "https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg",
  },
};

/* ---------- Helpers ---------- */
const parsePrice = (p: string | number) => {
  const n = typeof p === "number" ? p : Number(String(p).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const ITEMS_PER_PAGE_OPTIONS = [6, 9, 12];

const Categories: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("suv");
  const [cars, setCars] = useState<typeof fallbackCars>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search / sort / pagination
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"relevance" | "price_asc" | "price_desc">(
    "relevance"
  );
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);

  // Compare state
  const [compareSet, setCompareSet] = useState<number[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  useEffect(() => {
    // Reset pagination & query when category changes
    setPage(1);
    setQuery("");
  }, [selectedCategory]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    // Try to fetch from API first, fallback to local sample data
    // Replace '/api/cars' with your backend endpoint if different
    fetch("/api/cars")
      .then(async (res) => {
        if (!mounted) return;
        if (!res.ok) throw new Error("API returned " + res.status);
        const data = await res.json();
        // Expecting array of cars with fields: id, name, category, price, displayPrice, image, specs
        setCars(Array.isArray(data) && data.length ? data : fallbackCars);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        // API not available -> use fallback data
        setCars(fallbackCars);
        setLoading(false);
        // don't set error loudly; keep graceful
      });

    return () => {
      mounted = false;
    };
  }, []);

  /* ---------- Derived list: filter by category, search, sort ---------- */
  const filtered = useMemo(() => {
    const base = cars.filter((c) => c.category === selectedCategory);

    // Search across name
    const searched = query
      ? base.filter((c) =>
          c.name.toLowerCase().includes(query.trim().toLowerCase())
        )
      : base;

    // Sort
    const sorted = [...searched].sort((a, b) => {
      if (sort === "price_asc") return parsePrice(a.price) - parsePrice(b.price);
      if (sort === "price_desc") return parsePrice(b.price) - parsePrice(a.price);
      // relevance -> keep original order
      return 0;
    });

    return sorted;
  }, [cars, selectedCategory, query, sort]);

  /* ---------- Pagination ---------- */
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  /* ---------- Compare handlers (max 3) ---------- */
  function toggleCompare(id: number) {
    setCompareSet((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) {
        // replace oldest with new selection
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  }

  function openCompare() {
    if (compareSet.length < 2) {
      alert("Select at least two cars to compare (max 3).");
      return;
    }
    setCompareOpen(true);
  }

  function clearCompare() {
    setCompareSet([]);
    setCompareOpen(false);
  }

  /* ---------- UI render ---------- */
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Browse by Categories</h1>
            <p className="text-sm text-gray-600 mt-1">
              Find the perfect car — filter, search, sort and compare quickly.
            </p>
          </div>

          <div className="flex gap-3 items-center">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search cars by name..."
                className="pl-9 pr-3 py-2 rounded-lg border bg-white w-64"
                aria-label="Search cars"
              />
            </div>

            <div className="flex items-center gap-2">
              <ArrowsUpDown className="w-4 h-4 text-gray-600" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="py-2 px-3 rounded-lg border bg-white"
              >
                <option value="relevance">Relevance</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
              </select>
            </div>

            <button
              onClick={openCompare}
              className="ml-2 bg-amber-500 text-white py-2 px-3 rounded-lg hover:brightness-95 transition"
              title="Compare selected cars"
            >
              Compare ({compareSet.length})
            </button>
          </div>
        </header>

        {/* Category buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
          {categoriesList.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                }}
                className={`flex flex-col items-center p-3 rounded-xl border transition ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
                aria-pressed={isActive}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Banner */}
        <div className="rounded-xl overflow-hidden mb-6 shadow">
          {banners[selectedCategory] ? (
            <div
              className="relative h-44 md:h-56 flex items-center"
              style={{
                backgroundImage: `url(${banners[selectedCategory].image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
              <div className="relative z-10 p-6 md:p-10 text-white">
                <h2 className="text-2xl md:text-4xl font-bold">
                  {banners[selectedCategory].title}
                </h2>
                <p className="mt-1 md:mt-2 text-sm md:text-lg">
                  {banners[selectedCategory].subtitle}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6">No banner available.</div>
          )}
        </div>

        {/* Cars Grid */}
        <main>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold capitalize">
              {selectedCategory} Cars ({total})
            </h3>

            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Per page</label>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="py-2 px-2 rounded-lg border bg-white"
              >
                {ITEMS_PER_PAGE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading cars...</div>
          ) : total === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No cars found in this category.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {paginated.map((car) => {
                  const isCompared = compareSet.includes(car.id);
                  return (
                    <div
                      key={car.id}
                      className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col"
                    >
                      <div className="relative">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-full h-44 md:h-40 object-cover rounded-lg mb-3"
                        />
                        <label className="absolute top-3 right-3 bg-white/90 rounded px-2 py-1 text-xs flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isCompared}
                            onChange={() => toggleCompare(car.id)}
                            className="w-4 h-4"
                            aria-label={`Compare ${car.name}`}
                          />
                          <span>Compare</span>
                        </label>
                      </div>

                      <div className="flex-1">
                        <h4 className="text-lg font-semibold">{car.name}</h4>
                        <p className="text-sm text-gray-600">{car.displayPrice ?? `₹${parsePrice(car.price).toLocaleString()}`}</p>

                        <div className="mt-3 text-sm text-gray-700 grid grid-cols-3 gap-2">
                          <div className="text-center">
                            <div className="font-medium">{car.specs?.hp ?? "—"}</div>
                            <div className="text-gray-500">HP</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{car.specs?.seats ?? "—"}</div>
                            <div className="text-gray-500">Seats</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{car.specs?.transmission ?? "—"}</div>
                            <div className="text-gray-500">Trans</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            // quick quick action: open external detail route if exists
                            // For example: navigate(`/car/${car.id}`)
                            alert("Open detail view for: " + car.name);
                          }}
                          className="w-12 rounded-lg border flex items-center justify-center"
                        >
                          <Sliders className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination controls */}
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing{" "}
                  <strong>
                    {(page - 1) * perPage + 1}
                    {" - "}
                    {Math.min(page * perPage, total)}
                  </strong>{" "}
                  of {total}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="p-2 rounded-lg border bg-white disabled:opacity-50"
                    disabled={page === 1}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="px-3 py-2 rounded-lg border bg-white">
                    Page {page} / {totalPages}
                  </div>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="p-2 rounded-lg border bg-white disabled:opacity-50"
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Compare drawer/modal */}
      {compareOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setCompareOpen(false)}
          />
          <div className="relative bg-white rounded-t-xl md:rounded-xl w-full md:w-4/5 lg:w-3/4 max-h-[85vh] overflow-auto p-6 z-10">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h4 className="text-xl font-bold">Compare Cars</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    clearCompare();
                  }}
                  className="px-3 py-1 rounded-lg border"
                >
                  Clear
                </button>
                <button
                  onClick={() => setCompareOpen(false)}
                  className="px-3 py-1 rounded-lg bg-gray-100 border"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {compareSet.map((id) => {
                const car = cars.find((c) => c.id === id) || fallbackCars.find((c) => c.id === id);
                if (!car) return null;
                return (
                  <div key={id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <img src={car.image} alt={car.name} className="w-28 h-20 object-cover rounded" />
                      <div>
                        <div className="font-semibold">{car.name}</div>
                        <div className="text-sm text-gray-600">{car.displayPrice ?? `₹${parsePrice(car.price).toLocaleString()}`}</div>
                      </div>
                    </div>

                    <div className="mt-4 text-sm space-y-2">
                      <div>
                        <div className="text-xs text-gray-500">Horsepower</div>
                        <div className="font-medium">{car.specs?.hp ?? "—"} HP</div>
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
                        <div className="text-xs text-gray-500">Range</div>
                        <div className="font-medium">{car.specs?.range ?? "—"}</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() => {
                          // show more details or navigate to car detail
                          alert("Open detail for " + car.name);
                        }}
                        className="w-full py-2 rounded-lg bg-blue-600 text-white"
                      >
                        View full details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* If less than 2 cars selected show hint */}
            {compareSet.length < 2 && (
              <div className="mt-4 text-sm text-gray-600">
                Select at least two cars to see a meaningful comparison.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
