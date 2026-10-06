import { Fragment } from "react";
import { ExternalLink, MapPin, Phone } from "lucide-react";
import { AntiMetalButton } from "@/components/ui/anti-metal-button";
import { Reveal } from "@/lib/motion";
import { useSiteContact } from "@/lib/siteSettings";

/** Google Maps embed (no API key) for the BHSK Old Airport office, with directions links. */
export function OfficeMap({ headingId = "office-map-heading" }: { headingId?: string }) {
  const contact = useSiteContact();

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
              {contact.addressLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>
          </div>
          <div className="contact-detail">
            <Phone />
            <div>
              <b>Call before visiting</b>
              <span>
                {contact.phones.map((phone, index) => (
                  <Fragment key={phone.href}>
                    {index > 0 ? " / " : null}
                    <a href={phone.href}>{phone.display}</a>
                  </Fragment>
                ))}
              </span>
            </div>
          </div>
          <div className="office-map__actions">
            <AntiMetalButton href={contact.map.directionsUrl} label="Get directions" />
            <a className="btn btn-outline" href={contact.map.viewUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={16} aria-hidden="true" /> Open in Google Maps
            </a>
          </div>
        </Reveal>
        <Reveal className="office-map__frame" direction="right" distance={48} delay={0.08}>
          <iframe
            src={contact.map.embedUrl}
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
