"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import styles from "./page.module.css";

const offerings = [
  { title: "Paint Your Own Pottery", text: "Choose from 200+ bisque designs, paint your piece your way, and we glaze and fire it for you.", image: "/cards/paint-your-own-pottery.png", href: "/paint-your-own-pottery" },
  { title: "Glass", text: "Discover fused glass and stained glass with GlassXpressions, at home in Crafteris.", image: "/workshops/fused-glass.png", href: "/glass" },
  { title: "Pottery", text: "Get your hands into clay with hand building and wheel throwing.", image: "/programmes/wheel-throwing.png", href: "/pottery" },
  { title: "Mosaic", text: "Explore colour, shape and pattern, one piece at a time.", image: "", href: "/mosaic" },
  { title: "Workshops", text: "Enjoy a creative session, try a technique and make something of your own.", image: "/cards/workshops.png", href: "/workshops" },
  { title: "Courses", text: "Build your skills through structured learning and guided projects.", image: "/cards/programmes-courses.png", href: "/programmes" },
  { title: "Team Building & Groups", text: "Bring colleagues, friends, schools or private groups together through making.", image: "/team-building/team-building.jpg", href: "/team-building" },
  { title: "Studio Membership", text: "One studio membership. Time, space and facilities to keep creating and develop your projects.", image: "/membership-page/membership-hero.png", href: "/membership" },
  { title: "Shop", text: "200+ bisque designs, stained glass, mosaic, clay bodies, pottery glazes, colours, tools and supplies.", image: "/shop/studio-shelves.png", href: "/shop" },
];

export default function Home() {
  const supabase = useMemo(() => createClient(), []);
  const [heroImage, setHeroImage] = useState("/membership-card.png");
  useEffect(() => {
    let active = true;
    void supabase.from("page_sections").select("image_url").eq("page_key", "home").eq("section_key", "hero").maybeSingle().then(({ data }) => {
      if (active && data?.image_url) setHeroImage(data.image_url);
    });
    return () => { active = false; };
  }, [supabase]);
  return <div className={styles.page}>
    <Header />
    <main>
      <section className={styles.homeHero}>
        <div className={styles.homeHeroCopy}>
          <p className={styles.eyebrow}>Your creative studio in Birkirkara, Malta</p>
          <h1>Make something worth keeping.</h1>
          <p className={styles.heroLead}>Glass, pottery, mosaic and pottery painting—a creative studio in Birkirkara, Malta. Join a workshop or course, create independently, or find materials for your next project.</p>
          <p className={styles.brandIntro}><strong>Home of GlassXpressions.</strong> The same glass studio you know, with more ways to create.</p>
          <img className={styles.glassLogo} src="/glassxpressions-logo.jpg" alt="GlassXpressions Creative Studio" />
          <div className={styles.homeActions}><Link href="#offerings-heading">Explore the studio</Link><Link href="/workshops">Browse workshops</Link></div>
        </div>
        <img className={styles.homeHeroPhoto} src={heroImage} alt="Colourful creative work at Crafteris" />
      </section>
      <section className={styles.offerings} aria-labelledby="offerings-heading">
        <p className={styles.eyebrow}>Explore Crafteris</p>
        <h2 id="offerings-heading">Find your way to create.</h2>
        <p className={styles.sectionIntro}>Try something new, develop a skill, make together or find materials for your next project.</p>
        <div className={styles.offeringGrid}>{offerings.map(item => <Link className={styles.offeringCard} href={item.href} key={item.title}>
          {item.image ? <img src={item.image} alt={item.title} /> : <div className={styles.mosaicArtwork} role="img" aria-label="Colourful mosaic tile pattern" />}
          <div className={styles.offeringCopy}><h3>{item.title}<span aria-hidden="true">↗</span></h3><p>{item.text}</p></div>
        </Link>)}</div>
      </section>
      <section className={styles.shopFeature} aria-labelledby="shop-heading">
        <p className={styles.eyebrow}>Materials for makers</p><h2 id="shop-heading">A world of colour on our shelves.</h2>
        <div className={styles.shopFacts}><p><strong>200+</strong>colours of stained glass</p><p><strong>180</strong>mosaic shapes and colours</p><p><strong>180+</strong>pottery glazes and colours</p></div>
        <p>Plus 200+ bisque designs to choose from, clay bodies, tools and supplies for your next creative project.</p><Link href="/shop">Explore the shop →</Link>
      </section>
    </main><Footer />
  </div>;
}
