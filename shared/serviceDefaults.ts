import type { ServiceContent } from "./services";

/** The website's original services. Scope lists are provisional pending BHSK service-lead sign-off. */
export const DEFAULT_SERVICES: ServiceContent[] = [
  {
    slug: "home-nursing",
    category: "home",
    visible: true,
    name: "Home Nursing",
    menuLabel: "Home Nursing",
    icon: "heart-handshake",
    text: "Professional home nursing in Qatar for elderly support, recovery after surgery and ongoing care needs.",
    cardImageUrl: "/images/bhsk/home-nursing.jpg",
    imageUrl: "/images/bhsk/services/home-nursing.jpg",
    imageAlt: "BHSK nurse dressing a patient's leg at home in Qatar",
    eyebrow: "Home nursing · Qatar",
    h1: "Home Nursing Services in Qatar",
    intro: [
      "BHSK for Health Services provides home nursing in Qatar for people who need professional care in the comfort of their own home. Whether you are supporting an elderly family member, recovering after surgery, or managing an ongoing health condition, our team can discuss your needs and help arrange suitable nursing support.",
      "Contact us to discuss your care requirements and check availability in your area.",
    ],
    heroCtaLabel: "Request a Nurse",
    seoTitle: "Home Nursing Services in Qatar | BHSK for Health Services",
    seoDescription:
      "Explore home nursing services in Qatar with BHSK. Get support for elderly care, recovery after surgery and ongoing care needs. Contact us to check availability.",
    audience: {
      heading: "Who home nursing is for",
      items: [
        "Families who want professional nursing for a relative without moving them out of home",
        "Patients returning home after a hospital stay who still need nursing checks",
        "People managing an ongoing condition who need regular nursing support",
        "Patients who need prescribed injections or dressings given at home",
        "Families unsure which care they need and who want to talk it through first",
      ],
    },
    scopeHeading: "Scope of home nursing care",
    scope: {
      scopeNote:
        "BHSK does not promise care outside the approved scope for each assignment. Exact duties, hours and clinical limits are confirmed after assessment and reviewed by the BHSK service lead before any placement.",
      included: [
        "Professional nursing support at home after needs and location are assessed",
        "Monitoring and observation agreed for the assignment (for example vital signs, recovery checks)",
        "Medication support within the nurse’s approved role and the care plan confirmed with you",
        "Assistance with activities of daily living when nursing support is clinically appropriate",
        "Post-surgery or ongoing-condition support when a home setting is suitable",
        "Clear updates to the family or nominated contact on what was observed during visits",
        "Matching to available nurses whose skills fit the confirmed care plan",
      ],
      notIncluded: [
        "Emergency, ambulance or intensive hospital-level care at home",
        "Guaranteed same-day or fixed response times before assessment",
        "Diagnosis, prescribing or procedures outside the nurse’s approved scope",
        "Staffing or care in areas BHSK has not confirmed as available",
        "Tasks, hours or clinical duties that were not agreed in the confirmed plan",
        "A confirmed booking based on an enquiry alone",
      ],
    },
    coverage: {
      heading: "Coverage and availability in Qatar",
      paragraphs: [
        "BHSK for Health Services is based in Doha (Old Airport) and arranges home nursing in Qatar where care needs, location and staff availability allow.",
        "We do not publish a fixed list of guaranteed neighbourhoods or response times on this page. When you enquire, share your area and care requirements. The BHSK team checks whether suitable nursing support can be arranged and confirms what is available before any placement.",
        "Availability can change with demand, clinical fit and licensing. An enquiry is a request for review — not a promise of coverage.",
      ],
    },
    process: {
      heading: "How to request home nursing staff",
      intro:
        "These steps show how a home nursing request moves from first contact to a confirmed arrangement.",
      whoContacts:
        "A BHSK team member contacts the family or nominated enquiry contact after the request is reviewed. Placement begins only after confirmation.",
      steps: [
        {
          title: "Enquiry",
          text: "Submit Request a Nurse with the service selected as Home Nursing, or call / WhatsApp us. Tell us who needs care, the type of support and your location.",
        },
        {
          title: "Assessment",
          text: "Our team reviews clinical fit, home setting, schedule preferences and whether suitable staff are available in your area.",
        },
        {
          title: "Matching",
          text: "Where a fit exists, we match available nursing professionals to the agreed plan and discuss practical details with you.",
        },
        {
          title: "Confirmation",
          text: "Service starts only after BHSK confirms the arrangement with you. An enquiry is not a confirmed booking.",
        },
      ],
    },
    trust: {
      heading: "Staffing standards and questions",
      paragraphs: [
        "We do not publish copied reviews, unverified ratings or generic claims on this page. Facts about qualifications and screening are limited to what BHSK can stand behind for Qatar assignments.",
        "Nurse matching for home nursing follows BHSK’s internal screening and assignment checks. Specific licence, training and identity details relevant to your case are confirmed by the team during assessment — not assumed from a website form.",
      ],
      facts: [
        "Home nursing staff are arranged only after BHSK assesses the request",
        "Screening and role fit are checked before a nurse is proposed for an assignment",
        "Qualification and identity details for a proposed nurse are shared when relevant to confirmation",
        "Unsupported marketing claims and third-party reviews are not used on this page",
      ],
    },
    faqHeading: "Questions about home nursing",
    faqs: [
      {
        question: "What is home nursing with BHSK in Qatar?",
        answer:
          "Home nursing is professional nursing support arranged for someone who needs care at home — for example elderly support, recovery after surgery, or ongoing health needs. BHSK discusses your requirements, checks suitability and availability, then confirms a plan before service starts.",
      },
      {
        question: "Which areas in Qatar do you cover?",
        answer:
          "Coverage depends on the assignment, care needs and current staff availability. Share your location when you enquire. The team will confirm whether we can support your area — we do not guarantee every location in advance.",
      },
      {
        question: "Is sending an enquiry the same as booking a nurse?",
        answer:
          "No. An enquiry starts a conversation. Care and staffing are confirmed only after assessment and matching. Until BHSK confirms, there is no booking.",
      },
      {
        question: "How quickly can a home nurse start?",
        answer:
          "Timing depends on clinical fit and availability. We do not promise same-day or fixed response times on this page. After you enquire, the team reviews your request and explains realistic next steps.",
      },
      {
        question: "What can and cannot a home nurse do?",
        answer:
          "Duties stay within the approved scope confirmed for that assignment. Typical nursing support may include monitoring, agreed medication support and daily care assistance when clinically appropriate. Emergency care, out-of-scope procedures and unconfirmed tasks are not included. Ask the service lead to clarify limits for your case.",
      },
      {
        question: "Who will contact us after we request a nurse?",
        answer:
          "A BHSK team member follows up with the family or the person named on the enquiry to discuss assessment findings, availability and confirmation steps.",
      },
    ],
    relatedSlugs: [
      "elderly-care",
      "post-operative",
      "chronic-care",
      "palliative-care",
      "maternity-newborn",
      "physiotherapy",
    ],
  },
  {
    slug: "hospitals",
    category: "facility",
    visible: true,
    name: "Nursing Services for Hospitals",
    menuLabel: "Hospital Nursing",
    icon: "building-2",
    text: "Skilled nursing support that integrates with hospital wards and clinical teams in Qatar.",
    cardImageUrl: "/images/bhsk/hospitals.jpg",
    imageUrl: "/images/bhsk/services/hospitals.jpg",
    imageAlt: "BHSK nurse working on a hospital ward in Qatar",
    eyebrow: "Healthcare staffing · Hospitals",
    h1: "Nursing Staff for Hospitals in Qatar",
    intro: [
      "Hospitals need dependable nursing cover when wards are busy, staff are on leave or new units open. BHSK for Health Services supplies nursing professionals to hospitals in Qatar who work within your clinical teams, policies and supervision structures.",
      "Tell us the departments, number of nurses and shift patterns you need, and our staffing team will discuss what can be arranged.",
    ],
    heroCtaLabel: "Request Staff",
    seoTitle: "Hospital Nursing Staff in Qatar | BHSK Healthcare Staffing",
    seoDescription:
      "Nursing staff for hospitals in Qatar — ward cover, shift support and short- or longer-term placements. Contact BHSK to discuss roles, shifts and availability.",
    audience: {
      heading: "Who hospital staffing is for",
      items: [
        "Private and public hospitals needing ward or unit nursing cover",
        "Hospitals covering staff leave, sickness or seasonal demand",
        "Facilities opening new units or expanding bed capacity",
        "Nursing managers who need planned or short-notice shift support",
        "Hospitals looking for longer-term placements in specific roles",
      ],
    },
    scopeHeading: "Hospital staffing scope",
    scope: {
      scopeNote:
        "BHSK places nursing staff only in roles agreed with your hospital. Duties, shift patterns and supervision arrangements are confirmed in writing before placement, and staff work under your hospital’s clinical governance.",
      included: [
        "Qualified nurses for general wards, subject to role fit and availability",
        "Specialty roles such as critical care or emergency, where suitably experienced staff are available",
        "Day, night and weekend shift cover as agreed",
        "Short-term cover and longer-term placements",
        "Candidate profiles and relevant credentials shared before placement",
        "A named BHSK coordinator for scheduling and placement questions",
        "Placement reviews with your nursing management",
      ],
      notIncluded: [
        "Doctors, allied health or non-nursing roles unless separately agreed",
        "Clinical supervision — placed nurses work under your hospital’s supervision",
        "Guaranteed fill rates or response times before your request is reviewed",
        "Specialties or roles BHSK has not confirmed it can fill",
        "Placements before approval, contracts and credential checks are complete",
        "Changes to a placed nurse’s duties beyond what was agreed",
      ],
    },
    coverage: {
      heading: "Supporting hospitals across Qatar",
      paragraphs: [
        "BHSK coordinates hospital placements from its office in Old Airport, Doha. Whether a request can be filled depends on the role, specialty, shift pattern and the nurses available at that time.",
        "We do not publish guaranteed fill rates. When you share your requirements, the team confirms what can be supplied and from when.",
        "For recurring needs, we can discuss a regular arrangement that is reviewed with your nursing management.",
      ],
    },
    process: {
      heading: "How hospitals request nursing staff",
      intro:
        "A clear staffing process from your first request to a nurse on your ward.",
      whoContacts:
        "A BHSK staffing coordinator contacts the nursing manager or HR contact named on the request.",
      steps: [
        {
          title: "Request",
          text: "Use Request Staff or call us with the department, number of nurses, shift pattern, start date and any specialty requirements.",
        },
        {
          title: "Review",
          text: "Our team reviews the roles, skills and credentials required and checks current availability.",
        },
        {
          title: "Proposal",
          text: "We share suitable nurse profiles and credentials for your hospital’s approval.",
        },
        {
          title: "Placement",
          text: "Nurses start after your hospital approves them and terms are confirmed. A request alone does not guarantee cover.",
        },
      ],
    },
    trust: {
      heading: "Staffing standards for hospitals",
      paragraphs: [
        "Hospitals need facts, not marketing claims. We describe only the staffing BHSK can supply, and we do not use unapproved client logos or testimonials.",
        "Nurses proposed for hospital placements go through BHSK’s screening and credential checks. Licence, qualification and identity details are shared with your team before placement.",
      ],
      facts: [
        "Candidate credentials are shared before placement",
        "Placed staff follow your hospital’s policies and supervision",
        "A named BHSK coordinator handles scheduling",
        "No unapproved client logos or testimonials are used",
      ],
    },
    faqHeading: "Questions from hospitals",
    faqs: [
      {
        question: "Can you provide nurses at short notice?",
        answer:
          "Short-notice requests can be discussed. Whether they can be filled depends on the role and current availability; we do not guarantee response times before reviewing the request.",
      },
      {
        question: "Do you supply specialty nurses such as ICU or emergency?",
        answer:
          "Specialty roles can be requested. We will confirm honestly whether suitably experienced and credentialed nurses are available.",
      },
      {
        question: "Who supervises the nurses you place?",
        answer:
          "Placed nurses work under your hospital’s clinical supervision, policies and protocols.",
      },
      {
        question: "Can we review nurses before they start?",
        answer:
          "Yes. Candidate profiles and relevant credentials are shared for your approval before placement.",
      },
      {
        question: "Do you offer long-term placements?",
        answer:
          "Both short-term cover and longer-term placements can be discussed, depending on your needs and availability.",
      },
    ],
    relatedSlugs: ["medical-centres", "schools-nurseries", "camp-construction"],
  },
  {
    slug: "medical-centres",
    category: "facility",
    visible: true,
    name: "Nursing Services for Medical Centres",
    menuLabel: "Medical Centres",
    icon: "building",
    text: "Reliable clinic and outpatient nursing for busy medical centres.",
    cardImageUrl: "/images/bhsk/medical-centres.jpg",
    imageUrl: "/images/bhsk/services/medical-centres.jpg",
    imageAlt: "BHSK nurse assisting patients at a medical centre",
    eyebrow: "Healthcare staffing · Medical centres",
    h1: "Nursing Staff for Medical Centres and Clinics in Qatar",
    intro: [
      "Busy medical centres and outpatient clinics depend on nurses who keep patients moving smoothly — from triage and vital signs to treatment rooms and patient education. BHSK supplies nursing staff to clinics and medical centres in Qatar for regular shifts, extended hours and cover during leave.",
      "Share your clinic’s specialties, opening hours and staffing gaps, and our team will discuss suitable options.",
    ],
    heroCtaLabel: "Request Staff",
    seoTitle: "Clinic and Medical Centre Nursing Staff in Qatar | BHSK",
    seoDescription:
      "Nursing staff for medical centres and clinics in Qatar — triage, treatment room and outpatient support for regular shifts or leave cover. Contact BHSK.",
    audience: {
      heading: "Who clinic staffing is for",
      items: [
        "Polyclinics and outpatient medical centres",
        "Specialist clinics such as dermatology, paediatric or women’s health",
        "Clinics extending opening hours or adding evening and weekend sessions",
        "Medical centres covering nurse leave or vacancies",
        "New clinics building their nursing team",
      ],
    },
    scopeHeading: "Clinic and medical centre staffing scope",
    scope: {
      scopeNote:
        "Nurses placed in medical centres work within your clinic’s policies, licensed services and supervision. Duties and hours are agreed before placement.",
      included: [
        "Nurses for triage, vital signs and patient preparation",
        "Treatment room support — dressings, injections and procedures within the nurse’s approved role",
        "Assisting clinicians during examinations and minor procedures",
        "Patient education on medicines, follow-up and aftercare",
        "Infection control and treatment room readiness",
        "Regular shifts, extended hours or leave cover as agreed",
        "Candidate profiles and credentials shared before placement",
      ],
      notIncluded: [
        "Doctors, pharmacists, lab technicians or reception staff unless separately agreed",
        "Laboratory testing or diagnostic services",
        "Work outside your clinic’s licensed services or protocols",
        "Guaranteed cover before the request is reviewed",
        "Roles BHSK has not confirmed it can fill",
        "Placements before approval and terms are confirmed",
      ],
    },
    coverage: {
      heading: "Supporting clinics across Qatar",
      paragraphs: [
        "Clinic staffing requests are coordinated from BHSK’s Doha office. Availability depends on the role, specialty, session times and the nurses available.",
        "Tell us your opening hours and the sessions you need covered. We confirm what can be arranged before any nurse is placed.",
        "Regular arrangements can be reviewed as your patient numbers and opening hours change.",
      ],
    },
    process: {
      heading: "How clinics request nursing staff",
      intro: "Straightforward steps for medical centres that need nurse cover.",
      whoContacts:
        "A BHSK staffing coordinator contacts the clinic manager or HR contact named on the request.",
      steps: [
        {
          title: "Request",
          text: "Tell us your clinic type, specialties, the sessions to cover and your start date through Request Staff.",
        },
        {
          title: "Review",
          text: "We review the skills and credentials needed and check which nurses are available for your hours.",
        },
        {
          title: "Proposal",
          text: "Suitable nurse profiles are shared for your review and approval.",
        },
        {
          title: "Placement",
          text: "Nurses start after you approve them and terms are confirmed. Submitting a request does not guarantee cover.",
        },
      ],
    },
    trust: {
      heading: "Reliable staffing for outpatient care",
      paragraphs: [
        "We keep our claims simple and factual, and we don’t display client logos or reviews without permission.",
        "Nurses proposed to medical centres go through BHSK’s screening and credential checks. Relevant licence, qualification and identity details are shared before placement.",
      ],
      facts: [
        "Candidate credentials are reviewed with you before placement",
        "Nurses follow your clinic’s protocols and supervision",
        "Scheduling is handled by a named BHSK coordinator",
        "No unapproved client logos or reviews are used",
      ],
    },
    faqHeading: "Questions from medical centres",
    faqs: [
      {
        question: "Can you cover evening and weekend clinic sessions?",
        answer:
          "Evening and weekend sessions can be requested. We confirm availability for the specific hours after reviewing the request.",
      },
      {
        question: "Can nurses give injections and vaccinations in our clinic?",
        answer:
          "Nurses can carry out procedures within their approved role and your clinic’s protocols and licensed services. Specific duties are agreed before placement.",
      },
      {
        question: "Do you supply other clinic staff?",
        answer:
          "BHSK focuses on nursing staff. Other roles are not included unless separately agreed.",
      },
      {
        question: "Can we have the same nurse for regular shifts?",
        answer:
          "Continuity can be requested and is arranged where the nurse is available.",
      },
      {
        question: "How do we get started?",
        answer:
          "Use Request Staff with your clinic details and staffing needs, or call our team to talk it through.",
      },
    ],
    relatedSlugs: ["hospitals", "schools-nurseries", "camp-construction"],
  },
  {
    slug: "schools-nurseries",
    category: "facility",
    visible: true,
    name: "Nursing Services for Schools / Nurseries",
    menuLabel: "Schools / Nurseries",
    icon: "school",
    text: "On-site school and nursery nurses for first aid, wellness and parent peace of mind.",
    cardImageUrl: "/images/bhsk/schools-nurseries.jpg",
    imageUrl: "/images/bhsk/services/schools-nurseries.jpg",
    imageAlt: "BHSK school nurse caring for a child in a school health room",
    eyebrow: "Healthcare staffing · Schools & nurseries",
    h1: "School and Nursery Nurses in Qatar",
    intro: [
      "Parents trust schools and nurseries to look after their children’s health during the day. BHSK supplies nurses to schools and nurseries in Qatar who run the health room, respond to first-aid situations and support children with health conditions — so teachers can focus on teaching.",
      "Staffing can be discussed for a full academic year, a single term, or cover during leave.",
    ],
    heroCtaLabel: "Request Staff",
    seoTitle: "School and Nursery Nursing Staff in Qatar | BHSK",
    seoDescription:
      "On-site school and nursery nurses in Qatar for first aid, health checks, medication support and student wellbeing. Contact BHSK to discuss your school’s requirements.",
    audience: {
      heading: "Who school nursing is for",
      items: [
        "International and private schools that need an on-site nurse",
        "Nurseries and early-years centres caring for young children",
        "Schools covering nurse leave or vacancies",
        "Summer camps and school events that need health cover",
        "Schools supporting students with asthma, diabetes, allergies or epilepsy",
      ],
    },
    scopeHeading: "What a school or nursery nurse does",
    scope: {
      scopeNote:
        "School nurses work within the school’s health and safeguarding policies and their approved nursing role. Duties, hours and reporting lines are agreed with the school before placement.",
      included: [
        "Running the school health room during school hours",
        "First aid for injuries and sudden illness, with parents informed",
        "Giving prescribed medicines according to school policy and parental consent",
        "Following care plans for children with conditions such as asthma, diabetes or severe allergies",
        "Health records, incident reports and communication with parents",
        "Health and hygiene education for students",
        "Contacting emergency services and parents when needed",
      ],
      notIncluded: [
        "Diagnosis or treatment beyond first aid and agreed care plans",
        "Vaccination programmes unless arranged with the relevant health authorities",
        "Teaching, classroom supervision or transport duties",
        "Counselling or psychological services",
        "Cover before contracts and checks are complete",
        "A guaranteed start date before the request is reviewed",
      ],
    },
    coverage: {
      heading: "School health staffing in Qatar",
      paragraphs: [
        "Many schools plan nursing cover before the academic year starts. Term-time and short-term cover can also be discussed.",
        "Share your school’s size, age groups, hours and any students with complex health needs. The team checks whether a nurse with suitable paediatric or school experience is available.",
        "Arrangements can be reviewed each term or academic year.",
      ],
    },
    process: {
      heading: "How schools request a nurse",
      intro: "Steps for schools and nurseries arranging on-site nursing.",
      whoContacts:
        "A BHSK staffing coordinator contacts the principal, school business manager or HR contact named on the request.",
      steps: [
        {
          title: "Request",
          text: "Tell us about your school or nursery — student numbers, age range, hours and start date.",
        },
        {
          title: "Review",
          text: "We review your health policies, any student care plans and the experience your nurse will need.",
        },
        {
          title: "Proposal",
          text: "We share suitable nurse profiles and credentials to support your school’s safeguarding checks.",
        },
        {
          title: "Placement",
          text: "The nurse starts after the school approves the candidate and terms are confirmed.",
        },
      ],
    },
    trust: {
      heading: "Safeguarding and child health",
      paragraphs: [
        "Working with children needs extra care. We describe only what BHSK can provide and never use unapproved school logos or testimonials.",
        "Nurses proposed for schools go through BHSK’s screening and credential checks and are matched for experience with children. Relevant licence, qualification and identity documents are shared with the school before placement.",
      ],
      facts: [
        "Nurses are matched for experience with children",
        "Credentials are shared to support the school’s safeguarding checks",
        "School policy and parental consent guide medication",
        "Parents are informed of incidents in line with school policy",
      ],
    },
    faqHeading: "Questions from schools and nurseries",
    faqs: [
      {
        question: "Do you provide nurses for nurseries as well as schools?",
        answer:
          "Yes. Nurseries and early-years centres can request nursing staff, and we match nurses with experience caring for young children.",
      },
      {
        question: "Can the nurse give students their medication?",
        answer:
          "Yes. Prescribed medicines are given according to your school policy and with parental consent.",
      },
      {
        question: "Can you cover while our school nurse is on leave?",
        answer:
          "Short-term cover can be requested. Availability is confirmed after we review the dates and requirements.",
      },
      {
        question: "Can you support students with diabetes or severe allergies?",
        answer:
          "Nurses can follow individual health care plans for students with conditions such as diabetes, asthma or severe allergies. Share the details so we can match suitable experience.",
      },
      {
        question: "Do you provide nurses for school trips or events?",
        answer:
          "Trip and event cover can be discussed. It is confirmed only after the dates and requirements are reviewed.",
      },
    ],
    relatedSlugs: ["medical-centres", "hospitals", "camp-construction"],
  },
  {
    slug: "camp-construction",
    category: "facility",
    visible: true,
    name: "Nursing Services for Camp or Construction Site",
    menuLabel: "Camp / Construction",
    icon: "hard-hat",
    text: "Occupational health nursing for remote camps and active construction sites.",
    cardImageUrl: "/images/bhsk/camp-construction.jpg",
    imageUrl: "/images/bhsk/services/camp-construction.jpg",
    imageAlt:
      "BHSK nurse checking a worker's blood pressure in a construction site clinic",
    eyebrow: "Healthcare staffing · Camps & sites",
    h1: "Nursing Staff for Camps and Construction Sites in Qatar",
    intro: [
      "Large worksites and accommodation camps need on-site health support to look after workers and respond quickly to injuries and illness. BHSK supplies nurses to camps and construction projects in Qatar who run site clinics, provide first aid and work alongside your health and safety team.",
      "Tell us about your site, workforce size and shift patterns, and our team will discuss suitable nursing cover.",
    ],
    heroCtaLabel: "Request Staff",
    seoTitle: "Camp and Construction Site Nurses in Qatar | BHSK",
    seoDescription:
      "On-site nurses for accommodation camps and construction sites in Qatar — first aid, health checks, heat stress awareness and site clinic support. Contact BHSK.",
    audience: {
      heading: "Who site and camp nursing is for",
      items: [
        "Construction and infrastructure contractors",
        "Worker and staff accommodation camps",
        "Industrial sites that need on-site health cover",
        "Projects with large workforces working through the summer heat",
        "HSE managers building an on-site health team",
      ],
    },
    scopeHeading: "On-site nursing scope",
    scope: {
      scopeNote:
        "Site nurses work within your HSE procedures, site emergency plan and their approved nursing role. Duties, shift patterns and reporting lines are confirmed before placement.",
      included: [
        "Running the site or camp first-aid room or clinic",
        "First aid for workplace injuries and sudden illness",
        "Heat stress awareness, hydration checks and monitoring during hot months",
        "Basic health checks such as blood pressure and blood sugar",
        "Health and incident records for your HSE team",
        "Health and hygiene awareness sessions for workers",
        "Arranging referral or emergency transfer according to site procedures",
      ],
      notIncluded: [
        "Doctors or a full on-site medical centre unless separately arranged",
        "Ambulance services or vehicles",
        "Pre-employment medical examinations or laboratory tests",
        "Diagnosis or treatment beyond first aid and agreed protocols",
        "Safety inspections or HSE management duties",
        "Cover before contracts and checks are complete",
      ],
    },
    coverage: {
      heading: "Worksite nursing across Qatar",
      paragraphs: [
        "Camp and site staffing depends on the site location, working hours, shift rotation and the nurses available. We confirm what can be supplied before placement.",
        "When you request staff, share your site location, workforce size, working hours and any existing medical arrangements.",
        "On longer projects, arrangements can be reviewed as the workforce and project phase change.",
      ],
    },
    process: {
      heading: "How contractors request site nurses",
      intro: "A clear process for worksite and camp health staffing.",
      whoContacts:
        "A BHSK staffing coordinator contacts the HSE manager, project manager or HR contact named on the request.",
      steps: [
        {
          title: "Request",
          text: "Tell us the site or camp location, workforce size, shifts and start date through Request Staff.",
        },
        {
          title: "Review",
          text: "We review your HSE requirements, emergency procedures and the experience your nurse will need.",
        },
        {
          title: "Proposal",
          text: "We share suitable nurse profiles and credentials for your approval.",
        },
        {
          title: "Placement",
          text: "Nurses are placed after you approve them and terms are confirmed. A request alone does not guarantee cover.",
        },
      ],
    },
    trust: {
      heading: "Health support for your workforce",
      paragraphs: [
        "Worksites need dependable cover and honest answers. We only describe what BHSK can supply and do not use unapproved client logos or testimonials.",
        "Nurses proposed for site placements go through BHSK’s screening and credential checks. Relevant licence, qualification and identity documents are shared before placement.",
      ],
      facts: [
        "Nurses follow your site HSE and emergency procedures",
        "Health and incident records support your reporting",
        "Credentials are shared before placement",
        "Staffing levels are discussed around your site risk and shift pattern",
      ],
    },
    faqHeading: "Questions from contractors and camp operators",
    faqs: [
      {
        question: "Can you provide nurses for night shifts on site?",
        answer:
          "Night and rotating shifts can be requested. We confirm availability for your shift pattern after reviewing the request.",
      },
      {
        question: "Do your nurses help with heat stress prevention?",
        answer:
          "Yes. Site nurses can support heat stress awareness, hydration checks and monitoring during hot months, working with your HSE team.",
      },
      {
        question: "Do you provide ambulances or doctors?",
        answer:
          "No. BHSK supplies nursing staff. Ambulance services and doctors must be arranged separately.",
      },
      {
        question: "Can nurses keep records for our HSE reporting?",
        answer:
          "Yes. Nurses keep health and incident records in line with your site procedures.",
      },
      {
        question: "How many nurses do we need?",
        answer:
          "It depends on workforce size, site layout, working hours and risk level. Share your details and our team can discuss the options with you.",
      },
    ],
    relatedSlugs: ["hospitals", "medical-centres", "schools-nurseries"],
  },
  {
    slug: "maternity-newborn",
    category: "home",
    visible: true,
    name: "Maternity and Newborn Care",
    menuLabel: "Mother & Baby Care",
    icon: "hand-heart",
    text: "Gentle, expert nursing support for mothers and newborns through the early weeks at home.",
    cardImageUrl: "/images/bhsk/maternity-newborn.jpg",
    imageUrl: "/images/bhsk/services/maternity-newborn.jpg",
    imageAlt: "BHSK nurse supporting a mother and her newborn baby at home",
    eyebrow: "Maternity & newborn · Qatar",
    h1: "Maternity and Newborn Care at Home in Qatar",
    intro: [
      "The first weeks after birth bring questions about feeding, sleep, recovery and caring for a newborn. BHSK for Health Services arranges trained nurses who support mothers in Qatar through their recovery and help care for the baby at home — so parents can rest, learn and enjoy these early days.",
      "Tell us your due date or your baby’s age, the support you would like and your preferred hours, and our team will check suitability and availability.",
    ],
    heroCtaLabel: "Request a Nurse",
    seoTitle: "Maternity and Newborn Care at Home in Qatar | BHSK",
    seoDescription:
      "Postnatal nursing support at home in Qatar for mothers and newborns — recovery, feeding guidance and newborn care. Contact BHSK to plan support before or after the birth.",
    audience: {
      heading: "Who maternity and newborn care is for",
      items: [
        "Mothers coming home after a normal or caesarean delivery",
        "First-time parents who want hands-on guidance with newborn care",
        "Families with twins or multiple babies who need an extra pair of trained hands",
        "Mothers who would like support with breastfeeding positioning and feeding routines",
        "Families planning help in advance of the due date",
      ],
    },
    scopeHeading: "What postnatal and newborn support covers",
    scope: {
      scopeNote:
        "Maternity and newborn support stays within the nursing role confirmed for each family. Duties, shift length and clinical limits are agreed after assessment, and the BHSK service lead reviews the plan before a nurse is proposed.",
      included: [
        "Check-ins on the mother’s comfort, rest and recovery as agreed in the care plan",
        "Care of a caesarean or perineal wound dressing within the nurse’s approved role",
        "Guidance on breastfeeding positioning, latching and bottle-feeding routines",
        "Newborn bathing, umbilical cord care, nappy changes and safe sleep practices",
        "Observing feeding, weight and signs such as jaundice, with advice to consult your doctor if concerns arise",
        "Day or night shifts so parents can rest, when agreed in the plan",
        "Short notes for the family on feeds, sleep and anything observed during the shift",
      ],
      notIncluded: [
        "Delivery, care during labour or antenatal clinical monitoring",
        "Diagnosis or treatment of mother or baby — medical concerns are referred to your doctor or hospital",
        "Prescribing medicines or giving vaccinations",
        "Neonatal intensive care for premature or unwell babies at home",
        "General housekeeping, cooking or cleaning unrelated to care",
        "Any shift pattern not confirmed in writing by BHSK",
      ],
    },
    coverage: {
      heading: "Planning postnatal support in Qatar",
      paragraphs: [
        "Many families contact us during pregnancy so support can be planned for the day they come home from hospital. You are also welcome to enquire after the birth.",
        "What we can arrange depends on the pattern you need (day, night or longer shifts), your location in Qatar and which nurses are available at the time. We confirm the details before anything is booked.",
        "If your baby arrives earlier or later than expected, let us know as soon as you can so the team can review the plan with you.",
      ],
    },
    process: {
      heading: "How to arrange maternity and newborn support",
      intro:
        "From your first message to the nurse’s first shift, this is how BHSK plans postnatal care.",
      whoContacts:
        "A BHSK coordinator contacts the mother or the family member named on the enquiry to talk through the birth plan, feeding plans and home arrangements.",
      steps: [
        {
          title: "Enquiry",
          text: "Share the due date or baby’s age, delivery type if known, feeding plans and the hours you would like support.",
        },
        {
          title: "Assessment",
          text: "We discuss the mother’s recovery needs, the newborn’s routine and your home setting to agree a suitable plan.",
        },
        {
          title: "Matching",
          text: "We propose a nurse with experience in postnatal and newborn care and explain how the shifts will work.",
        },
        {
          title: "Confirmation",
          text: "Support begins once BHSK confirms dates, hours and duties with you. Sending an enquiry does not reserve a nurse.",
        },
      ],
    },
    trust: {
      heading: "Caring for mothers and babies responsibly",
      paragraphs: [
        "Newborn care is built on trust. We describe only what BHSK can arrange, and we do not publish ratings or testimonials we cannot verify.",
        "Before a nurse is proposed, BHSK checks her experience with postnatal and newborn care. Qualification and identity details relevant to your family are shared during confirmation.",
      ],
      facts: [
        "A nurse is proposed only after BHSK reviews the family’s needs",
        "Experience with newborn and postnatal care is checked during matching",
        "Any concern about mother or baby is raised with the family straight away",
        "No unverified reviews or ratings are used on this page",
      ],
    },
    faqHeading: "Questions about maternity and newborn care",
    faqs: [
      {
        question: "Can we arrange support before the baby is born?",
        answer:
          "Yes. Many families enquire in the last weeks of pregnancy. Share the expected due date and the support you want, and the team will discuss options. Dates are confirmed only after assessment.",
      },
      {
        question: "Do you provide night-time newborn care?",
        answer:
          "Night shifts can be discussed so parents can rest. Whether a night nurse is available depends on your dates and location, and is confirmed before care begins.",
      },
      {
        question: "Can the nurse help me recover after a caesarean?",
        answer:
          "Yes, within her approved role — for example comfort, safe movement and the dressing care agreed in your plan. Medical follow-up remains with your doctor.",
      },
      {
        question: "Will the nurse help with breastfeeding?",
        answer:
          "Guidance on positioning, latching and feeding routines is part of typical support. Ongoing feeding difficulties are referred to your doctor or a lactation specialist.",
      },
      {
        question: "What happens if the baby seems unwell?",
        answer:
          "The nurse will tell you what she has observed and advise you to contact your doctor or hospital. In an emergency, call 999. BHSK nurses support — but do not replace — medical care.",
      },
    ],
    relatedSlugs: ["baby-care", "home-nursing", "post-operative"],
  },
  {
    slug: "elderly-care",
    category: "home",
    visible: true,
    name: "Elderly Care",
    menuLabel: "Elder Care",
    icon: "armchair",
    text: "Respectful companionship and clinical nursing support that helps seniors stay comfortable at home.",
    cardImageUrl: "/images/bhsk/elderly-care.jpg",
    imageUrl: "/images/bhsk/services/elderly-care.jpg",
    imageAlt: "BHSK nurse caring for an elderly woman at home in Qatar",
    eyebrow: "Elderly care · Qatar",
    h1: "Elderly Care at Home in Qatar",
    intro: [
      "As parents and grandparents grow older, everyday tasks can become harder and families worry about their safety at home. BHSK arranges trained nurses who help elderly people in Qatar stay comfortable, safe and connected in the home they know.",
      "Care is planned around the person’s routine, health needs and your family’s preferences — from a few hours a day to longer shifts.",
    ],
    heroCtaLabel: "Request a Nurse",
    seoTitle: "Elderly Care at Home in Qatar | BHSK for Health Services",
    seoDescription:
      "Respectful elderly care at home in Qatar — help with daily living, mobility, medication reminders and companionship from trained nurses. Contact BHSK to discuss care.",
    audience: {
      heading: "Who elderly care is for",
      items: [
        "Older adults who need help with bathing, dressing or moving around the home",
        "People living with memory changes who need supervision and reassurance",
        "Seniors at risk of falls, or recovering from a recent fall",
        "Working families who want a trained nurse present during the day",
        "Elderly relatives who need regular health checks and medication reminders",
      ],
    },
    scopeHeading: "How we support older people at home",
    scope: {
      scopeNote:
        "Every elderly care plan is personal. The tasks listed are typical of what families discuss with us; final duties and hours are confirmed after assessment and reviewed by the BHSK service lead.",
      included: [
        "Help with personal care — bathing, dressing, grooming and toileting — with dignity and privacy",
        "Safe mobility and transfers, including wheelchair and walking-aid assistance",
        "Medication reminders and support within the nurse’s approved role",
        "Regular checks such as blood pressure, temperature and blood sugar, where agreed",
        "Spotting fall risks around the home and advising the family",
        "Companionship, conversation and gentle encouragement to stay active",
        "Updates to the family on wellbeing and any changes noticed",
      ],
      notIncluded: [
        "Medical diagnosis or changes to prescribed treatment",
        "Emergency or hospital-level care at home",
        "Heavy housework, cooking for the whole household or driving",
        "Any practice that compromises the person’s dignity or freedom",
        "Duties outside the confirmed care plan",
        "A guaranteed start date before assessment",
      ],
    },
    coverage: {
      heading: "Planning elderly care around your family",
      paragraphs: [
        "Families can discuss a few hours of care, a full day shift, a night shift or longer-term support, subject to availability.",
        "When you enquire, tell us about your relative’s daily routine, mobility, health conditions and any language or cultural preferences. This helps us check whether a suitable nurse can be matched in your area of Qatar.",
        "Care needs often change over time. The plan can be reviewed with the BHSK team as your relative’s needs evolve.",
      ],
    },
    process: {
      heading: "How elderly care is arranged",
      intro:
        "A clear, step-by-step process so families know what happens after they ask for help.",
      whoContacts:
        "A BHSK coordinator speaks with the family member responsible for care decisions and, where appropriate, with the older person themselves.",
      steps: [
        {
          title: "Enquiry",
          text: "Tell us who needs care, their main difficulties, any health conditions and the hours you have in mind.",
        },
        {
          title: "Assessment",
          text: "We talk through mobility, personal care, memory, medicines and the home layout to understand the support needed.",
        },
        {
          title: "Matching",
          text: "We propose a nurse whose experience suits your relative and, where possible, your language and cultural preferences.",
        },
        {
          title: "Confirmation",
          text: "Care starts after BHSK confirms the schedule and duties with the family. Until then, your enquiry is a request for review.",
        },
      ],
    },
    trust: {
      heading: "Dignity and safety for older people",
      paragraphs: [
        "Older people deserve patient, respectful care. We do not use stock testimonials or claims we cannot support.",
        "BHSK checks each nurse’s experience with elderly care before proposing them. Relevant qualification and identity details are shared with the family as part of confirmation.",
      ],
      facts: [
        "Care plans are agreed with the family before the first visit",
        "Nurses are matched to the person’s mobility and care needs",
        "Changes in health or behaviour are reported to the family promptly",
        "Privacy and dignity guide every personal care task",
      ],
    },
    faqHeading: "Questions about elderly care",
    faqs: [
      {
        question: "Can we arrange care for only a few hours a day?",
        answer:
          "Yes, shorter daily shifts can be discussed. Minimum hours and availability depend on the schedule and your location, and are confirmed during assessment.",
      },
      {
        question: "Can the nurse stay overnight?",
        answer:
          "Night shifts and longer arrangements can be discussed. We will confirm whether suitable staff are available for the pattern you need.",
      },
      {
        question: "My father has dementia. Can you help?",
        answer:
          "Nurses can provide supervision, reassurance and help with daily routines for people with memory changes. Share details of the diagnosis and any behaviours so we can check fit. Medical management stays with the treating doctor.",
      },
      {
        question: "Can we request a nurse who speaks Arabic?",
        answer:
          "You can state a language preference in your enquiry. We will tell you honestly whether a suitable nurse is available — we cannot guarantee a specific language.",
      },
      {
        question: "What if my relative’s needs increase?",
        answer:
          "Let the team know. The care plan can be reviewed and, where needed, adjusted or combined with other BHSK services such as chronic, post-operative or palliative care.",
      },
    ],
    relatedSlugs: [
      "home-nursing",
      "chronic-care",
      "physiotherapy",
      "palliative-care",
    ],
  },
  {
    slug: "baby-care",
    category: "home",
    visible: true,
    name: "Baby Care",
    menuLabel: "Baby Care",
    icon: "baby",
    text: "Attentive infant care from trained nurses who understand every stage of early life.",
    cardImageUrl: "/images/bhsk/baby-care.jpg",
    imageUrl: "/images/bhsk/services/baby-care.jpg",
    imageAlt: "BHSK nurse caring for a baby at home",
    eyebrow: "Baby care · Qatar",
    h1: "Baby Care at Home in Qatar",
    intro: [
      "Beyond the newborn weeks, babies still need attentive care — regular feeds, careful hygiene, sleep routines and someone who notices when something isn’t right. BHSK arranges nurses in Qatar who care for babies and infants at home with a trained, clinical eye.",
      "Baby care can support working parents, families with an unwell or recovering infant, or parents who simply prefer a nurse rather than an untrained sitter.",
    ],
    heroCtaLabel: "Request a Nurse",
    seoTitle: "Baby and Infant Care at Home in Qatar | BHSK",
    seoDescription:
      "Trained nurses for baby and infant care at home in Qatar — feeding, hygiene, sleep routines and health observation. Contact BHSK to discuss your baby’s needs.",
    audience: {
      heading: "Who baby care is for",
      items: [
        "Parents returning to work who want a trained nurse with their baby",
        "Infants recovering from an illness or a hospital stay",
        "Babies with feeding difficulties, reflux or allergies that need careful routines",
        "Families with twins or several young children",
        "Parents who need support while the mother is unwell or recovering",
      ],
    },
    scopeHeading: "What baby care includes",
    scope: {
      scopeNote:
        "Baby care follows the parents’ instructions and the nurse’s approved role. The final list of tasks, hours and any medical instructions are agreed after assessment.",
      included: [
        "Feeding with breast milk, formula or age-appropriate foods as guided by the parents",
        "Bathing, nappy care and skin care",
        "Settling and sleep routines agreed with the parents",
        "Observing temperature, feeding and general wellbeing, with prompt updates to parents",
        "Giving prescribed medicines as instructed by the parents and doctor, within the nurse’s role",
        "Cleaning and sterilising bottles and feeding equipment",
        "Age-appropriate play and stimulation",
      ],
      notIncluded: [
        "Diagnosis or treatment of illness — medical concerns are referred to your paediatrician",
        "Vaccinations or prescribing",
        "Care of other household members who are not part of the plan",
        "Household cleaning, cooking or laundry for the whole family",
        "Overnight or live-in arrangements not confirmed by BHSK",
        "Taking the baby out of the home without the parents’ agreement",
      ],
    },
    coverage: {
      heading: "Arranging baby care in Qatar",
      paragraphs: [
        "Baby care can be discussed for daytime, evening or night hours, depending on availability.",
        "Tell us your baby’s age, routine, any health conditions or medicines, and where you live in Qatar. The BHSK team checks whether a nurse with suitable infant experience can be matched.",
        "As your baby grows and routines change, the plan can be reviewed with our team.",
      ],
    },
    process: {
      heading: "How to request a baby care nurse",
      intro: "What happens after you ask BHSK for help with your baby.",
      whoContacts:
        "A BHSK coordinator contacts the parent named on the enquiry to discuss the baby’s routine and any special instructions.",
      steps: [
        {
          title: "Enquiry",
          text: "Share your baby’s age, daily routine, feeding method, any health notes and the hours you need.",
        },
        {
          title: "Assessment",
          text: "We talk through your baby’s needs, your home and what you expect from the nurse day to day.",
        },
        {
          title: "Matching",
          text: "Where available, we propose a nurse experienced in caring for babies of your child’s age.",
        },
        {
          title: "Confirmation",
          text: "Care begins once BHSK confirms the schedule and instructions with you. Your enquiry does not hold a booking.",
        },
      ],
    },
    trust: {
      heading: "Safe hands for your baby",
      paragraphs: [
        "Parents need to trust the person caring for their child. We explain what BHSK can arrange and avoid claims we cannot support.",
        "Each nurse’s experience with infants is checked before being proposed. Qualification and identity details are shared with parents during confirmation — ask the team if you would like an introduction before care begins.",
      ],
      facts: [
        "Parents’ routines and instructions guide daily care",
        "Infant experience is checked during matching",
        "Any sign of illness is reported to parents immediately",
        "Medicines are given only as instructed by parents and the doctor",
      ],
    },
    faqHeading: "Questions about baby care",
    faqs: [
      {
        question: "How is baby care different from maternity and newborn care?",
        answer:
          "Maternity and newborn care focuses on the first weeks after birth and includes support for the mother’s recovery. Baby care focuses on the infant — daily routine, feeding, hygiene and wellbeing — beyond those first weeks.",
      },
      {
        question: "Can a nurse look after my baby while I work?",
        answer:
          "Yes, daytime support for working parents can be discussed. Hours and availability are confirmed after assessment.",
      },
      {
        question: "Can the nurse give my baby medicine?",
        answer:
          "The nurse can give medicines prescribed by your doctor and instructed by you, within her approved role. She will not change doses or give unprescribed medicines.",
      },
      {
        question: "My baby has reflux or allergies. Can you help?",
        answer:
          "Share the details when you enquire. Nurses can follow feeding and care routines set by your paediatrician; medical management remains with your doctor.",
      },
      {
        question: "What if my baby becomes unwell during a shift?",
        answer:
          "The nurse informs you straight away and advises contacting your doctor. In an emergency, Qatar’s emergency number 999 should be called and the family informed immediately.",
      },
    ],
    relatedSlugs: ["maternity-newborn", "home-nursing", "chronic-care"],
  },
  {
    slug: "palliative-care",
    category: "home",
    visible: true,
    name: "Palliative Care",
    menuLabel: "Palliative Care",
    icon: "message-circle-heart",
    text: "Compassionate symptom relief and dignity-focused nursing support for serious illness.",
    cardImageUrl: "/images/bhsk/palliative-care.jpg",
    imageUrl: "/images/bhsk/services/palliative-care.jpg",
    imageAlt: "BHSK nurse at the bedside of a patient with family at home",
    eyebrow: "Palliative care · Qatar",
    h1: "Palliative Care at Home in Qatar",
    intro: [
      "When someone is living with a serious or life-limiting illness, many families wish to care for them at home, surrounded by the people they love. BHSK arranges nurses in Qatar who provide comfort-focused care, follow the patient’s medical plan and support families through a difficult time.",
      "We understand how sensitive these conversations are. Contact us whenever you are ready, and our team will listen and explain what can be arranged.",
    ],
    heroCtaLabel: "Request a Nurse",
    seoTitle: "Palliative Nursing Care at Home in Qatar | BHSK",
    seoDescription:
      "Compassionate palliative nursing at home in Qatar — comfort care, symptom observation and family support for people living with serious illness. Contact BHSK.",
    audience: {
      heading: "Who palliative care is for",
      items: [
        "People with advanced cancer, heart, lung, kidney or neurological conditions",
        "Patients leaving hospital who wish to be cared for at home",
        "Families who need help with comfort and personal care for a loved one",
        "Family carers who need rest while a trained nurse stays with the patient",
        "Patients whose doctors have recommended comfort-focused care",
      ],
    },
    scopeHeading: "Comfort-focused care at home",
    scope: {
      scopeNote:
        "Palliative nursing supports comfort and dignity alongside the patient’s medical team. Duties, hours and any medication responsibilities are agreed after assessment and reviewed by the BHSK service lead.",
      included: [
        "Comfort care — repositioning, mouth care, skin care and pressure-area care",
        "Observing pain, breathing and other symptoms, and reporting them to the family and treating doctor",
        "Giving prescribed medicines within the nurse’s approved role and the doctor’s instructions",
        "Help with personal hygiene, eating and toileting with dignity",
        "Emotional support and companionship for the patient",
        "Practical guidance for family members caring alongside the nurse",
        "Clear shift notes so the family and doctors know how the patient has been",
      ],
      notIncluded: [
        "Prescribing or changing pain relief — this remains with the treating doctor",
        "Decisions about resuscitation or end-of-life treatment, which rest with the medical team and family",
        "Hospital or hospice equipment unless arranged separately",
        "Religious or legal decisions on behalf of the family",
        "Tasks outside the confirmed care plan",
        "Guaranteed availability before assessment",
      ],
    },
    coverage: {
      heading: "Palliative support at home in Qatar",
      paragraphs: [
        "Palliative care needs can change quickly. Tell us about the current situation, the medical team involved and the support you need, and our team will review your request as a priority conversation.",
        "Arrangements may include day shifts, night shifts or longer support, depending on availability and the patient’s needs. We confirm what BHSK can provide before care starts.",
        "If the patient’s condition changes, contact the team and we will review the plan with you.",
      ],
    },
    process: {
      heading: "How palliative care at home is arranged",
      intro:
        "We keep the process simple and considerate so families can focus on their loved one.",
      whoContacts:
        "A BHSK coordinator contacts the family member who made the enquiry — gently, and at a time that suits the family.",
      steps: [
        {
          title: "Enquiry",
          text: "Call, WhatsApp or use Request a Nurse to tell us about the patient’s condition, current treatment and the help you need.",
        },
        {
          title: "Assessment",
          text: "We talk with the family and review the treating team’s instructions to understand comfort needs, medicines and the home setting.",
        },
        {
          title: "Matching",
          text: "We propose a nurse experienced in comfort care who can work sensitively with the patient and family.",
        },
        {
          title: "Confirmation",
          text: "Care begins after BHSK confirms the plan, hours and duties with you. An enquiry on its own is not a booking.",
        },
      ],
    },
    trust: {
      heading: "Compassion, honesty and respect",
      paragraphs: [
        "Families facing serious illness deserve honesty. We describe only what BHSK can arrange and never make promises about outcomes.",
        "Nurses proposed for palliative care are checked for relevant experience. Qualification and identity details are shared with the family as part of confirmation.",
      ],
      facts: [
        "Care works alongside the patient’s doctors, not in place of them",
        "Comfort, dignity and the family’s wishes guide daily care",
        "Changes in symptoms are reported promptly to the family",
        "Cultural and religious preferences are respected in daily care",
      ],
    },
    faqHeading: "Questions about palliative care",
    faqs: [
      {
        question: "What is palliative care?",
        answer:
          "Palliative care focuses on comfort and quality of life for someone with a serious illness. It can be given alongside medical treatment and is not only for the last days of life.",
      },
      {
        question: "Can the nurse manage pain medicine?",
        answer:
          "The nurse can give medicines prescribed by the doctor, within her approved role, and report how the patient is responding. Any change to pain relief is decided by the doctor.",
      },
      {
        question: "Can a nurse stay with the patient at night?",
        answer:
          "Night shifts can be discussed so the family can rest. Availability is confirmed during assessment.",
      },
      {
        question: "Do you work with the hospital’s care team?",
        answer:
          "The nurse follows the care instructions given by the patient’s medical team, shared through the family. BHSK does not replace hospital or hospice care.",
      },
      {
        question: "How soon can care start?",
        answer:
          "We understand the urgency. Timing depends on clinical fit and staff availability, and the team will tell you honestly what is possible after reviewing your request.",
      },
    ],
    relatedSlugs: ["home-nursing", "chronic-care", "elderly-care"],
  },
  {
    slug: "chronic-care",
    category: "home",
    visible: true,
    name: "Chronic Patient Care",
    menuLabel: "Chronic Care",
    icon: "calendar-heart",
    text: "Ongoing nursing plans for long-term conditions, monitoring and daily management at home.",
    cardImageUrl: "/images/bhsk/chronic-care.jpg",
    imageUrl: "/images/bhsk/services/chronic-care.jpg",
    imageAlt: "BHSK nurse checking a patient’s health readings at home",
    eyebrow: "Chronic patient care · Qatar",
    h1: "Chronic Patient Care at Home in Qatar",
    intro: [
      "Long-term conditions such as diabetes, high blood pressure, heart disease, kidney disease or the effects of a stroke need steady, day-to-day management. BHSK arranges nurses in Qatar who help patients follow their doctor’s plan at home, keep track of their health and stay as independent as possible.",
      "Support can be regular visits or longer shifts, planned around the patient’s routine and medical appointments.",
    ],
    heroCtaLabel: "Request a Nurse",
    seoTitle: "Chronic Condition Nursing Care at Home in Qatar | BHSK",
    seoDescription:
      "Ongoing nursing at home in Qatar for diabetes, heart conditions, stroke recovery and other long-term illnesses — monitoring, medication support and daily routines. Contact BHSK.",
    audience: {
      heading: "Who chronic patient care is for",
      items: [
        "Patients with diabetes who need help with blood sugar checks and insulin routines",
        "People with heart or blood pressure conditions who need regular monitoring",
        "Stroke survivors who need support with daily activities",
        "Patients with long-term lung, kidney or neurological conditions",
        "Families who want a nurse to help a relative follow the doctor’s treatment plan",
      ],
    },
    scopeHeading: "Managing long-term conditions at home",
    scope: {
      scopeNote:
        "Chronic care follows the treating doctor’s instructions. The monitoring, medicines and procedures the nurse will handle are agreed after assessment and checked by the BHSK service lead.",
      included: [
        "Regular monitoring such as blood pressure, pulse, blood sugar and oxygen levels, recorded for the family and doctor",
        "Insulin and medication support as prescribed, within the nurse’s approved role",
        "Help organising medicines and keeping to treatment schedules",
        "Care of feeding tubes, urinary catheters or tracheostomies where agreed and within the nurse’s competence",
        "Support with the diet, fluid and activity routines advised by the doctor",
        "Keeping readings and notes ready for medical appointments",
        "Early reporting of warning signs to the family",
      ],
      notIncluded: [
        "Diagnosing conditions or changing prescribed treatment",
        "Dialysis or other hospital-level treatments at home",
        "Laboratory testing services",
        "Emergency care — in an emergency, call 999",
        "Duties outside the confirmed care plan",
        "A fixed schedule before assessment and matching",
      ],
    },
    coverage: {
      heading: "Long-term support in Qatar",
      paragraphs: [
        "Chronic care is usually an ongoing arrangement. Families can discuss daily visits, regular shifts or longer support, depending on availability.",
        "Share the diagnosis, current medicines and any equipment in use when you enquire. This helps the team check whether a suitably experienced nurse can be matched in your area.",
        "The plan can be reviewed whenever the doctor changes treatment or the patient’s needs change.",
      ],
    },
    process: {
      heading: "How chronic patient care is arranged",
      intro: "A practical process built for long-term care.",
      whoContacts:
        "A BHSK coordinator contacts the patient or family member named on the enquiry and may ask for the latest medical instructions.",
      steps: [
        {
          title: "Enquiry",
          text: "Tell us the condition, current medicines, any equipment and the support the patient needs day to day.",
        },
        {
          title: "Assessment",
          text: "We review the doctor’s treatment plan, monitoring needs and the home setting with the family.",
        },
        {
          title: "Matching",
          text: "We propose a nurse experienced with the condition and procedures involved, such as insulin or tube care.",
        },
        {
          title: "Confirmation",
          text: "Care starts once BHSK confirms the schedule and duties. An enquiry is not a confirmed arrangement.",
        },
      ],
    },
    trust: {
      heading: "Consistent, careful long-term care",
      paragraphs: [
        "Long-term care depends on consistency and clear records. We do not publish claims about outcomes or unverified reviews.",
        "BHSK checks each nurse’s experience with the condition and procedures involved before proposing them. Relevant qualification and identity details are shared during confirmation.",
      ],
      facts: [
        "Care follows the treating doctor’s instructions",
        "Readings and observations are recorded for the family and doctor",
        "Nurses are matched to the procedures the patient needs",
        "Warning signs are raised with the family promptly",
      ],
    },
    faqHeading: "Questions about chronic patient care",
    faqs: [
      {
        question: "Can the nurse give insulin injections?",
        answer:
          "Yes, where insulin is prescribed and it is within the nurse’s approved role for the assignment. Doses always follow the doctor’s instructions.",
      },
      {
        question: "Can you help with a feeding tube or catheter?",
        answer:
          "Care of feeding tubes, urinary catheters or tracheostomies can be discussed. We confirm during assessment whether a nurse with the right experience is available.",
      },
      {
        question: "Will the nurse keep records for our doctor?",
        answer:
          "Yes. Nurses record readings and observations so the family can share them with the treating doctor.",
      },
      {
        question: "Is this a short-term or long-term service?",
        answer:
          "Chronic care is usually ongoing, but shorter arrangements — for example after a hospital stay — can also be discussed. The plan is agreed after assessment.",
      },
      {
        question: "Do you provide lab tests at home?",
        answer:
          "No. BHSK does not offer laboratory testing. The nurse can help you follow your doctor’s instructions for tests arranged through your clinic or hospital.",
      },
    ],
    relatedSlugs: [
      "home-nursing",
      "elderly-care",
      "palliative-care",
      "post-operative",
    ],
  },
  {
    slug: "post-operative",
    category: "home",
    visible: true,
    name: "Post-operative Care",
    menuLabel: "Post-operative Care",
    icon: "sunrise",
    text: "Safe recovery support after surgery — wound care, medication and mobility at home.",
    cardImageUrl: "/images/bhsk/post-operative.jpg",
    imageUrl: "/images/bhsk/services/post-operative.jpg",
    imageAlt: "BHSK nurse helping a patient recover after surgery at home",
    eyebrow: "Post-operative care · Qatar",
    h1: "Post-operative Care at Home in Qatar",
    intro: [
      "Recovering from surgery is easier in the comfort of home, but the first days and weeks often need professional support. BHSK arranges nurses in Qatar who help patients recover safely after orthopaedic, abdominal, cardiac or other surgery, following the surgical team’s discharge instructions.",
      "Contact us before the operation or before discharge, and we can plan support for the day the patient comes home.",
    ],
    heroCtaLabel: "Request a Nurse",
    seoTitle: "Post-Surgery Nursing Care at Home in Qatar | BHSK",
    seoDescription:
      "Nursing support at home in Qatar after surgery — wound care, medication, mobility and recovery monitoring. Contact BHSK to plan care before discharge.",
    audience: {
      heading: "Who post-operative care is for",
      items: [
        "Patients returning home after joint replacement or orthopaedic surgery",
        "People recovering from abdominal, cardiac or general surgery",
        "Patients with wounds, drains or dressings that need regular care",
        "Older patients who need extra help moving safely after an operation",
        "Families who want professional support during the first weeks of recovery",
      ],
    },
    scopeHeading: "Recovery support after surgery",
    scope: {
      scopeNote:
        "Post-operative nursing follows the surgical team’s discharge instructions. The exact wound care, medicines and mobility support are agreed after assessment and reviewed by the BHSK service lead.",
      included: [
        "Wound care and dressing changes as instructed by the surgical team",
        "Checking the wound, temperature, pain and vital signs, and reporting concerns promptly",
        "Giving prescribed medicines, including pain relief, within the nurse’s approved role",
        "Safe mobility, transfers and help with walking aids",
        "Help with personal hygiene while movement is limited",
        "Encouraging the exercises and precautions advised by the surgeon or physiotherapist",
        "Care of drains or catheters where agreed and within the nurse’s competence",
      ],
      notIncluded: [
        "Surgical procedures or treatment of complications at home",
        "Changing the surgeon’s instructions or prescribing medicines",
        "Physiotherapy treatment — this can be arranged as a separate BHSK service",
        "Emergency care — contact your hospital or call 999",
        "Duties outside the confirmed plan",
        "A guaranteed start on discharge day without prior confirmation",
      ],
    },
    coverage: {
      heading: "Planning recovery at home in Qatar",
      paragraphs: [
        "The best time to enquire is before surgery or as soon as a discharge date is known. This gives the team time to check availability.",
        "Share the type of surgery, discharge instructions, wound and mobility needs, and your location in Qatar. We confirm what can be arranged before anything is booked.",
        "Most post-operative support is short-term. The plan can be extended or reduced as recovery progresses.",
      ],
    },
    process: {
      heading: "How to arrange care after surgery",
      intro: "Plan ahead so help is ready when the patient comes home.",
      whoContacts:
        "A BHSK coordinator contacts the patient or family member named on the enquiry — often before discharge — to plan the first visit.",
      steps: [
        {
          title: "Enquiry",
          text: "Tell us the type of surgery, the expected discharge date and the support needed at home.",
        },
        {
          title: "Assessment",
          text: "We review the discharge instructions, wound care, medicines and mobility needs with the family.",
        },
        {
          title: "Matching",
          text: "We propose a nurse experienced in post-surgical care and agree visit times or shift hours.",
        },
        {
          title: "Confirmation",
          text: "Care begins once BHSK confirms the plan. Please don’t rely on an enquiry alone as a booking for discharge day.",
        },
      ],
    },
    trust: {
      heading: "Safe recovery, clearly communicated",
      paragraphs: [
        "Recovery goes best when everyone follows the same plan. We don’t make promises about recovery times or outcomes.",
        "BHSK checks each nurse’s experience with post-operative and wound care before proposing them. Relevant qualification and identity details are shared during confirmation.",
      ],
      facts: [
        "Care follows the surgical team’s discharge instructions",
        "Signs of infection or complications are reported promptly",
        "Nurses are matched to the type of surgery and wound care needed",
        "Recovery notes are kept for the family and follow-up appointments",
      ],
    },
    faqHeading: "Questions about post-operative care",
    faqs: [
      {
        question: "When should I contact BHSK about care after surgery?",
        answer:
          "As early as possible — ideally before the operation or once the discharge date is known. This gives the team time to check availability.",
      },
      {
        question: "Can the nurse change my dressings?",
        answer:
          "Yes. Wound care and dressing changes are a typical part of post-operative support, following the instructions from your surgical team.",
      },
      {
        question: "What if I notice signs of infection?",
        answer:
          "The nurse will check the wound and advise you to contact your surgeon or hospital. In an emergency, call 999.",
      },
      {
        question: "Can I get physiotherapy after surgery too?",
        answer:
          "Physiotherapy is a separate BHSK service that can be discussed alongside post-operative nursing. See the physiotherapy page for details.",
      },
      {
        question: "How long will I need a nurse?",
        answer:
          "It depends on the surgery and your recovery. Many arrangements last a few days or weeks; the plan is agreed after assessment and can be adjusted.",
      },
    ],
    relatedSlugs: [
      "physiotherapy",
      "home-nursing",
      "elderly-care",
      "chronic-care",
    ],
  },
  {
    slug: "physiotherapy",
    category: "home",
    visible: true,
    name: "Physiotherapy",
    menuLabel: "Physiotherapy",
    icon: "footprints",
    text: "Personalised rehabilitation to restore strength, movement and independence.",
    cardImageUrl: "/images/bhsk/physiotherapy.jpg",
    imageUrl: "/images/bhsk/services/physiotherapy.jpg",
    imageAlt:
      "BHSK therapist helping a patient walk with a walking frame at home",
    eyebrow: "Physiotherapy · Qatar",
    h1: "Physiotherapy at Home in Qatar",
    intro: [
      "Getting back on your feet after surgery, an injury, a stroke or a long illness takes structured exercise and steady encouragement. BHSK arranges physiotherapy sessions at home in Qatar, so patients can work on strength, balance and movement without travelling to a clinic.",
      "Sessions are planned around the patient’s own goals — whether that is walking safely again, managing stairs or returning to daily activities.",
    ],
    heroCtaLabel: "Request Physiotherapy",
    seoTitle: "Home Physiotherapy in Qatar | BHSK for Health Services",
    seoDescription:
      "Physiotherapy at home in Qatar to rebuild strength, movement and independence after surgery, injury or illness. Contact BHSK to discuss your rehabilitation needs.",
    audience: {
      heading: "Who home physiotherapy is for",
      items: [
        "Patients recovering from joint replacement, fractures or orthopaedic surgery",
        "Stroke survivors working on movement, balance and coordination",
        "Older adults with reduced mobility or a history of falls",
        "People whose back, neck or joint pain is affecting daily life",
        "Patients regaining strength after a hospital stay or long illness",
      ],
    },
    scopeHeading: "What home physiotherapy covers",
    scope: {
      scopeNote:
        "Home physiotherapy is delivered by a qualified physiotherapist within their approved scope. The programme, number of sessions and goals are agreed after the first assessment and follow any instructions from the treating doctor or surgeon.",
      included: [
        "A first assessment of movement, strength, balance and goals",
        "A personalised home exercise programme",
        "Mobility, walking and balance training, including use of walking aids",
        "Strengthening and range-of-motion exercises after surgery or injury",
        "Advice on safe movement, posture and fall prevention at home",
        "Guidance for family members on supporting exercises between sessions",
        "Regular progress reviews shared with the patient and family",
      ],
      notIncluded: [
        "Medical diagnosis, scans or referrals — these stay with your doctor",
        "Supply of specialist equipment unless arranged separately",
        "Treatments that need clinic-based machines",
        "Nursing care — this can be arranged through BHSK’s home nursing services",
        "Sessions outside the agreed programme",
        "Guaranteed recovery outcomes or timelines",
      ],
    },
    coverage: {
      heading: "Home physiotherapy in Qatar",
      paragraphs: [
        "Sessions take place in the patient’s home. How often they happen depends on the rehabilitation plan and the physiotherapist’s availability.",
        "When you enquire, share the reason for physiotherapy, any surgery dates or doctor’s recommendations, and your location in Qatar. The team confirms what can be arranged.",
        "Programmes are reviewed as the patient progresses and can be adjusted along the way.",
      ],
    },
    process: {
      heading: "How to start physiotherapy at home",
      intro: "Four steps from your enquiry to the first session.",
      whoContacts:
        "A BHSK coordinator contacts the patient or family member named on the enquiry to arrange the first assessment.",
      steps: [
        {
          title: "Enquiry",
          text: "Tell us about the condition or surgery, current mobility and what you hope to achieve.",
        },
        {
          title: "Assessment",
          text: "We review the doctor’s recommendations and your home setting, then arrange a first physiotherapy assessment.",
        },
        {
          title: "Matching",
          text: "We propose a physiotherapist with experience relevant to your condition and agree session times.",
        },
        {
          title: "Confirmation",
          text: "Sessions begin once BHSK confirms the programme and schedule. An enquiry does not reserve a session.",
        },
      ],
    },
    trust: {
      heading: "Rehabilitation you can rely on",
      paragraphs: [
        "Recovery takes time and effort. We are clear about what physiotherapy can help with, and we never promise specific results.",
        "BHSK checks each physiotherapist’s qualifications and experience before proposing them. Relevant credential and identity details are shared during confirmation.",
      ],
      facts: [
        "Programmes are based on a first physiotherapy assessment",
        "Exercises respect the doctor’s or surgeon’s precautions",
        "Progress is reviewed and shared with the family",
        "No guaranteed outcomes or recovery timelines are promised",
      ],
    },
    faqHeading: "Questions about home physiotherapy",
    faqs: [
      {
        question: "Do I need a doctor’s referral for home physiotherapy?",
        answer:
          "A referral or doctor’s recommendation is helpful, especially after surgery, so the physiotherapist can follow any precautions. Share what you have when you enquire.",
      },
      {
        question: "How many sessions will I need?",
        answer:
          "It depends on your condition and goals. The physiotherapist suggests a programme after the first assessment, and it is reviewed as you progress.",
      },
      {
        question: "Do I need special equipment at home?",
        answer:
          "Most home sessions need only a safe space and simple aids. The physiotherapist will advise if any equipment would help.",
      },
      {
        question: "Can physiotherapy help after a stroke?",
        answer:
          "Physiotherapy can support movement, balance and daily function after a stroke. Share details of the stroke and current abilities so we can check fit.",
      },
      {
        question: "Is the physiotherapist a nurse?",
        answer:
          "No. Physiotherapy is provided by a qualified physiotherapist. If you also need nursing care, it can be arranged through BHSK’s home nursing services.",
      },
    ],
    relatedSlugs: [
      "post-operative",
      "elderly-care",
      "home-nursing",
      "chronic-care",
    ],
  },
];
