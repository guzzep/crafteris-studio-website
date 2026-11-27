import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { pageSeo } from "@/lib/seo";
import styles from "../support.module.css";
const details = {
  "slug": "school-art-workshops",
  "title": "School Art Workshops & Creative School Outings in Malta",
  "heading": "Hands-on creativity for school groups.",
  "desc": "Explore guided glass, pottery and mosaic art workshops for schools and educational groups in Malta. Request an age-appropriate project and group quote.",
  "image": "/workshops/hand-building.png",
  "alt": "Handbuilding pottery with clay",
  "intro": "Give students a chance to explore materials, colour, shape and design through practical creative projects at Crafteris Studio.",
  "sections": [
    [
      "Creative learning through making",
      "Ask about pottery painting, clay handbuilding, mosaic or suitable fused glass projects. We tailor the proposed activity to the students' ages and experience."
    ],
    [
      "Planning a school visit",
      "Tell us the year group, number of students, available time and learning objectives. We will confirm capacity, materials, supervision and safety requirements before the visit."
    ],
    [
      "Finishing and collection",
      "Some projects need kiln firing or additional finishing. We will agree collection arrangements and provide a clear quote before you book."
    ]
  ],
  "links": [
    [
      "Glass activities",
      "/glass"
    ],
    [
      "Mosaic activities",
      "/mosaic"
    ],
    [
      "Pottery activities",
      "/pottery"
    ]
  ]
};
export const metadata = pageSeo("/"+details.slug,details.title,details.desc,details.image);
export default function Page(){return <><Header/><main className={styles.page}><section className={styles.hero}><div className={styles.heroInner}><p className={styles.eyebrow}>Groups & events · Birkirkara, Malta</p><h1>{details.heading}</h1><p>{details.intro}</p><div className={styles.actions} style={{justifyContent:"center"}}><Link className={styles.primary} href={"/contact?subject="+encodeURIComponent(details.title)}>Request a quote</Link></div></div></section><div className={styles.content}><img src={details.image} alt={details.alt} style={{width:"100%",maxHeight:340,objectFit:"cover",borderRadius:10,marginBottom:22}}/>{details.sections.map(([heading,body])=><section className={styles.card} key={heading}><h2>{heading}</h2><p>{body}</p></section>)}<section className={styles.card}><h2>Explore more creative activities</h2><div className={styles.actions}>{details.links.map(([label,href])=><Link className={styles.secondary} key={href} href={href}>{label}</Link>)}<Link className={styles.secondary} href="/team-building">All group activities</Link></div></section></div></main><Footer/></>;}
