"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import styles from "./page.module.css";

const offerings = [
  { title: "Discover the crafts", text: "Paint your own pottery, explore fused and stained glass, shape clay or make a mosaic. Find the craft that speaks to you.", image: "/cards/paint-your-own-pottery.png", href: "/explore", label: "Explore the studio" },
  { title: "Book a creative experience", text: "Enjoy a guided workshop, a pottery painting session or a course. Come on your own or share the experience with someone.", image: "/cards/workshops.png", href: "/whats-on", label: "See what’s on" },
  { title: "Make it your studio", text: "One membership for glass, pottery and mosaic. Enjoy shared facilities, flexible access and a community of makers.", image: "/membership-page/membership-hero.png", href: "/membership", label: "Discover membership" },
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
          <p className={styles.heroLead}>Discover glass, pottery, mosaic and pottery painting in one creative studio. Try something new, learn a skill or make creativity part of your everyday life.</p>
          <p className={styles.brandIntro}><strong>Home of GlassXpressions.</strong> The same glass studio you know, with more ways to create.</p>
          <img className={styles.glassLogo} src="/glassxpressions-current-logo.png" alt="GlassXpressions Creative Studio" />
          <div className={styles.homeActions}><Link href="/explore">Explore the studio</Link><Link href="/whats-on">Book an experience</Link></div>
        </div>
        <img className={styles.homeHeroPhoto} src={heroImage} alt="Colourful creative work at Crafteris" />
      </section>
      <section className={styles.offerings} aria-labelledby="offerings-heading">
        <p className={styles.eyebrow}>Explore Crafteris</p>
        <h2 id="offerings-heading">Find your way to create.</h2>
        <p className={styles.sectionIntro}>Your first creative visit, your next skill or a place to keep making. Start wherever feels right.</p>
        <div className={styles.offeringGrid}>{offerings.map(item => <Link className={`${styles.offeringCard} ${item.href === "/membership" ? styles.membershipHighlight : ""}`} href={item.href} key={item.title}>
          <img src={item.image} alt="" loading="lazy" />
          <div className={styles.offeringCopy}><h3>{item.title}<span aria-hidden="true">↗</span></h3><p>{item.text}</p><span className={styles.cardLink}>{item.label} →</span></div>
        </Link>)}</div>
      </section>
      <section className={styles.groupFeature} aria-labelledby="group-heading">
        <img src="/team-building/team-building.jpg" alt="A group enjoying a creative activity together" loading="lazy" />
        <div><p className={styles.eyebrow}>Better together</p><h2 id="group-heading">Make memories together.</h2><p>Plan a creative team event, birthday, school visit or private celebration. We’ll help you choose an activity that suits your group.</p><Link href="/team-building">Explore group experiences →</Link></div>
      </section>
      <section className={styles.shopFeature} aria-labelledby="shop-heading">
        <p className={styles.eyebrow}>Materials for makers</p><h2 id="shop-heading">A world of colour on our shelves.</h2>
        <div className={styles.shopFacts}><p><strong>200+</strong>colours of stained glass</p><p><strong>180</strong>mosaic shapes and colours</p><p><strong>180+</strong>pottery glazes and colours</p></div>
        <p>Plus 200+ bisque designs to choose from, clay bodies, tools and supplies for your next creative project.</p><Link href="/shop">Explore the shop →</Link>
      </section>
      <section className={styles.visitFeature} aria-labelledby="visit-heading">
        <p className={styles.eyebrow}>Your creative home in Malta</p><h2 id="visit-heading">Come and discover Crafteris.</h2><p>Find us in Birkirkara. Discover the studio, ask us about your first visit or find your next creative session.</p>
        <div className={styles.homeActions}><Link href="/visit">Plan your visit</Link><Link href="/whats-on">See what&apos;s on</Link></div>
      </section>
    </main><Footer />
  </div>;
}
