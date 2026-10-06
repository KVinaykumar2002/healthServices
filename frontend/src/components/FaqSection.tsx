import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/lib/motion";
import { faqItems } from "@/lib/site";

export function FaqSection() {
  return (
    <section className="faq-section section" aria-labelledby="faq-heading">
      <div className="container faq-layout">
        <Reveal className="faq-intro" direction="left" distance={48}>
          <div className="eyebrow">QUESTIONS</div>
          <h2 id="faq-heading">Clear answers about BHSK in Qatar</h2>
          <p>Practical information on home care, staffing and how enquiries become confirmed services.</p>
        </Reveal>
        <Reveal delay={0.08} direction="left" distance={40}>
          <Accordion type="single" collapsible className="faq-accordion" defaultValue={faqItems[0]?.id}>
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="faq-item">
                <AccordionTrigger className="faq-trigger">{item.question}</AccordionTrigger>
                <AccordionContent className="faq-answer">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
