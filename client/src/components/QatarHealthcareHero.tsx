import { Link } from "wouter";
import { ArrowUpRight, ShieldCheck, Star, Timer } from "lucide-react";

const services = [
  {
    title: "Doctor at home",
    href: "/contact-us?service=Doctor%20at%20home",
    image:
      "https://res.cloudinary.com/dbubjszto/image/upload/frhstagingweb/Doctor_at_home_qatar_1_cd4c23236f.webp",
  },
  {
    title: "Pediatrician at home",
    href: "/contact-us?service=Pediatrician%20at%20home",
    image:
      "https://res.cloudinary.com/dbubjszto/image/upload/frhstagingweb/Pediatrician_At_Home_1_75551d9ace.webp",
  },
  {
    title: "Physiotherapy at home",
    href: "/physiotherapy",
    image:
      "https://res.cloudinary.com/dbubjszto/image/upload/frhstagingweb/Physiotherapy_at_Home_c58d2b8cb8.webp",
  },
  {
    title: "Lab tests at home",
    href: "/contact-us?service=Lab%20Tests%20At%20Home",
    image:
      "https://res.cloudinary.com/dbubjszto/image/upload/frhstagingweb/Lab_Tests_at_Home_f0b42d4e95.webp",
  },
  {
    title: "Nursing at home",
    href: "/elderly-care",
    image:
      "https://res.cloudinary.com/dbubjszto/image/upload/frhstagingweb/Nursing_at_Home_db476b44ad.webp",
  },
  {
    title: "Health checkups at home",
    href: "/contact-us?service=Health%20checkups%20at%20home",
    image:
      "https://res.cloudinary.com/dbubjszto/image/upload/frhstagingweb/Health_Checkups_cae1da6ace.webp",
  },
] as const;

const trustItems = [
  {
    eyebrow: "Highest rated home healthcare in the GCC",
    title: "3K+, 5 star Google reviews",
    icon: "star",
  },
  {
    eyebrow: "High quality healthcare",
    title: "Licensed by Department of Healthcare Professions",
    icon: "shield",
  },
  {
    eyebrow: "Fastest response",
    title: "Team reaches in 30–45 minutes",
    icon: "timer",
  },
] as const;

export function QatarHealthcareHero() {
  return (
    <section className="min-h-screen w-full bg-[#f7f4f1] px-5 py-6 text-[#1e1e1e] sm:px-8 sm:py-10 lg:px-14 lg:py-14">
      <div
        className="mx-auto flex w-full max-w-[1440px] flex-col items-stretch justify-between gap-8 lg:flex-row lg:items-end lg:gap-10"
        aria-labelledby="page-title"
      >
        <div className="min-w-0 flex-1 pb-0 lg:mb-7 lg:max-w-[calc(100%-375px)]">
          <div className="max-w-[730px]">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f7272] sm:mb-7 sm:text-xs">
              First Response Healthcare · Qatar
            </p>
            <h1
              id="page-title"
              className="max-w-[720px] text-[clamp(3.4rem,7.2vw,6.8rem)] font-normal leading-[0.94] tracking-[-0.065em] text-[#663535]"
            >
              Home healthcare service in Qatar
            </h1>
            <p className="mt-7 max-w-[570px] text-[16px] leading-6 text-[#5c757a] sm:mt-8 sm:text-[18px] sm:leading-7">
              Qatar’s leading provider of healthcare at homes, hotels &amp; offices.
            </p>
          </div>

          <div
            className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
            aria-label="Home healthcare services"
          >
            {services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group relative flex h-[132px] items-end overflow-hidden rounded-[11px] bg-[#f4e6e6] p-5 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#663535] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f4f1]"
              >
                <span className="relative z-10 max-w-[135px] text-[15px] capitalize leading-[18px] text-[#1e1e1e]">
                  {service.title}
                </span>
                <img
                  src={service.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute bottom-0 right-0 h-full w-[78%] object-contain object-[20px_100%] transition-transform duration-500 group-hover:scale-105"
                />
                <ArrowUpRight
                  className="absolute right-4 top-4 z-10 h-4 w-4 text-[#8f7272] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>

        <figure className="relative m-0 h-[520px] w-full shrink-0 overflow-hidden rounded-[13px] bg-[#d8cbc6] sm:h-[610px] lg:w-[340px]">
          <video
            className="h-full w-full object-cover"
            src="https://res.cloudinary.com/dbubjszto/video/upload/frhstagingweb/DOC_Vertical_Compress_57dc613651.mp4"
            autoPlay
            loop
            muted
            playsInline
            aria-label="Doctor preparing for a home consultation"
          />
          <figcaption className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5">
            <div>
              <h2 className="mt-3 text-[20px] font-normal leading-5 text-[#333]">
                Consult a doctor
              </h2>
              <span className="mt-2 inline-flex rounded-full bg-[rgba(70,70,70,0.38)] px-3.5 py-1.5 text-[9px] leading-[10px] text-[#f1eeee] backdrop-blur-md">
                Doctor on call
              </span>
            </div>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {trustItems.map((item) => (
                <li
                  key={item.title}
                  className="flex items-center gap-3 rounded-[11px] bg-white p-3.5 shadow-[0_8px_30px_rgba(75,48,43,0.06)]"
                >
                  <span
                    className="flex h-[53px] w-[53px] shrink-0 items-center justify-center rounded-[10px] border border-[#f0eeee] bg-[#fffafa]"
                    aria-hidden="true"
                  >
                    {item.icon === "star" ? (
                      <Star className="h-6 w-6 fill-[#c29855] text-[#c29855]" />
                    ) : null}
                    {item.icon === "shield" ? (
                      <ShieldCheck className="h-6 w-6 text-[#7f9b9e]" />
                    ) : null}
                    {item.icon === "timer" ? (
                      <Timer className="h-6 w-6 text-[#8e6969]" />
                    ) : null}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] leading-[18px] text-[#726f6e]">
                      {item.eyebrow}
                    </span>
                    <strong className="block text-[13px] font-normal leading-[18px] text-[#726f6e]">
                      {item.title}
                    </strong>
                  </span>
                </li>
              ))}
            </ul>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
