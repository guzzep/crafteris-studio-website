import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { pageSeo } from "@/lib/seo";
import styles from "../support.module.css";
const details = {
  "slug": "creative-birthday-parties",
  "title": "Creative Children's Birthday Parties in Malta",
  "heading": "A birthday party with something to make.",
  "desc": "Plan a creative children's birthday party in Malta with pottery painting, clay or mosaic activities tailored to your group.",
  "image": "/workshops/pottery-painting.png",
  "alt": "Pottery painting materials and decorated ceramics",
  "intro": "Celebrate with a hands-on creative activity in Birkirkara. Tell us the children's ages, group size and interests and we'll suggest a suitable project.",
  "sections": [
    [
      "Choose a birthday activity",
      "Paint ready-made ceramic pieces, explore handbuilding with clay or ask about a mosaic project. We will recommend age-appropriate designs and confirm the materials and guidance included."
    ],
    [
      "Plan your celebration",
      "Share your preferred date, ages, expected numbers and budget. We will confirm session length, supervision arrangements, capacity and any food or venue requirements before booking."
    ],
    [
      "A personal keepsake",
      "Each child can create something of their own. Ceramic pieces requiring firing are collected later; we will explain collection arrangements in your quote."
    ]
  ],
  "links": [
    [
      "Pottery painting",
      "/paint-your-own-pottery"
    ],
    [
      "Pottery activities",
      "/pottery"
    ]
  ]
};
export const metadata = pageSeo("/"+details.slug,details.title,details.desc,details.image);
export default function Page(){return <><Header/><main className={styles.page}><section className={styles.hero}><div className={styles.heroInner}><p className={styles.eyebrow}>Groups & events · Birkirkara, Malta</p><h1>{details.heading}</h1><p>{details.intro}</p><div className={styles.actions} style={{justifyContent:"center"}}><Link className={styles.primary} href={"/contact?subject="+encodeURIComponent(details.title)}>Request a quote</Link></div></div></section><div className={styles.content}><img src={details.image} alt={details.alt} style={{width:"100%",maxHeight:340,objectFit:"cover",borderRadius:10,marginBottom:22}}/>{details.sections.map(([heading,body])=><section className={styles.card} key={heading}><h2>{heading}</h2><p>{body}</p></section>)}<section className={styles.card}><h2>Explore more creative activities</h2><div className={styles.actions}>{details.links.map(([label,href])=><Link className={styles.secondary} key={href} href={href}>{label}</Link>)}<Link className={styles.secondary} href="/team-building">All group activities</Link></div></section></div></main><Footer/></>;}
