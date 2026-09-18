import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AntiMetalButton } from "@/components/ui/anti-metal-button";
import { Seo } from "@/components/Seo";
import { SiteBreadcrumb } from "@/components/SiteBreadcrumb";
import { Reveal } from "@/lib/motion";
import {
  homeNursingJsonLd,
  homeNursingPage,
  relatedServicesFor,
  requestNurseHref,
  serviceHref,
  type ServicePageContent,
} from "@/lib/servicePages";
import { CONTACT_PHONES } from "@/lib/site";
import { ArrowRight, Check, MapPin, Phone, X } from "lucide-react";
import { Link } from "wouter";

type ServiceDetailPageProps = {
  page: ServicePageContent;
  jsonLd: Record<string, unknown>;
};

export function ServiceDetailPage({ page, jsonLd }: ServiceDetailPageProps) {
  const related = relatedServicesFor(page);
  const ctaHref = requestNurseHref(page.requestServiceName);
  const phone = CONTACT_PHONES[0];

  return (
    <main className="svc-page">
      <Seo title={page.seoTitle} description={page.seoDescription} path={page.path} jsonLd={jsonLd} />

      <section className="inner-hero svc-page__hero">
        <div className="container inner-hero-inner">
          <Reveal direction="left" distance={32}>
            <SiteBreadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Services", href: "/services" },
                { label: page.name },
              ]}
            />
          </Reveal>
          <Reveal className="eyebrow" direction="left" distance={40} delay={0.04}>
            HOME NURSING · QATAR
          </Reveal>
          <Reveal as="h1" direction="left" distance={56} delay={0.08}>
            {page.h1}
          </Reveal>
          {page.intro.map((paragraph, index) => (
            <Reveal
              as="p"
              key={paragraph.slice(0, 24)}
              direction="left"
              distance={40}
              delay={0.12 + index * 0.04}
              className="svc-page__lead"
            >
              {paragraph}
            </Reveal>
          ))}
          <Reveal className="svc-page__hero-actions" direction="left" distance={36} delay={0.22}>
            <AntiMetalButton href={ctaHref} label={page.heroCtaLabel} />
            <a href={phone.href} className="btn btn-outline">
              <Phone size={16} /> {phone.display}
            </a>
          </Reveal>
        </div>
      </section>

      <section className="section svc-page__media-section" aria-label="Home nursing in Qatar">
        <div className="container">
          <Reveal className="svc-page__media" direction="left" distance={48}>
            <img src={page.imageUrl} alt={page.imageAlt} />
          </Reveal>
        </div>
      </section>

      <section className="section svc-page__scope" aria-labelledby="scope-heading">
        <div className="container">
          <Reveal className="section-heading" direction="left" distance={48}>
            <div className="eyebrow">SERVICE DETAILS</div>
            <h2 id="scope-heading">Scope of home nursing care</h2>
            <p>{page.scope.scopeNote}</p>
          </Reveal>
          <div className="svc-page__scope-grid">
            <Reveal className="svc-page__list-block svc-page__list-block--in" direction="left" distance={40} delay={0.06}>
              <h3>Included</h3>
              <ul>
                {page.scope.included.map((item) => (
                  <li key={item}>
                    <Check size={16} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="svc-page__list-block svc-page__list-block--out" direction="left" distance={40} delay={0.1}>
              <h3>Not included</h3>
              <ul>
                {page.scope.notIncluded.map((item) => (
                  <li key={item}>
                    <X size={16} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal className="svc-page__lead-note" direction="left" distance={32} delay={0.12}>
            <p>
              Need the service lead to confirm duties for your case? Use{" "}
              <Link href={ctaHref}>Request a Nurse</Link> or call{" "}
              <a href={phone.href}>{phone.display}</a> — the team will clarify approved tasks before any placement.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section svc-page__coverage" aria-labelledby="coverage-heading">
        <div className="container svc-page__coverage-inner">
          <Reveal direction="left" distance={48}>
            <div className="eyebrow">COVERAGE</div>
            <h2 id="coverage-heading">{page.coverage.heading}</h2>
            {page.coverage.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
            <p className="svc-page__coverage-meta">
              <MapPin size={16} aria-hidden="true" />
              Office coordination from Old Airport, Doha — availability confirmed per enquiry
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section how-section svc-page__process" aria-labelledby="process-heading">
        <div className="container">
          <Reveal className="section-heading" direction="left" distance={48}>
            <div className="eyebrow">PROCESS</div>
            <h2 id="process-heading">{page.process.heading}</h2>
            <p>{page.process.intro}</p>
          </Reveal>
          <ol className="how-steps">
            {page.process.steps.map((step, i) => (
              <Reveal as="li" key={step.n} className="how-step" direction="left" distance={36} delay={0.05 * i}>
                <b aria-hidden="true">{step.n}</b>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal className="svc-page__process-note" direction="left" distance={32} delay={0.2}>
            <p>{page.process.whoContacts}</p>
            <AntiMetalButton href={ctaHref} label={page.heroCtaLabel} />
          </Reveal>
        </div>
      </section>

      <section className="section svc-page__trust" aria-labelledby="trust-heading">
        <div className="container">
          <Reveal className="section-heading" direction="left" distance={48}>
            <div className="eyebrow">TRUST</div>
            <h2 id="trust-heading">{page.trust.heading}</h2>
            {page.trust.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 28)}>{paragraph}</p>
            ))}
          </Reveal>
          <div className="check-list svc-page__trust-facts">
            {page.trust.facts.map((fact) => (
              <Reveal key={fact} direction="left" distance={28} delay={0.04}>
                <div>
                  <Check /> {fact}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="faq-section section" aria-labelledby="svc-faq-heading">
        <div className="container faq-layout">
          <Reveal className="faq-intro" direction="left" distance={48}>
            <div className="eyebrow">QUESTIONS</div>
            <h2 id="svc-faq-heading">Questions about home nursing</h2>
            <p>
              Answers focused on this service. Final clinical or staffing wording should be reviewed by Team BHSK
              before launch.
            </p>
          </Reveal>
          <Reveal delay={0.08} direction="left" distance={40}>
            <Accordion type="single" collapsible className="faq-accordion" defaultValue={page.faqs[0]?.id}>
              {page.faqs.map((item) => (
                <AccordionItem key={item.id} value={item.id} className="faq-item">
                  <AccordionTrigger className="faq-trigger">{item.question}</AccordionTrigger>
                  <AccordionContent className="faq-answer">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      <section className="section svc-page__related" aria-labelledby="related-heading">
        <div className="container">
          <Reveal className="section-heading" direction="left" distance={48}>
            <div className="eyebrow">RELATED</div>
            <h2 id="related-heading">Related services</h2>
            <p>
              Explore related home care options, or return to the <Link href="/services">Services hub</Link>.
            </p>
          </Reveal>
          <ul className="svc-page__related-list">
            {related.map((service, i) => (
              <Reveal as="li" key={service.slug} direction="left" distance={28} delay={0.04 * i}>
                <Link href={serviceHref(service.slug)}>
                  {service.name} <ArrowRight size={14} />
                </Link>
              </Reveal>
            ))}
            <Reveal as="li" direction="left" distance={28} delay={0.04 * related.length}>
              <Link href="/services">
                All services <ArrowRight size={14} />
              </Link>
            </Reveal>
          </ul>
          <Reveal className="svc-page__related-cta" direction="left" distance={32} delay={0.12}>
            <AntiMetalButton href={ctaHref} label="Request a Nurse" />
          </Reveal>
        </div>
      </section>
    </main>
  );
}

export function HomeNursingPage() {
  return <ServiceDetailPage page={homeNursingPage} jsonLd={homeNursingJsonLd()} />;
}
