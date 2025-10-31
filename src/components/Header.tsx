import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white">
      <div className="px-6 sm:px-8">
        <div className="flex items-center justify-between py-6">
          <Link href="/" className="text-xs font-light tracking-widest text-gray-900 uppercase hover:text-gray-600 transition-colors">
            Another Puffy Jacket
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/category/jackets"
              className="text-xs font-light tracking-wide text-gray-600 hover:text-gray-900 transition-colors uppercase"
            >
              Jackets
            </Link>
            <Link
              href="/category/packs"
              className="text-xs font-light tracking-wide text-gray-600 hover:text-gray-900 transition-colors uppercase"
            >
              Packs
            </Link>
            <Link
              href="/category/footwear"
              className="text-xs font-light tracking-wide text-gray-600 hover:text-gray-900 transition-colors uppercase"
            >
              Footwear
            </Link>
            <Link
              href="/category/accessories"
              className="text-xs font-light tracking-wide text-gray-600 hover:text-gray-900 transition-colors uppercase"
            >
              Accessories
            </Link>
          </nav>

          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="text-xs font-light tracking-wide text-gray-500 hover:text-gray-900 transition-colors"
            >
              About
            </Link>
            <Link
              href="/submit"
              className="text-xs font-light tracking-wide text-gray-500 hover:text-gray-900 transition-colors"
            >
              Submit
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
