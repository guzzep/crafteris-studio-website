import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "../support.module.css";
export const metadata={title:"Shop | Crafteris Studio"};
const categories = {glass:"Glass & supplies",pottery:"Clay, glazes & pottery tools",mosaic:"Mosaic materials",bisque:"Blank ceramic bisque"} as const;
export default async function ShopPage({searchParams}:{searchParams:Promise<{category?:string;product?:string}>}){
 const params=await searchParams;
 const category=Object.keys(categories).find(k=>k===params.category) as keyof typeof categories|undefined;
 const configured=process.env.CRAFTERIS_SHOP_URL;
 let destination:URL|null=null;
 if(configured){try{const url=new URL(configured);if(url.protocol==="https:")destination=url;}catch{}}
 if(destination){if(category)destination.searchParams.set("category",category);if(params.product)destination.searchParams.set("product",params.product);redirect(destination.toString());}
 return <><Header/><main className={styles.page}><section className={styles.hero}><div className={styles.heroInner}><p className={styles.eyebrow}>Crafteris Shop</p><h1>{category?categories[category]:"Materials for your next idea."}</h1><p>Glass, clay, glazes, mosaic and ceramic bisque in one shop. No membership required.</p></div></section><div className={styles.content}><section className={styles.card}><h2>Online shop connection pending.</h2><p>The online shop will use the Crafteris product catalogue, stock and checkout. Online purchases are not available through this preview yet.</p><p>Active members receive 10% off eligible retail products and earn loyalty hours on qualifying purchases.</p><div className={styles.actions}><Link href="/visit" className={styles.secondary}>Visit the studio</Link><Link href="/contact" className={styles.secondary}>Contact us if you need help</Link></div></section></div></main><Footer/></>;
}
