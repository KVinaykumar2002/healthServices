import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AntiMetalButton } from "@/components/ui/anti-metal-button";
import { FitImage } from "@/components/FitImage";
import { Seo } from "@/components/Seo";
import { SiteBreadcrumb } from "@/components/SiteBreadcrumb";
import { Reveal } from "@/lib/motion";
import {
  homeNursingPage,
  relatedServicesFor,
  requestHrefFor,
  serviceHref,
  serviceJsonLd,
  servicePageBySlug,
  type ServicePageContent,
} from "@/lib/servicePages";
import { useSiteContact } from "@/lib/siteSettings";
import { ArrowRight, Check, MapPin, Phone, X } from "lucide-react";
import { useMemo } from "react";
import { Link } from "wouter";

type ServiceDetailPageProps = {
  page: ServicePageContent;
  jsonLd?: Record<string, unknown>;
};

export function ServiceDetailPage({ page, jsonLd }: ServiceDetailPageProps) {
  const related = relatedServicesFor(page);
  const ctaHref = requestHrefFor(page);
  const isFacility = page.category === "facility";
  const phone = useSiteContact().primaryPhone;
  const structuredData = useMemo(() => jsonLd ?? serviceJsonLd(page), [jsonLd, page]);

  return (
    <main className="svc-page">
      <Seo title={page.seoTitle} description={page.seoDescription} path={page.path} jsonLd={structuredData} />

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
            {page.eyebrow.toUpperCase()}
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

      <section className="section svc-page__media-section" aria-label={`${page.name} in Qatar`}>
        <div className="container">
          <Reveal className="svc-page__media" direction="left" distance={48}>
            <FitImage src={page.imageUrl} alt={page.imageAlt} className="svc-page__frame" />
          </Reveal>
        </div>
      </section>

      <section className="section svc-page__audience" aria-labelledby="audience-heading">
        <div className="container svc-page__audience-inner">
          <Reveal className="section-heading" direction="left" distance={48}>
            <div className="eyebrow">{isFacility ? "WHO WE SUPPORT" : "WHO IT'S FOR"}</div>
            <h2 id="audience-heading">{page.audience.heading}</h2>
          </Reveal>
          <div className="check-list svc-page__audience-list">
            {page.audience.items.map((item, i) => (
              <Reveal key={item} direction="left" distance={28} delay={0.04 * i}>
                <div>
                  <Check /> {item}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section svc-page__scope" aria-labelledby="scope-heading">
        <div className="container">
          <Reveal className="section-heading" direction="left" distance={48}>
            <div className="eyebrow">SERVICE DETAILS</div>
            <h2 id="scope-heading">{page.scopeHeading}</h2>
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
              {isFacility
                ? "Need to confirm duties for a specific role? Use "
                : "Need the service lead to confirm duties for your case? Use "}
              <Link href={ctaHref}>{page.heroCtaLabel}</Link> or call{" "}
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
                <span className="how-step__dot" aria-hidden="true">
                  <span className="how-step__dot-fill" />
                  <span className="how-step__num">{step.n}</span>
                </span>
                <div className="how-step__copy">
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
            <h2 id="svc-faq-heading">{page.faqHeading}</h2>
            <p>
              Can’t find your answer? Call <a href={phone.href}>{phone.display}</a> or use{" "}
              <Link href={ctaHref}>{page.heroCtaLabel}</Link> and the BHSK team will get back to you.
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
              {isFacility ? "Explore other healthcare staffing options" : "Explore related home care options"}, or
              return to the <Link href="/services">Services hub</Link>.
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
            <AntiMetalButton href={ctaHref} label={page.heroCtaLabel} />
          </Reveal>
        </div>
      </section>
    </main>
  );
}

export function HomeNursingPage() {
  return <ServiceDetailPage page={homeNursingPage} />;
}

export function ServicePageBySlug({ slug }: { slug: string }) {
  const page = servicePageBySlug(slug);
  return page ? <ServiceDetailPage page={page} /> : null;
}
