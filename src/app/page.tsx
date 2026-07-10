import Image from 'next/image'
import Link from 'next/link'
import RouteFilter from '@/components/RouteFilter'

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--cream)] text-[var(--body-text)]">

      <div className="bg-[var(--navy)] px-6 py-10 text-center border-b-4 border-[var(--gold)]">
        <p className="text-[var(--gold)] text-xs tracking-[0.3em] uppercase mb-2 font-mono">
          POSTCARD COLLECTION
        </p>
        <h1 className="font-serif text-5xl font-black text-[var(--cream)] leading-none">
          Asbury Park
        </h1>
        <h2 className="font-serif text-4xl italic text-[var(--gold)] leading-none mt-1">
          Postmarks
        </h2>
        <p className="text-[var(--gold)] text-sm italic mt-3 opacity-70 leading-relaxed max-w-xs mx-auto">
          Collect postcards around Asbury Park. Postmarks confirm visits.
        </p>
        <div className="mt-6 max-w-sm mx-auto overflow-hidden rounded-sm">
          <Image
            src="/opengraph-image.jpg"
            alt="Asbury Park Postmarks"
            width={1200}
            height={630}
            className="w-full opacity-80"
            priority
          />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <p className="font-serif text-lg leading-relaxed text-[var(--body-text)]">
          PLACEHOLDER_INTRO_COPY
        </p>

        <Link
          href="/passport"
          className="block w-full mt-8 py-4 bg-[var(--navy)] text-[var(--cream)] text-center
                     font-mono text-sm tracking-widest uppercase rounded-sm
                     shadow-[3px_3px_0_var(--gold)] hover:translate-x-[-1px]
                     hover:translate-y-[-1px] hover:shadow-[4px_4px_0_var(--gold)]
                     transition-all"
        >
          View Your Postcards
        </Link>

        <Link
          href="/map"
          className="block w-full mt-3 py-4 border border-[var(--navy)] text-[var(--navy)]
                     text-center font-mono text-sm tracking-widest uppercase rounded-sm
                     hover:bg-[var(--navy)] hover:text-[var(--cream)] transition-all"
        >
          Explore the Map
        </Link>

        <p className="font-mono text-[10px] tracking-widest text-[var(--navy-mid)] opacity-40
                      uppercase text-center mt-8">
          Asbury Park, NJ · PLACEHOLDER_ROUTE_SUMMARY
        </p>
      </div>

      <div className="bg-[var(--navy)] border-t-2 border-b-2 border-[var(--gold)] px-6 py-10">
        <div className="max-w-2xl mx-auto">
          <p className="font-mono text-[var(--gold)] text-[10px] tracking-[0.35em] uppercase mb-4">
            Data Pending
          </p>
          <h2 className="font-serif text-2xl font-bold text-[var(--cream)] mb-5 leading-snug">
            PLACEHOLDER_FEATURE_HEADING
          </h2>
          <p className="font-serif text-[var(--gold-light)] text-base leading-relaxed opacity-90">
            PLACEHOLDER_FEATURE_COPY
          </p>
        </div>
      </div>

      <RouteFilter />

      <div className="bg-[var(--navy)] px-6 py-8 text-center border-t-2 border-[var(--gold)]">
        <p className="font-serif italic text-[var(--gold)] text-sm opacity-70 leading-relaxed">
          PLACEHOLDER_FOOTER_COPY
        </p>
        <div className="mt-6 pt-6 border-t border-[var(--gold)]/20 max-w-md mx-auto">
          <p className="font-mono text-[10px] tracking-widest text-[var(--gold)] opacity-60 uppercase">
            Built by Peachy Kean DevOps
          </p>
          <a
            href="mailto:john@peachykeandev.com"
            className="inline-block font-mono text-[11px] text-[var(--gold)] opacity-80 hover:opacity-100 mt-3 underline underline-offset-4"
          >
            john@peachykeandev.com
          </a>
        </div>
        <p className="font-mono text-[10px] text-[var(--gold)] opacity-40 tracking-widest mt-6">
          #AsburyParkPostmarks
        </p>
      </div>

    </main>
  )
}
