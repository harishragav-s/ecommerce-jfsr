import { Truck, RotateCcw, CreditCard, Mail } from "lucide-react";

const faqs = [
  { icon: Truck, q: "How long does delivery take?", a: "Most orders arrive in 3-5 working days. Delivery is free on orders above ₹999; below that there's a flat ₹79 fee." },
  { icon: RotateCcw, q: "What's the return policy?", a: "You can return unused items with tags within 30 days of delivery for a full refund." },
  { icon: CreditCard, q: "Which payment methods do you accept?", a: "Cards, UPI and cash on delivery. (This is a demo store, so no real payment is ever taken.)" },
  { icon: Mail, q: "How do I contact support?", a: "Write to support@stylekart.example and we'll get back to you within 24 hours." },
];

function HelpPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Help centre</h1>
      <p className="mb-10 text-gray-500">Answers to the questions we get asked most.</p>
      <div className="space-y-4">
        {faqs.map(({ icon: Icon, q, a }) => (
          <details key={q} className="group rounded-xl border p-5 open:shadow-sm">
            <summary className="flex cursor-pointer list-none items-center gap-3 font-semibold">
              <Icon className="h-5 w-5 text-gray-500" /> {q}
            </summary>
            <p className="mt-3 pl-8 text-sm text-gray-600">{a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export default HelpPage;
