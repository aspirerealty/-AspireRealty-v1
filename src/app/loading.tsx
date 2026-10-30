import BrandLoader from "@/components/brand/BrandLoader";

// Shown while a page is loading during navigation.
export default function Loading() {
  return (
    <section className="grid min-h-svh place-items-center bg-navy-950">
      <BrandLoader />
    </section>
  );
}
