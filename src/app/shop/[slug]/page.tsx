import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../support.module.css";

const data: Record<string,{name:string;category:string;price:string;description:string}> = {
 "ceramic-mug":{name:"Handmade Ceramic Mug",category:"Pottery",price:"€24",description:"A handmade ceramic mug made in the Crafteris studio."},
 "stained-glass-suncatcher":{name:"Stained Glass Suncatcher",category:"Glass",price:"€32",description:"A colourful stained-glass piece designed to catch the light."},
 "ceramic-bowl":{name:"Handmade Ceramic Bowl",category:"Pottery",price:"€28",description:"A functional handmade bowl with individual studio character."},
 "fused-glass-dish":{name:"Fused Glass Dish",category:"Glass",price:"€26",description:"A small fused-glass dish made with layered colour and texture."},
 "ceramic-vase":{name:"Studio Ceramic Vase",category:"Pottery",price:"€38",description:"A handmade ceramic vase created as a one-of-a-kind studio piece."},
 "glass-decoration":{name:"Glass Hanging Decoration",category:"Glass",price:"€22",description:"A decorative hanging glass piece for adding colour and light to a space."},
};
export default async function ProductPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=data[slug];if(!item)notFound();return <><Header/><main className={styles.page}><section className={styles.hero}><div className={styles.heroInner}><p className={styles.eyebrow}>{item.category}</p><h1>{item.name}</h1><p>{item.description}</p></div></section><div className={styles.content}><section className={styles.card}><h2>{item.price}</h2><p>Shop inventory and checkout are not connected yet. Product availability will later come from the same source of truth used by the Crafteris shop and POS.</p><div className={styles.actions}><Link href="/contact" className={styles.primary}>Ask about this piece</Link><Link href="/shop" className={styles.secondary}>Back to shop</Link></div></section></div></main><Footer/></>}
