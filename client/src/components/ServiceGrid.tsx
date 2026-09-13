import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { easeOut } from "@/lib/motion";

export interface ServiceItem {
  name: string;
  slug: string;
  imageUrl: string;
  text: string;
}

export interface ServiceGridProps {
  title: string;
  subtitle?: string;
  services: ServiceItem[];
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { y: 22, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 1, ease: easeOut },
  },
};

/** Adapted from 21st.dev Service Grid (ravikatiyar162) — image + title grid with stagger. */
export function ServiceGrid({ title, subtitle, services, className }: ServiceGridProps) {
  const reduce = useReducedMotion();

  return (
    <section className={cn("service-grid-section", className)}>
      <div className="container">
        <div className="section-heading">
          <div className="eyebrow">OUR SERVICES</div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>

        <motion.div
          className="service-image-grid"
          variants={reduce ? undefined : containerVariants}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={{ once: true, amount: 0.12 }}
        >
          {services.map((service) => (
            <motion.div key={service.slug} variants={reduce ? undefined : itemVariants}>
              <Link href={`/${service.slug}`} className="service-tile">
                <div className="service-tile-media">
                  <img src={service.imageUrl} alt={service.name} loading="lazy" />
                  <div className="service-tile-wash" />
                </div>
                <span>{service.name}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
