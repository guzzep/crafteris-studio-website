"use client";

import {

  FormEvent,

  useEffect,

  useMemo,

  useRef,

  useState,

} from "react";

import Link from "next/link";

import {

  ArrowRight,

  Check,

  Clock3,

  Loader2,

  Mail,

  MapPin,

  Phone,

  Send,

} from "lucide-react";

import Header from "@/components/Header";

import Footer from "@/components/Footer";

import { createClient } from "@/lib/supabase/client";

import styles from "./contact.module.css";

type ContactForm = {

  names: string;

  email: string;

  phone: string;

  reason: string;

  group_size: string;

  message: string;

  website: string;

};

type ContentItem = {

  title?: string;

  text?: string;

  image_url?: string;

  button_label?: string;

  button_url?: string;

};

type SectionContent = {

  items?: ContentItem[];

};

type PageSection = {

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

type SiteSettings = {
  site_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
};

const emptyForm: ContactForm = {

  names: "",

  email: "",

  phone: "",

  reason: "General enquiry",

  group_size: "",

  message: "",

  website: "",

};

const MINIMUM_FORM_FILL_TIME_MS = 3000;
const SUBMISSION_COOLDOWN_MS = 30000;
const MAX_MESSAGE_LENGTH = 3000;
const MAX_NAME_LENGTH = 120;
const MAX_PHONE_LENGTH = 50;
const MAX_LINKS_IN_MESSAGE = 3;
const LAST_SUBMISSION_KEY =
  "crafteris_contact_last_submission";

const fallbackContactDetails: ContentItem[] = [

  {

    title: "Email",

    text: "Contact the studio",

  },

  {

    title: "Studio",

    text: "Malta",

  },

  {

    title: "Visits",

    text: "By session or arrangement",

  },

];

const fallbackHelpItems: ContentItem[] = [

  {

    title: "Workshops",

    text:

      "Explore one-off pottery and glass experiences.",

    button_label: "View workshops",

    button_url: "/workshops",

  },

  {

    title: "Membership",

    text:

      "See studio access and regular making options.",

    button_label: "View memberships",

    button_url: "/membership",

  },

  {

    title: "FAQs",

    text:

      "Find answers about booking, making, collection and visits.",

    button_label: "Read FAQs",

    button_url: "/faqs",

  },

];

function getSection(

  sections: PageSection[],

  key: string

) {

  return sections.find(

    (section) =>

      section.section_key === key

  );

}

function isVisible(

  section: PageSection | undefined

) {

  if (!section) {

    return true;

  }

  return section.is_visible;

}

function getItems(

  section: PageSection | undefined,

  fallback: ContentItem[]

) {

  const items =

    section?.content?.items;

  if (

    !Array.isArray(items) ||

    items.length === 0

  ) {

    return fallback;

  }

  return items;

}

export default function ContactPage() {

  const supabase = useMemo(

    () => createClient(),

    []

  );

  const formStartedAt = useRef(
    Date.now()
  );

  const [

    sections,

    setSections,

  ] = useState<PageSection[]>([]);

  const [
    settings,
    setSettings,
  ] = useState<SiteSettings | null>(
    null
  );


  const [form, setForm] =

    useState<ContactForm>(

      emptyForm

    );

  const [sending, setSending] =

    useState(false);

  const [success, setSuccess] =

    useState(false);

  const [error, setError] =

    useState("");

  useEffect(() => {

    let active = true;

    async function loadContent() {

      const [
        contentResult,
        settingsResult,
      ] = await Promise.all([
        supabase
          .from("page_sections")
          .select("*")
          .eq(
            "page_key",
            "contact"
          )
          .order(
            "sort_order",
            {
              ascending: true,
            }
          ),

        supabase
          .from("site_settings")
          .select(
            `
              site_name,
              email,
              phone,
              address
            `
          )
          .limit(1)
          .maybeSingle(),
      ]);

      const {
        data,
        error: contentError,
      } = contentResult;

      const {
        data: settingsData,
        error: settingsError,
      } = settingsResult;

      if (!active) {
        return;
      }

      if (contentError) {
        console.error(
          "Could not load Contact page content:",
          contentError.message
        );
      } else {
        setSections(
          (data as PageSection[]) ??
            []
        );
      }

      if (settingsError) {
        console.error(
          "Could not load site settings:",
          settingsError.message
        );
      } else if (
        settingsData
      ) {
        setSettings(
          settingsData as SiteSettings
        );
      }

    }

    loadContent();

    return () => {

      active = false;

    };

  }, [supabase]);

  const hero =

    getSection(

      sections,

      "hero"

    );

  const contact =

    getSection(

      sections,

      "contact"

    );

  const help =

    getSection(

      sections,

      "help"

    );

  const finalCta =

    getSection(

      sections,

      "final_cta"

    );

  const cmsContactDetails =
    getItems(
      contact,
      fallbackContactDetails
    );

  const contactDetails: ContentItem[] = [
    {
      title:
        cmsContactDetails[0]?.title ||
        "Email",
      text:
        settings?.email ||
        cmsContactDetails[0]?.text ||
        "Contact the studio",
    },
    {
      title: "Phone",
      text:
        settings?.phone ||
        "Contact the studio",
    },
    {
      title:
        cmsContactDetails[1]?.title ||
        "Studio",
      text:
        settings?.address ||
        cmsContactDetails[1]?.text ||
        "Malta",
    },
  ];

  const helpItems =

    getItems(

      help,

      fallbackHelpItems

    );

  function updateForm<

    K extends keyof ContactForm

  >(

    key: K,

    value: ContactForm[K]

  ) {

    setForm((current) => ({

      ...current,

      [key]: value,

    }));

    if (success) {

      setSuccess(false);

    }

    if (error) {

      setError("");

    }

  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (sending) {
      return;
    }

    setError("");
    setSuccess(false);

    /*
      Anti-spam layer 1: honeypot.
      Real visitors never see this field.
    */
    if (form.website.trim()) {
      setSuccess(true);
      setForm(emptyForm);
      formStartedAt.current =
        Date.now();
      return;
    }

    /*
      Anti-spam layer 2:
      reject submissions completed unrealistically fast.
    */
    const fillTime =
      Date.now() -
      formStartedAt.current;

    if (
      fillTime <
      MINIMUM_FORM_FILL_TIME_MS
    ) {
      setError(
        "Please wait a moment before sending your message."
      );
      return;
    }

    /*
      Anti-spam layer 3:
      browser-side cooldown to reduce repeated submissions.
    */
    try {
      const lastSubmission =
        Number(
          window.localStorage.getItem(
            LAST_SUBMISSION_KEY
          ) || "0"
        );

      if (
        lastSubmission > 0 &&
        Date.now() -
          lastSubmission <
          SUBMISSION_COOLDOWN_MS
      ) {
        setError(
          "Please wait a few seconds before sending another message."
        );
        return;
      }
    } catch {
      // Continue if localStorage is unavailable.
    }

    const names =
      form.names.trim();

    const email =
      form.email
        .trim()
        .toLowerCase();

    const phone =
      form.phone.trim();

    const message =
      form.message.trim();

    if (!names) {
      setError(
        "Please enter your name."
      );
      return;
    }

    if (
      names.length >
      MAX_NAME_LENGTH
    ) {
      setError(
        "Please use a shorter name."
      );
      return;
    }

    if (!email) {
      setError(
        "Please enter your email address."
      );
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailPattern.test(
        email
      )
    ) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    if (
      phone.length >
      MAX_PHONE_LENGTH
    ) {
      setError(
        "Please use a shorter phone number."
      );
      return;
    }

    if (!message) {
      setError(
        "Please enter a message."
      );
      return;
    }

    if (
      message.length < 10
    ) {
      setError(
        "Please tell us a little more so we can help."
      );
      return;
    }

    if (
      message.length >
      MAX_MESSAGE_LENGTH
    ) {
      setError(
        "Your message is too long. Please keep it under 3000 characters."
      );
      return;
    }

    const linkMatches =
      message.match(
        /(https?:\/\/|www\.)/gi
      ) || [];

    if (
      linkMatches.length >
      MAX_LINKS_IN_MESSAGE
    ) {
      setError(
        "Please remove some links from your message and try again."
      );
      return;
    }

    let groupSize:
      | number
      | null = null;

    if (
      form.group_size !== ""
    ) {
      groupSize =
        Number(
          form.group_size
        );

      if (
        Number.isNaN(
          groupSize
        ) ||
        groupSize < 1
      ) {
        setError(
          "Group size must be at least 1."
        );
        return;
      }
    }

    setSending(true);

    const {
      error: insertError,
    } = await supabase
      .from(
        "contact_enquiries"
      )
      .insert({
        names,
        email,
        phone:
          phone || null,
        reason:
          form.reason.trim() ||
          "General enquiry",
        group_size:
          groupSize,
        message,
        is_read: false,
      });

    if (insertError) {
      console.error(
        "Contact enquiry error:",
        insertError.message,
        insertError.code,
        insertError.details,
        insertError.hint
      );

      setError(
        "We couldn't send your message. Please try again."
      );

      setSending(false);
      return;
    }

    try {
      window.localStorage.setItem(
        LAST_SUBMISSION_KEY,
        Date.now().toString()
      );
    } catch {
      // Continue if localStorage is unavailable.
    }

    setForm(emptyForm);
    setSuccess(true);
    setSending(false);

    formStartedAt.current =
      Date.now();
  }

  const defaultSectionOrder = [
    "hero",
    "contact",
    "help",
    "final_cta",
  ];

  const orderedSectionKeys = [
    ...sections.map(
      (section) =>
        section.section_key
    ),
    ...defaultSectionOrder.filter(
      (key) =>
        !sections.some(
          (section) =>
            section.section_key === key
        )
    ),
  ];

  function getSectionOrder(
    key: string
  ) {
    const index =
      orderedSectionKeys.indexOf(
        key
      );

    return index >= 0
      ? (index + 1) * 10
      : 10000;
  }

  return (

    <>

      <Header />

      <main
        style={{
          display: "flex",
          flexDirection: "column",
        }}

        className={

          styles.page

        }

      >

        {/* HERO */}

        {isVisible(

          hero

        ) && (

          <section
            style={{
              order:
                getSectionOrder(
                  "hero"
                ),
            }}

            className={

              styles.hero

            }

          >

            <div

              className={

                styles.heroInner

              }

            >

              <p

                className={

                  styles.eyebrow

                }

              >

                {hero?.eyebrow ||

                  "GET IN TOUCH"}

              </p>

              <h1>

                {hero?.title ||

                  "Tell us what you're looking for."}

              </h1>

              <p

                className={

                  styles.heroText

                }

              >

                {hero?.body ||

                  hero?.subtitle ||

                  "Questions about workshops, memberships, groups or the studio? Send us a message and we'll help point you in the right direction."}

              </p>

              {(hero?.button_label ||

                !hero) && (

                <a

                  href={

                    hero?.button_url ||

                    "#contact-form"

                  }

                  className={

                    styles.heroButton

                  }

                >

                  {hero?.button_label ||

                    "Send an enquiry"}

                  <ArrowRight

                    size={17}

                  />

                </a>

              )}

            </div>

          </section>

        )}

        {/* CONTACT */}

        {isVisible(

          contact

        ) && (

          <section
            style={{
              order:
                getSectionOrder(
                  "contact"
                ),
            }}

            className={

              styles.contactSection

            }

            id="contact-form"

          >

            <div

              className={

                styles.contactIntro

              }

            >

              <p

                className={

                  styles.eyebrow

                }

              >

                {contact?.eyebrow ||

                  "CONTACT THE STUDIO"}

              </p>

              <h2>

                {contact?.title ||

                  "How can we help?"}

              </h2>

              <p>

                {contact?.body ||

                  contact?.subtitle ||

                  "Choose the reason for your enquiry and give us a few details. Your message will go directly to the studio team."}

              </p>

              <div

                className={

                  styles.contactDetails

                }

              >

                {contactDetails.map(

                  (

                    item,

                    index

                  ) => {

                    const Icon =
                      index === 0
                        ? Mail
                        : index === 1
                          ? Phone
                          : MapPin;

                    return (

                      <div

                        className={

                          styles.contactDetail

                        }

                        key={`${item.title}-${index}`}

                      >

                        <div

                          className={

                            styles.contactIcon

                          }

                        >

                          <Icon

                            size={19}

                          />

                        </div>

                        <div>

                          <span>

                            {item.title ||

                              "Contact"}

                          </span>

                          <strong>

                            {item.text ||

                              ""}

                          </strong>

                        </div>

                      </div>

                    );

                  }

                )}

              </div>

            </div>

            {/* FORM */}

            <div

              className={

                styles.formCard

              }

            >

              {success && (

                <div

                  className={

                    styles.successMessage

                  }

                >

                  <div

                    className={

                      styles.successIcon

                    }

                  >

                    <Check

                      size={23}

                    />

                  </div>

                  <div>

                    <strong>

                      Message sent.

                    </strong>

                    <p>

                      Thanks for

                      getting in

                      touch. Your

                      enquiry has

                      been received

                      by the studio.

                    </p>

                  </div>

                </div>

              )}

              {error && (

                <div

                  className={

                    styles.errorMessage

                  }

                >

                  {error}

                </div>

              )}

              <form

                onSubmit={

                  handleSubmit

                }

                className={

                  styles.form

                }

              >

                {/* Honeypot */}

                <div

                  className={

                    styles.honeypot

                  }

                  aria-hidden="true"

                >

                  <label

                    htmlFor="website"

                  >

                    Website

                  </label>

                  <input

                    id="website"

                    name="website"

                    type="text"

                    tabIndex={-1}

                    autoComplete="off"

                    maxLength={200}

                    value={

                      form.website

                    }

                    onChange={(

                      event

                    ) =>

                      updateForm(

                        "website",

                        event

                          .target

                          .value

                      )

                    }

                  />

                </div>

                <div

                  className={

                    styles.formGrid

                  }

                >

                  <div

                    className={

                      styles.formGroup

                    }

                  >

                    <label

                      htmlFor="names"

                    >

                      Name *

                    </label>

                    <input

                      id="names"

                      type="text"

                      value={

                        form.names

                      }

                      onChange={(

                        event

                      ) =>

                        updateForm(

                          "names",

                          event

                            .target

                            .value

                        )

                      }

                      placeholder="Your name"

                      maxLength={MAX_NAME_LENGTH}

                      autoComplete="name"

                      required

                    />

                  </div>

                  <div

                    className={

                      styles.formGroup

                    }

                  >

                    <label

                      htmlFor="email"

                    >

                      Email *

                    </label>

                    <input

                      id="email"

                      type="email"

                      value={

                        form.email

                      }

                      onChange={(

                        event

                      ) =>

                        updateForm(

                          "email",

                          event

                            .target

                            .value

                        )

                      }

                      placeholder="you@example.com"

                      autoComplete="email"

                      required

                    />

                  </div>

                  <div

                    className={

                      styles.formGroup

                    }

                  >

                    <label

                      htmlFor="phone"

                    >

                      Phone

                    </label>

                    <input

                      id="phone"

                      type="tel"

                      value={

                        form.phone

                      }

                      onChange={(

                        event

                      ) =>

                        updateForm(

                          "phone",

                          event

                            .target

                            .value

                        )

                      }

                      placeholder="+356..."

                      maxLength={MAX_PHONE_LENGTH}

                      autoComplete="tel"

                    />

                  </div>

                  <div

                    className={

                      styles.formGroup

                    }

                  >

                    <label

                      htmlFor="reason"

                    >

                      What can we

                      help with?

                    </label>

                    <select

                      id="reason"

                      value={

                        form.reason

                      }

                      onChange={(

                        event

                      ) =>

                        updateForm(

                          "reason",

                          event

                            .target

                            .value

                        )

                      }

                    >

                      <option value="General enquiry">

                        General enquiry

                      </option>

                      <option value="Booking help">

                        Booking help

                      </option>

                      <option value="Workshop">

                        Workshop

                      </option>

                      <option value="Programme">

                        Programme /

                        course

                      </option>

                      <option value="Membership">

                        Membership

                      </option>

                      <option value="Private group">

                        Private group

                      </option>

                      <option value="Team building">

                        Team building

                      </option>

                      <option value="School or organisation">

                        School or

                        organisation

                      </option>

                      <option value="Gift voucher">

                        Gift voucher

                      </option>

                      <option value="Shop">

                        Shop

                      </option>

                      <option value="Supplier or press">

                        Supplier /

                        press

                      </option>

                    </select>

                  </div>

                  <div

                    className={

                      styles.formGroup

                    }

                  >

                    <label

                      htmlFor="groupSize"

                    >

                      Group size

                    </label>

                    <input

                      id="groupSize"

                      type="number"

                      min="1"

                      step="1"

                      value={

                        form.group_size

                      }

                      onChange={(

                        event

                      ) =>

                        updateForm(

                          "group_size",

                          event

                            .target

                            .value

                        )

                      }

                      placeholder="Optional"

                    />

                  </div>

                </div>

                <div

                  className={

                    styles.formGroup

                  }

                >

                  <label

                    htmlFor="message"

                  >

                    Message *

                  </label>

                  <textarea

                    id="message"

                    rows={7}

                    value={

                      form.message

                    }

                    onChange={(

                      event

                    ) =>

                      updateForm(

                        "message",

                        event

                          .target

                          .value

                      )

                    }

                    placeholder="Tell us what you'd like to know..."

                    maxLength={MAX_MESSAGE_LENGTH}

                    required

                  />

                  <span

                    className={

                      styles.fieldHint

                    }

                  >

                    Include any

                    dates,

                    experience

                    level or group

                    information

                    that might

                    help us answer.

                  </span>

                </div>

                <button

                  type="submit"

                  className={

                    styles.submitButton

                  }

                  disabled={

                    sending

                  }

                >

                  {sending ? (

                    <>

                      <Loader2

                        size={17}

                        className={

                          styles.spin

                        }

                      />

                      Sending...

                    </>

                  ) : (

                    <>

                      <Send

                        size={17}

                      />

                      Send enquiry

                    </>

                  )}

                </button>

              </form>

            </div>

          </section>

        )}

        {/* HELP ROUTES */}

        {isVisible(

          help

        ) && (

          <section
            style={{
              order:
                getSectionOrder(
                  "help"
                ),
            }}

            className={

              styles.helpSection

            }

          >

            <div

              className={

                styles.helpHeading

              }

            >

              <p

                className={

                  styles.eyebrow

                }

              >

                {help?.eyebrow ||

                  "BEFORE YOU MESSAGE"}

              </p>

              <h2>

                {help?.title ||

                  "You might find the answer here."}

              </h2>

              {(help?.body ||

                help?.subtitle) && (

                <p>

                  {help.body ||

                    help.subtitle}

                </p>

              )}

            </div>

            <div

              className={

                styles.helpGrid

              }

            >

              {helpItems.map(

                (

                  item,

                  index

                ) => (

                  <Link

                    href={

                      item.button_url ||

                      "#"

                    }

                    className={

                      styles.helpCard

                    }

                    key={`${item.title}-${index}`}

                  >

                    {item.image_url && (

                      <div

                        className={

                          styles.helpCardImageWrapper

                        }

                      >

                        <img

                          src={

                            item.image_url

                          }

                          alt={

                            item.title ||

                            `Help item ${

                              index + 1

                            }`

                          }

                          className={

                            styles.helpCardImage

                          }

                        />

                      </div>

                    )}

                    <div

                      className={

                        styles.helpCardContent

                      }

                    >

                      <span>

                        {String(

                          index + 1

                        ).padStart(

                          2,

                          "0"

                        )}

                      </span>

                      <h3>

                        {item.title ||

                          `Help ${

                            index + 1

                          }`}

                      </h3>

                      {item.text && (

                        <p>

                          {item.text}

                        </p>

                      )}

                      <strong>

                        {item.button_label ||

                          "Learn more"}{" "}

                        →

                      </strong>

                    </div>

                  </Link>

                )

              )}

            </div>

          </section>

        )}

        {/* FINAL CTA */}

        {isVisible(

          finalCta

        ) && (

          <section
            style={{
              order:
                getSectionOrder(
                  "final_cta"
                ),
            }}

            className={

              styles.finalCta

            }

          >

            <div

              className={

                styles.finalInner

              }

            >

              <p

                className={

                  styles.eyebrow

                }

              >

                {finalCta?.eyebrow ||

                  "VISIT CRAFTERIS"}

              </p>

              <h2>

                {finalCta?.title ||

                  "Prefer to see the studio first?"}

              </h2>

              <p>

                {finalCta?.body ||

                  finalCta?.subtitle ||

                  "Find studio information, access guidance and everything you need before visiting."}

              </p>

              {(finalCta?.button_label ||

                !finalCta) && (

                  <Link

                    href={

                      finalCta?.button_url ||

                      "/visit"

                    }

                    className={

                      styles.heroButton

                    }

                  >

                    {finalCta?.button_label ||

                      "Plan your visit"}

                    <ArrowRight

                      size={17}

                    />

                  </Link>

                )}

            </div>

          </section>

        )}

      </main>

      <Footer />

    </>

  );

}