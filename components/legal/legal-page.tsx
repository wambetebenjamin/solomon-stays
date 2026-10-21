import Link from "next/link";
import type { LegalDocument } from "@/lib/legalContent";

export function LegalPage({ document: doc }: { document: LegalDocument }) {
  return (
    <>
      <section className="ss-page-banner">
        <div className="container">
          <div className="ss-breadcrumb">
            <Link href="/">Home</Link> / <span>Legal</span> / <span>{doc.title}</span>
          </div>
          <h1>{doc.title}</h1>
          <p>{doc.subtitle}</p>
        </div>
      </section>

      <section className="ss-section tight">
        <div className="container">
          <article className="ss-legal">
            <p className="ss-legal-meta">{doc.updated}</p>
            {doc.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <h2>Contact</h2>
            <p>
              Questions about this document can go to{" "}
              <a href="mailto:hello@solomonstays.co.ke" style={{ color: "var(--ss-red)" }}>
                hello@solomonstays.co.ke
              </a>{" "}
              or WhatsApp +254 112 272 061. Solomon Stays, Westlands, Nairobi, Kenya.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
