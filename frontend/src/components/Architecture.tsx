import * as styles from "@/lib/styles";
import TechnicalScene from "./three/TechnicalScene";
import type { TechnicalSceneVariant } from "./three/TechnicalScene";

const cards: Array<{
  id: string;
  variant: TechnicalSceneVariant;
  title: string;
  description: string;
  tags: string[];
}> = [
  {
    id: "canvas-1",
    variant: "lattice",
    title: "Quantum Lattice Array",
    description: "Multidimensional state routing with sub-millisecond convergence.",
    tags: ["0.2ms", "Self-healing"],
  },
  {
    id: "canvas-2",
    variant: "consensus",
    title: "Distributed Node Consensus",
    description: "Fault-tolerant memory allocation across edge regions.",
    tags: ["Paxos", "Global"],
  },
  {
    id: "canvas-3",
    variant: "access",
    title: "Multi-Tenant Access Control",
    description: "Cryptographically isolated execution boundaries.",
    tags: ["Zero-trust", "RBAC"],
  },
  {
    id: "canvas-4",
    variant: "audit",
    title: "Immutable Audit Trails",
    description: "Write-once read-many compliance logs.",
    tags: ["WORM", "SOC2"],
  },
];

export default function Architecture() {
  return (
    <section id="architecture" className="relative mx-auto mt-32 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-16 text-center">
        <h2 className="font-bebas-neue mb-4 text-4xl tracking-tight sm:text-5xl">
          Core Architecture Mapping
        </h2>
        <p className="mx-auto max-w-2xl text-zinc-400 font-sans">
          A visual breakdown of the underlying primitives that make the Vectorline spec console performant and reliable.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {cards.map((card) => (
          <article
            key={card.id}
            className="ui-card group relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm"
          >
            <div className="relative h-[240px] w-full border-b border-white/5 bg-[#070707]">
              <div className="absolute inset-0 opacity-30" style={styles.gridOverlay2rem}></div>
              <TechnicalScene variant={card.variant} label={card.title} />
              
              <div className="absolute right-4 top-4 flex gap-2">
                {card.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-black/50 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 backdrop-blur-md border border-white/10 font-sans"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="p-6 sm:p-8" style={styles.operatorsCard}>
              <h3 className="mb-2 text-xl font-light tracking-tighter text-white font-sans">
                {card.title}
              </h3>
              <p className="text-sm text-zinc-400 font-sans">{card.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
