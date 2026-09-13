import { IndianRupee } from "lucide-react";
import { Link } from "wouter";

type Offer = {
  id: string;
  badge: string;
  title: string;
  emphasis: string;
  detail: string;
  image: string;
  alt: string;
};

const offers: Offer[] = [
  {
    id: "physiotherapy",
    badge: "100 Off",
    title: "Physiotherapy",
    emphasis: "Flat Rs.100/- Off On",
    detail: "Your 1st Physiotherapy Session.",
    image: "https://www.portea.com/static/4bbd80dd562c5ecc0cdee12d84a223a4/6c8f9/womens.png",
    alt: "Woman receiving physiotherapy treatment",
  },
  {
    id: "eldercare",
    badge: "10% Off",
    title: "Eldercare",
    emphasis: "Get Flat 10% Off",
    detail: "Caretaker at Home",
    image: "https://www.portea.com/static/9ae16809b2b8c532f79c7293759001a2/b0449/na_offer.png",
    alt: "Caregiver offering support at home",
  },
  {
    id: "doctor-visit",
    badge: "10% Off",
    title: "Doctor Visit",
    emphasis: "Flat 10% Off",
    detail: "On Doctor Visit to your home",
    image: "https://www.portea.com/static/26a627f248c079dbf6da0fd0ec75b011/57bdb/doctor_consultation_offer.png",
    alt: "Doctor consulting with a patient at home",
  },
];

export function NewOffers() {
  return (
    <section className="offers-section" aria-labelledby="new-offers-heading">
      <div className="offers-inner">
        <header className="offers-header">
          <p className="offers-eyebrow">Limited-time savings</p>
          <h2 id="new-offers-heading" className="offers-title">
            New Offers
          </h2>
        </header>

        <div className="offers-grid">
          {offers.map((offer) => (
            <article key={offer.id} className="offer-card">
              <div className="offer-card-body">
                <span className="offer-badge">
                  {offer.id === "physiotherapy" && (
                    <IndianRupee aria-hidden="true" className="mr-0.5 h-3 w-3" strokeWidth={2.5} />
                  )}
                  {offer.badge}
                </span>
                <h3 className="offer-card-title">{offer.title}</h3>
                <p className="offer-card-detail">
                  <strong>{offer.emphasis}</strong>
                  <span>{offer.detail}</span>
                </p>
                <Link href="/contact-us" className="offer-cta">
                  Book Now
                </Link>
                <p className="offer-terms">*T&amp;C Apply</p>
              </div>
              <figure className="offer-figure" aria-hidden="true">
                <img src={offer.image} alt={offer.alt} loading="lazy" />
              </figure>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
