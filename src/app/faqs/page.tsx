import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { createClient } from "@/lib/supabase/server";

import FAQsClient from "./FAQsClient";

type ContentItem = {
  title?: string;
  text?: string;
};

type SectionContent = {
  items?: ContentItem[];
};

export type FAQSection = {
  id: string;
  page_key: string;
  section_key: string;

  eyebrow: string | null;
  title: string | null;
  subtitle: string | null;
  body: string | null;

  image_url: string | null;

  button_label: string | null;
  button_url: string | null;

  secondary_button_label: string | null;
  secondary_button_url: string | null;

  content: SectionContent | null;

  is_visible: boolean;
  sort_order: number;
};

export default async function FAQsPage() {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase
    .from("page_sections")
    .select("*")
    .eq(
      "page_key",
      "faqs"
    )
    .order(
      "sort_order",
      {
        ascending: true,
      }
    );

  if (error) {
    console.error(
      "Could not load FAQ page content:",
      error.message
    );
  }

  const sections =
    (data as FAQSection[]) ??
    [];

  return (
    <>
      <Header />

      <FAQsClient
        sections={sections}
      />

      <Footer />
    </>
  );
}