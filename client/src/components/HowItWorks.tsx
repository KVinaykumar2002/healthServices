import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Reveal } from "@/lib/motion";
import { REQUEST_NURSE_PATH } from "@/lib/site";

const steps = [
  {
    n: "01",
    title: "Enquiry",
    text: "Tell us whether you need home care or facility staffing, and what support is required.",
  },
  {
    n: "02",
    title: "Assessment",
    text: "Our care team reviews clinical fit, location and timing against current capacity.",
  },
  {
    n: "03",
    title: "Staff matching",
    text: "We match available nursing professionals to the role or home care plan.",
  },
  {
    n: "04",
    title: "Confirmation",
    text: "Service begins only after we confirm the arrangement with you — an enquiry is not a booking.",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="how-section section" aria-labelledby="how-heading">
      <div className="container">
        <Reveal className="section-heading" direction="left" distance={48}>
          <div className="eyebrow">HOW IT WORKS</div>
          <h2 id="how-heading">From enquiry to confirmed care</h2>
          <p>Every request is reviewed before a nurse or staffing placement is confirmed.</p>
        </Reveal>
        <ol className="how-steps">
          {steps.map((step, i) => (
            <Reveal as="li" key={step.n} className="how-step" direction="left" distance={36} delay={0.05 * i}>
              <b aria-hidden="true">{step.n}</b>
              <div>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        <Reveal className="how-cta" direction="left" distance={32} delay={0.2}>
          <Link href={REQUEST_NURSE_PATH} className="btn btn-primary">
            Request a Nurse <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
