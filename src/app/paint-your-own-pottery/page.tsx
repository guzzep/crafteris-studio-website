import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import styles from "./paint-your-own-pottery.module.css";

export const metadata = { title: "Paint Your Own Pottery | Crafteris", description: "Choose from 200+ ready-to-paint pottery designs in Birkirkara, Malta. Two-hour sessions, pieces from €5 and a €22 minimum spend per painter. Colours, glazing and firing included." };
const steps = [
  ["01", "Choose", "Explore 200+ ready-to-paint designs. Pick one piece or several, with a minimum spend of €22 for each painter."],
  ["02", "Paint", "Choose your colours and decorate your pottery. Use the studio’s tools and ask us for guidance along the way."],
  ["03", "We glaze & fire", "Leave your painted pieces with us. We take care of the glazing and kiln firing."],
  ["04", "Collect", "Your pottery is usually ready within 1–2 weeks. We’ll let you know when it’s ready to collect."],
];
const questions = [
  ["How does the minimum spend work?", "Pieces start from €5, with a minimum spend of €22 per person painting. Choose one piece or several: each painter’s selection must total at least €22. The minimum applies individually and cannot be shared between painters."],
  ["What is included?", "Your chosen pottery, colours, decorating tools, glazing and firing are included in the price. Your painting session lasts two hours."],
  ["Do I need experience?", "No pottery or painting experience is needed. Start with a simple pattern, experiment with colour or ask us for guidance."],
  ["Can I accompany someone without painting?", "One non-painting adult may accompany a child, subject to seating availability. Other guests occupying a seat are expected to paint and meet the €22 minimum spend per painter. Please let us know when booking if you need an accompanying-adult seat."],
  ["Can I walk in?", "Walk-ins are welcome, subject to available space. Booking is recommended to secure your table."],
  ["When can I collect my pottery?", "Pieces are usually ready for collection within 1–2 weeks. We’ll let you know when they’re ready, so please wait for our notification before coming to collect."],
  ["Can we come as a group?", "Yes—friends, families, birthdays, schools and corporate groups are welcome. Contact us to discuss your group and arrange a suitable visit."],
];
export default async function PaintYourOwnPottery() {
  const supabase = await createClient();
  const { data } = await supabase.from("page_sections").select("image_url").eq("page_key", "paint-your-own-pottery").eq("section_key", "hero").maybeSingle();
  return <div className={styles.page}><Header /><main>
    <section className={styles.hero}>
      <div className={styles.heroContent}><p className={styles.eyebrow}>Paint Your Own Pottery · Birkirkara, Malta</p><h1>Pick a piece.<br />Make it yours.</h1>
        <p className={styles.lead}>Choose from <strong>200+ ready-to-paint designs</strong>, decorate your favourite and leave the glazing and firing to us.</p>
        <div className={styles.priceNote}><strong>Pieces from €5</strong><span>Minimum spend €22 per painter</span></div>
        <div className={styles.actions}><Link href="/whats-on" className={styles.primary}>Book pottery painting</Link><Link href="#how-it-works">How it works ↓</Link></div>
      </div><img className={styles.heroImage} src={data?.image_url || "/pick-a-piece/paint-pottery.png"} alt="Decorating pottery with a personal painted design" />
    </section>
    <section className={styles.quickFacts} aria-label="Your visit at a glance">
      <div><strong>2 hours</strong><span>Time to paint and enjoy</span></div><div><strong>All included</strong><span>Pottery, colours, tools, glazing & firing</span></div><div><strong>1–2 weeks</strong><span>Usual collection turnaround</span></div><div><strong>Walk-ins welcome</strong><span>Subject to available space</span></div>
    </section>
    <section className={styles.section} id="how-it-works"><p className={styles.eyebrow}>From shelf to finished piece</p><h2>Four simple steps.</h2><div className={styles.steps}>{steps.map(([number,title,text]) => <article key={number}><span className={styles.number}>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className={styles.choice}><img src="/pick-a-piece/choose-pottery.png" alt="Ready-to-paint pottery to choose from" /><div><p className={styles.eyebrow}>200+ designs to choose from</p><h2>What will you paint?</h2><p>A favourite mug, a colourful bowl, a plate for your table or a gift with a personal touch.</p><ul>{["Mugs", "Bowls", "Plates", "Decorative pieces", "Small gifts", "Seasonal designs"].map(name => <li key={name}>{name}</li>)}</ul><p className={styles.small}>The selection in the studio varies with availability.</p></div></section>
    <section className={styles.creativity}><div><p className={styles.eyebrow}>No experience needed</p><h2>Make it your way.</h2><p>Try dots, stripes, patterns, names or your own illustration. Keep it simple or get detailed—our colours and decorating tools are here for you, with guidance when you need it.</p><p>Come with a friend, bring the family or enjoy two creative hours to yourself.</p></div><img src="/workshops/pottery-painting.png" alt="Painting a personal pottery design" /></section>
    <section className={styles.section}><p className={styles.eyebrow}>Before you visit</p><h2>Good to know.</h2><div className={styles.minimum}><h3>€22 minimum per painter—not per table.</h3><p>Each painter chooses their own piece or pieces totalling at least €22. Four people each choosing a €5 piece would still have a minimum spend of €22 each.</p></div><div className={styles.faq}>{questions.map(([question,answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
    <section className={styles.group}><div><p className={styles.eyebrow}>Better together</p><h2>Planning a group visit?</h2><p>Celebrate a birthday, make memories with friends or bring your team together over pottery painting.</p></div><Link href="/team-building" className={styles.primary}>Explore groups & team building →</Link></section>
    <section className={styles.final}><h2>Your next piece is waiting.</h2><p>Book your two-hour painting session. Walk-ins are welcome when space is available.</p><Link href="/whats-on" className={styles.primary}>Book pottery painting</Link></section>
  </main><Footer /></div>;
}
