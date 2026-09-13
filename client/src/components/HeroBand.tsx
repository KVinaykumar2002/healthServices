import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { easeOut } from "@/lib/motion";

type HeroProps = {
  brand: string;
  established?: string;
  description: string;
  backgroundImage: string;
  backgroundAlt?: string;
  ctaLabel: string;
  ctaHref: string;
};

/** Adapted from 21st.dev Hero 12 (felipemenezes098) — full-bleed image hero. */
export function HeroBand({
  brand,
  established,
  description,
  backgroundImage,
  backgroundAlt = "",
  ctaLabel,
  ctaHref,
}: HeroProps) {
  const reduce = useReducedMotion();

  return (
    <section className="hero-bleed">
      <motion.img
        src={backgroundImage}
        alt={backgroundAlt}
        className="hero-bleed-img"
        decoding="async"
        initial={reduce ? false : { opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: easeOut }}
      />
      <div className="hero-bleed-wash" />

      <div className="container hero-bleed-inner">
        <motion.div
          className="hero-bleed-copy"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 1, ease: easeOut }}
        >
          <img src="/image.png" alt="BHSK Nursing Services" className="hero-logo" />
          <div className="hero-title-row">
            <h1>{brand}</h1>
            {established ? <span className="hero-established">{established}</span> : null}
          </div>
          <p>{description}</p>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 1, ease: easeOut }}
        >
          <Link href={ctaHref} className="btn btn-primary">
            {ctaLabel} <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
