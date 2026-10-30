import PageHero from "./PageHero";

// Shared layout for Privacy Policy, Terms and Disclaimer pages.
export default function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: { heading: string; body: string[] }[] }) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} image="/assets/images/office.jpg" crumbs={[{ href: "/", label: "Home" }, { label: title }]} />
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="text-sm text-muted">Last updated: {updated}</p>
          {/* TODO: have this text reviewed by your legal advisor before launch */}
          <div className="mt-10 space-y-10">
            {sections.map((s) => (
              <div key={s.heading}>
                <h2 className="font-display text-3xl text-navy-900">{s.heading}</h2>
                <div className="mt-4 space-y-4 leading-relaxed text-muted">
                  {s.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
