import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F2F0E9] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md bg-white p-8 rounded-3xl border border-[#5A5A40]/10 shadow-xl space-y-4">
        <span className="text-4xl font-serif text-[#D4A373]">404</span>
        <h2 className="text-xl font-bold text-[#5A5A40]">Piece Not Found</h2>
        <p className="text-sm text-[#5A5A40]/70 leading-relaxed">
          The curated item or category you are looking for does not exist or has been moved from our atelier collection.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#5A5A40] text-white text-xs font-semibold rounded-2xl hover:bg-[#5A5A40]/90 transition-colors"
          >
            Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
