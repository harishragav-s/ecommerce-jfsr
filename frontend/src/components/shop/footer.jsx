import { Link } from "react-router-dom";

const cols = [
  {
    title: "Shop",
    links: [
      ["Men", "/shop/listing?category=men"],
      ["Women", "/shop/listing?category=women"],
      ["Kids", "/shop/listing?category=kids"],
      ["Footwear", "/shop/listing?category=footwear"],
      ["Accessories", "/shop/listing?category=accessories"],
    ],
  },
  {
    title: "My account",
    links: [
      ["Profile", "/shop/account?tab=profile"],
      ["Orders", "/shop/account?tab=orders"],
      ["Wishlist", "/shop/wishlist"],
      ["Addresses", "/shop/account?tab=addresses"],
    ],
  },
  { title: "Help", links: [["Shipping", "/shop/help"], ["Returns", "/shop/help"], ["Contact us", "/shop/help"]] },
];

function ShoppingFooter() {
  return (
    <footer className="mt-auto bg-gray-900 text-gray-300">
      <div className="container mx-auto grid grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <p className="mb-3 text-xl font-black text-white">STYLE<span className="text-red-500">KART</span></p>
          <p className="text-sm text-gray-400">Your favourite brands, delivered to your door.</p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <p className="mb-3 text-sm font-semibold text-white">{col.title}</p>
            <ul className="space-y-2 text-sm">
              {col.links.map(([label, to]) => (
                <li key={label}><Link to={to} className="hover:text-white">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} StyleKart ·
      </div>
    </footer>
  );
}

export default ShoppingFooter;
