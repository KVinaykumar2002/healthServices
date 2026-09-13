import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { Link } from "wouter";

interface PartnerLogo {
  name: string;
  src: string;
  width: number;
  height: number;
}

const partnerLogos: PartnerLogo[] = [
  {
    name: "Fortis Hospitals",
    src: "https://www.portea.com/static/2a9fcceafc87a1dbc60389f7ac96c4c9/c7b54/p1.png",
    width: 160,
    height: 115,
  },
  {
    name: "MGM Healthcare",
    src: "https://www.portea.com/static/a14a61d5e3b22b1c9511922f6a0c1869/9347c/p2.png",
    width: 160,
    height: 112,
  },
  {
    name: "Sakra World Hospital",
    src: "https://www.portea.com/static/1460c06748e19ed747896c9b687fcaff/e887a/p3.png",
    width: 160,
    height: 106,
  },
  {
    name: "S.L. Raheja Hospital",
    src: "https://www.portea.com/static/9106e53c97f02f960f6546f24afc53b5/9645d/p4.png",
    width: 160,
    height: 67,
  },
  {
    name: "Saifee Hospital",
    src: "https://www.portea.com/static/40a7654a851f317a17e9e53c981f251b/d6dbe/p5.png",
    width: 160,
    height: 49,
  },
  {
    name: "NH Rabindranath Tagore Institute",
    src: "https://www.portea.com/static/9fe1537fa21285740dcbde57b83e2e9e/f74b2/p6.png",
    width: 160,
    height: 70,
  },
  {
    name: "Jaslok Hospital",
    src: "https://www.portea.com/static/71da6e5b143e9252eab17fa738e4857d/a6167/p7.png",
    width: 160,
    height: 94,
  },
];

function LogoGroup({
  logos,
  hidden = false,
}: {
  logos: PartnerLogo[];
  hidden?: boolean;
}) {
  return (
    <div className="logo-marquee-group" aria-hidden={hidden || undefined}>
      {logos.map((partner) => (
        <div className="logo-link" aria-label={hidden ? undefined : partner.name} key={partner.name}>
          <img
            src={partner.src}
            alt={hidden ? "" : `${partner.name} logo`}
            width={partner.width}
            height={partner.height}
            loading="lazy"
            decoding="async"
          />
        </div>
      ))}
    </div>
  );
}

export function HospitalPartners() {
  const reduce = useReducedMotion();

  return (
    <section className="hospital-partners" aria-labelledby="partners-heading">
      <div className="partners-container container">
        <h2 id="partners-heading" className="sr-only">
          Our Partners
        </h2>
        <p className="partners-lead">
          BHSK works with leading hospitals, experienced doctors, nurses, diagnostic centers, and
          others to improve health outcomes for patients and reliability for our partners.
        </p>
      </div>

      <div
        className={`logo-marquee${reduce ? " is-static" : ""}`}
        aria-label="Our hospital partners"
      >
        <div className="logo-marquee-track">
          <LogoGroup logos={partnerLogos} />
          {!reduce && <LogoGroup logos={partnerLogos} hidden />}
        </div>
      </div>

      <div className="partners-container container">
        <Link className="partners-cta" href="/contact-us">
          <span>Partner with us</span>
          <ArrowRight aria-hidden="true" size={15} strokeWidth={2.2} />
        </Link>
      </div>
    </section>
  );
}
