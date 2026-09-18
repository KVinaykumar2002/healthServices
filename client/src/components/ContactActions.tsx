import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { Link } from "wouter";
import { Reveal } from "@/lib/motion";
import { CONTACT_PHONES, REQUEST_NURSE_PATH, REQUEST_STAFF_PATH, WHATSAPP } from "@/lib/site";

/** Four primary contact actions — phone, WhatsApp, nurse request, consultation. */
export function ContactActions() {
  const phone = CONTACT_PHONES[0];

  return (
    <section className="contact-actions section" aria-labelledby="contact-actions-heading">
      <div className="container">
        <Reveal className="section-heading" direction="left" distance={48}>
          <div className="eyebrow">GET IN TOUCH</div>
          <h2 id="contact-actions-heading">Talk to BHSK in Qatar</h2>
          <p>Call, message on WhatsApp, request a nurse, or book a consultation. Employer staffing requests stay on a separate form.</p>
        </Reveal>
        <div className="contact-actions__grid">
          <Reveal className="contact-actions__item" direction="left" distance={32} delay={0.04}>
            <a href={phone.href} className="btn btn-primary contact-actions__btn">
              <Phone size={16} /> Call Now
            </a>
            <p>Speak with our team on {phone.display}</p>
          </Reveal>
          <Reveal className="contact-actions__item" direction="left" distance={32} delay={0.08}>
            <a
              href={WHATSAPP.href}
              className="btn btn-outline contact-actions__btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={16} /> WhatsApp Us
            </a>
            <p>Message us on WhatsApp for a quick enquiry</p>
          </Reveal>
          <Reveal className="contact-actions__item" direction="left" distance={32} delay={0.12}>
            <Link href={REQUEST_NURSE_PATH} className="btn btn-primary contact-actions__btn">
              Request a Nurse <ArrowRight size={16} />
            </Link>
            <p>Home care form for individuals and families</p>
          </Reveal>
          <Reveal className="contact-actions__item" direction="left" distance={32} delay={0.16}>
            <Link href="/book-consultation" className="btn btn-outline contact-actions__btn">
              Book a Consultation <ArrowRight size={16} />
            </Link>
            <p>Share your needs and we will follow up</p>
          </Reveal>
        </div>
        <Reveal className="contact-actions__employer" direction="left" distance={28} delay={0.2}>
          <p>
            Employers needing facility staff:{" "}
            <Link href={REQUEST_STAFF_PATH}>Request healthcare staffing</Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
