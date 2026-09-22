import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center bg-white px-6 pt-[84px] text-center">
      <div>
        <p className="font-display text-7xl text-navy">404</p>
        <h1 className="mt-4 font-display text-2xl text-navy">Page not found</h1>
        <p className="mt-3 text-sm text-slate">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-navy px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-orange"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
