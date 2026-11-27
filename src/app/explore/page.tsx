import Image from "next/image";
import { pageSeo } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import styles from "./explore.module.css";

export const metadata = pageSeo("/explore", "Explore Pottery, Glass & Mosaic in Malta", "Discover pottery painting, glass fusing, stained glass, handbuilding, wheel throwing and mosaic at Crafteris Studio.", "/cards/paint-your-own-pottery.png");

const crafts = [
  { title: "Paint Your Own Pottery", meta: "Relax, paint & enjoy", text: "Choose a ready-to-paint piece, decorate it your way and leave the glazing and firing to us. No experience needed.", image: "/pick-a-piece/paint-pottery.png", href: "/paint-your-own-pottery", label: "Explore pottery painting" },
  { title: "Glass", meta: "Colour, light & imagination", text: "Discover fused glass and stained glass with GlassXpressions. Try a guided project, learn a technique or develop your own designs.", image: "/workshops/fused-glass.png", href: "/glass", label: "Explore glass" },
  { title: "Pottery", meta: "Shape something of your own", text: "Get your hands into clay through hand building and wheel throwing. Learn new skills or keep making independently.", image: "/programmes/wheel-throwing.png", href: "/pottery", label: "Explore pottery" },
  { title: "Mosaic", meta: "Piece by colourful piece", text: "Combine colourful shapes, textures and patterns to create something personal. Discover materials, project ideas and guided workshops.", image: "/mosaic/mosaic-worktable.webp", href: "/mosaic", label: "Explore mosaic" },
];

const ways = [
  { title: "Workshops", text: "Try a guided creative project in a single session.", href: "/workshops" },
  { title: "Courses", text: "Develop your skills through structured learning.", href: "/programmes" },
  { title: "Studio Membership", text: "Make regularly with access to shared studio facilities.", href: "/membership" },
  { title: "Shop", text: "Find materials and tools for your next project.", href: "/shop" },
];

export default function ExplorePage() {
  return <><Header /><main className={styles.page}>
    <section className={styles.hero}><div className={styles.heroInner}>
      <p className={styles.eyebrow}>Explore Crafteris Studio · Birkirkara, Malta</p>
      <h1>Find your way to create.</h1>
      <p className={styles.heroDescription}>Four crafts, endless possibilities. Whether you are trying something new or developing your skills, discover what you can make at Crafteris, home to GlassXpressions.</p>
    </div></section>
    <section className={styles.optionsSection} aria-labelledby="crafts-heading">
      <div className={styles.sectionHeading}><h2 id="crafts-heading">What would you like to make?</h2><p>Choose a craft to discover the experiences, materials and ways to get started.</p></div>
      <div className={styles.optionsGrid}>{crafts.map(craft => <article key={craft.href} className={styles.optionCard}>
        <Link href={craft.href} className={styles.optionImageWrapper} aria-label={craft.label}><img src={craft.image} alt={craft.title} className={styles.optionImage} loading="lazy" /></Link>
        <div className={styles.optionContent}><p className={styles.bestFor}>{craft.meta}</p><h3>{craft.title}</h3><p className={styles.optionDescription}>{craft.text}</p><Link href={craft.href} className={styles.optionLink}>{craft.label}<span aria-hidden="true">→</span></Link></div>
      </article>)}</div>
    </section>
    <section className={styles.groupFeature}><Image width={1200} height={800} sizes="(max-width: 700px) 100vw, 600px" src="/team-building/team-building.jpg" alt="A group creating together" /><div><p className={styles.eyebrow}>Better together</p><h2>Team building &amp; private groups</h2><p>Bring colleagues, friends, families or schools together for a creative experience. We can help you choose a project for your occasion.</p><Link className={styles.optionLink} href="/team-building">Explore group experiences <span aria-hidden="true">→</span></Link></div></section>
    <section className={styles.waysSection} aria-labelledby="ways-heading"><div className={styles.sectionHeading}><p className={styles.eyebrow}>Your next creative step</p><h2 id="ways-heading">Make it your way.</h2></div><div className={styles.waysGrid}>{ways.map(way => <Link key={way.href} href={way.href}><h3>{way.title} <span aria-hidden="true">↗</span></h3><p>{way.text}</p></Link>)}</div></section>
    <section className={styles.finalCta}><div><p className={styles.eyebrow}>Ready to create?</p><h2>Find your next experience.</h2><p>See upcoming sessions or get in touch to plan your visit.</p><div className={styles.finalActions}><Link className={styles.primaryButton} href="/whats-on">See what&apos;s on</Link><Link className={styles.secondaryButton} href="/visit">Visit the studio →</Link></div></div></section>
  </main><Footer /></>;
}
