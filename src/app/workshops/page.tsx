"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { workshopCatalogue, type CatalogueWorkshop } from "@/lib/workshop-catalogue";
import styles from "./workshops.module.css";
const filters = ["All", "Glass", "Pottery", "Mosaic", "Seasonal"];
function duration(item: CatalogueWorkshop) {
  if (item.duration_label) return item.duration_label;
  if (!item.duration_minutes) return "Duration to be confirmed";
  return item.duration_minutes % 60 ? `${item.duration_minutes} minutes` : `${item.duration_minutes / 60} hours`;
}
export default function WorkshopsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [workshops,setWorkshops] = useState<CatalogueWorkshop[]>(workshopCatalogue);
  const [filter,setFilter] = useState("All");
  useEffect(() => {
    const category = new URLSearchParams(window.location.search).get("category");
    const matching = filters.find(name => name.toLowerCase() === category?.toLowerCase());
    if (matching) setFilter(matching);
  }, []);
  useEffect(() => {
    let active = true;
    void supabase.from("workshops").select("id,title,slug,category,short_description,description,image_url,duration_minutes,level,base_price,status,sort_order").eq("status","published").order("sort_order").then(({data,error}) => {
      if (!active || error || !data) return;
      const published = data as CatalogueWorkshop[];
      // A database-backed version owns its booking dates and overrides its imported copy.
      const merged = workshopCatalogue.map(item => {
        const live = published.find(p => p.slug === item.slug || p.title.toLowerCase() === item.title.toLowerCase());
        return live ? {...item,...live,pending:false} : item;
      });
      const extra = published.filter(p => !merged.some(i => i.slug === p.slug || i.title.toLowerCase() === p.title.toLowerCase()));
      setWorkshops([...merged,...extra]);
    });
    return () => { active=false; };
  },[supabase]);
  const visible = workshops.filter(item => filter === "All" || (filter === "Seasonal" ? item.seasonal || /christmas|easter|valentine|seasonal/i.test(item.title) : item.category.toLowerCase().includes(filter.toLowerCase())));
  return <><Header /><main className={styles.main}>
    <section className={styles.intro}><p className={styles.eyebrow}>Creative sessions at Crafteris · Birkirkara, Malta</p><h1>What will you make next?</h1><p>Explore hands-on glass, pottery and mosaic workshops. Choose a project, discover what’s involved and find your next creative experience.</p><p className={styles.introNote}>One card per workshop. Open a workshop for its details and available booking options.</p></section>
    <section className={styles.collection} aria-label="Workshop collection"><div className={styles.filters} aria-label="Filter workshops">{filters.map(name => <button key={name} type="button" aria-pressed={filter===name} onClick={()=>setFilter(name)}>{name}</button>)}</div><p className={styles.count} aria-live="polite">{visible.length} {visible.length === 1 ? "workshop" : "workshops"}</p>
      <div className={styles.grid}>{visible.map(item => <article className={styles.card} key={item.slug}>
        <Link href={`/workshops/${item.slug}`} className={styles.photoLink} aria-label={`View ${item.title}`}>{item.image_url ? <img src={item.image_url} alt={item.title} /> : <div className={styles.mosaic} role="img" aria-label="Colourful mosaic tile pattern" />}{item.seasonal && <span className={styles.badge}>Seasonal</span>}</Link>
        <div className={styles.cardCopy}><p className={styles.category}>{item.category}</p><h2><Link href={`/workshops/${item.slug}`}>{item.title}</Link></h2><p>{item.short_description || item.description}</p><div className={styles.meta}><span>{duration(item)}</span><strong>{item.base_price === null ? "Price to be confirmed" : `€${item.base_price.toFixed(2)} per person`}</strong></div><Link className={styles.cardButton} href={`/workshops/${item.slug}`}>{item.pending || item.base_price === null ? "View details & enquire" : "View details & booking options"} →</Link></div>
      </article>)}</div>{!visible.length && <p className={styles.empty}>No workshops in this category at the moment. <Link href="/contact">Ask us about your ideas.</Link></p>}
    </section>
    <section className={styles.group}><div><h2>Coming with a group?</h2><p>GlassXpressions workshops can be arranged privately for groups of four or more, subject to availability. Ask us about pottery, mosaic, birthdays, schools or a creative team event too.</p></div><Link className={styles.button} href="/team-building">Plan a group visit →</Link></section>
    <section className={styles.other}><article><h2>Prefer to paint pottery?</h2><p>Choose from 200+ ready-to-paint designs in a regular pottery-painting session.</p><Link href="/paint-your-own-pottery">Explore pottery painting →</Link></article><article><h2>Ready to learn more?</h2><p>Develop your skills over several sessions with a structured course.</p><Link href="/programmes">Explore courses →</Link></article></section>
  </main><Footer /></>;
}
