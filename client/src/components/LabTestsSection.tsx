import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { LabTestsTile } from "@/components/LabTestsTile";
import { Reveal } from "@/lib/motion";

const services = [
  "Vitamin D",
  "Beta-HCG",
  "Diabetes Tests",
  "Thyroid Tests",
  "Hormone Tests",
  "STD Tests",
];

export function LabTestsSection() {
  const [, setLocation] = useLocation();
  const [showAll, setShowAll] = useState(false);

  function goToLabEnquiry(testName?: string) {
    const params = new URLSearchParams({
      service: testName ? `Lab Tests At Home — ${testName}` : "Lab Tests At Home",
    });
    setLocation(`/contact-us?${params.toString()}`);
  }

  return (
    <section className="lab-section" aria-labelledby="lab-tests-title">
      <div className="lab-container">
        <div className="lab-layout">
          <Reveal className="lab-tile-slot" direction="left" distance={80}>
            <LabTestsTile />
          </Reveal>

          <div className="lab-content-layout">
            <Reveal as="article" className="lab-copy-card" direction="left" delay={0.08}>
              <div className="lab-copy-inner">
                <h2 id="lab-tests-title">Lab Tests At Home</h2>
                <div className="lab-copy-bottom">
                  <p>
                    For timely diagnosis and effective treatment, get professional sample collection
                    with quick reporting done at home
                  </p>
                  <button className="primary-button" type="button" onClick={() => goToLabEnquiry()}>
                    <span>Get Started</span>
                  </button>
                </div>
              </div>
            </Reveal>

            <Reveal className="lab-services-card" direction="right" delay={0.14} distance={64}>
              <video
                className="lab-video"
                src="https://res.cloudinary.com/dbubjszto/video/upload/frhstagingweb/lab_test_video_3d7345496a.mp4"
                autoPlay
                loop
                muted
                playsInline
                aria-hidden="true"
              />
              <div className="video-tint" aria-hidden="true" />
              <div className="services-content">
                <div className="popular-pill">
                  <TrendingMark />
                  <span>Most Popular</span>
                </div>
                <ul className="service-list" aria-label="Popular lab services">
                  {services.map((service) => (
                    <li key={service}>
                      <button
                        type="button"
                        className="service-link"
                        onClick={() => goToLabEnquiry(service)}
                      >
                        <span>{service}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  className="all-services-button"
                  type="button"
                  onClick={() => setShowAll((visible) => !visible)}
                  aria-expanded={showAll}
                >
                  <span>{showAll ? "Close" : "All Services"}</span>
                  <ChevronRight size={13} strokeWidth={1.7} aria-hidden="true" />
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrendingMark() {
  return (
    <svg width="11" height="8" viewBox="0 0 11 8" fill="none" aria-hidden="true">
      <path
        d="M9.5 1 5.35 5.15 2.92 2.72.75 4.9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.58 1H9.5v2.92"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
