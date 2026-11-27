import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { pageSeo } from "@/lib/seo";
import styles from "../support.module.css";
const details = {
  "slug": "collaborative-corporate-artwork",
  "title": "Collaborative Corporate Glass Artwork & Team Building Malta",
  "heading": "Create one artwork. Together.",
  "desc": "Bring your team together to create a collaborative fused glass artwork in Malta, with individual contributions combined into a shared installation.",
  "image": "/workshops/fused-glass.png",
  "alt": "Colourful fused glass projects",
  "intro": "Create a lasting reminder of your team's shared experience. Individual glass designs can become parts of one larger artwork for your workplace.",
  "sections": [
    [
      "A shared creative project",
      "Agree a theme, colour palette or design direction with us. Each participant contributes a piece that forms part of the overall composition. No previous glass experience is needed for suitable introductory projects."
    ],
    [
      "From individual pieces to a shared installation",
      "We guide the making and kiln-fire the pieces. Panel sizes, layout, mounting arrangements and any optional fitting are agreed in advance to suit your intended display space."
    ],
    [
      "Tailored to your organisation",
      "Tell us your team size, preferred date, budget and where you would like to display the finished artwork. Ask about studio or offsite arrangements; feasibility and costs are confirmed in your quote."
    ]
  ],
  "links": [
    [
      "Glass workshops",
      "/glass"
    ],
    [
      "Team building activities",
      "/team-building"
    ]
  ]
};
export const metadata = pageSeo("/"+details.slug,details.title,details.desc,details.image);
export default function Page(){return <><Header/><main className={styles.page}><section className={styles.hero}><div className={styles.heroInner}><p className={styles.eyebrow}>Groups & events · Birkirkara, Malta</p><h1>{details.heading}</h1><p>{details.intro}</p><div className={styles.actions} style={{justifyContent:"center"}}><Link className={styles.primary} href={"/contact?subject="+encodeURIComponent(details.title)}>Request a quote</Link></div></div></section><div className={styles.content}><Image width={900} height={340} sizes="(max-width: 700px) 100vw, 852px" src={details.image} alt={details.alt} style={{width:"100%",height:"auto",maxHeight:340,objectFit:"cover",borderRadius:10,marginBottom:22}}/>{details.sections.map(([heading,body])=><section className={styles.card} key={heading}><h2>{heading}</h2><p>{body}</p></section>)}<section className={styles.card}><h2>Explore more creative activities</h2><div className={styles.actions}>{details.links.map(([label,href])=><Link className={styles.secondary} key={href} href={href}>{label}</Link>)}<Link className={styles.secondary} href="/team-building">All group activities</Link></div></section></div></main><Footer/></>;}
