import Loader from "./Loader";

/** Centered loader on a full-viewport surface — used by route `loading.tsx` files. */
export default function FullScreenLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="grid min-h-[70vh] w-full place-items-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <Loader size={110} variant="brand" label={label} />
        <p className="font-label text-xs uppercase tracking-[0.32em] text-muted">{label}</p>
      </div>
    </div>
  );
}
