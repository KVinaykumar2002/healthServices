import { ExternalLink, MapPin, Phone } from "lucide-react";
import { AntiMetalButton } from "@/components/ui/anti-metal-button";
import { Reveal } from "@/lib/motion";
import { CONTACT_PHONES, OFFICE_ADDRESS, OFFICE_MAP } from "@/lib/site";

/** Google Maps embed (no API key) for the BHSK Old Airport office, with directions links. */
export function OfficeMap({ headingId = "office-map-heading" }: { headingId?: string }) {
  return (
    <section className="office-map section" aria-labelledby={headingId}>
      <div className="container office-map__grid">
        <Reveal className="office-map__info" direction="left" distance={48}>
          <div className="eyebrow">VISIT US</div>
          <h2 id={headingId}>Find our office in Doha</h2>
          <p>Our coordination team works from Old Airport. Please call ahead so the right person is available to meet you.</p>
          <div className="contact-detail">
            <MapPin />
            <div>
              <b>BHSK for Health Services</b>
              {OFFICE_ADDRESS.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>
          </div>
          <div className="contact-detail">
            <Phone />
            <div>
              <b>Call before visiting</b>
              <span>
                <a href={CONTACT_PHONES[0].href}>{CONTACT_PHONES[0].display}</a>
                {" / "}
                <a href={CONTACT_PHONES[1].href}>{CONTACT_PHONES[1].display}</a>
              </span>
            </div>
          </div>
          <div className="office-map__actions">
            <AntiMetalButton href={OFFICE_MAP.directionsUrl} label="Get directions" />
            <a className="btn btn-outline" href={OFFICE_MAP.viewUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={16} aria-hidden="true" /> Open in Google Maps
            </a>
          </div>
        </Reveal>
        <Reveal className="office-map__frame" direction="right" distance={48} delay={0.08}>
          <iframe
            src={OFFICE_MAP.embedUrl}
            title="Map showing the BHSK for Health Services office at Old Airport, Doha"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </Reveal>
      </div>
    </section>
  );
}
