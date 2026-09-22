"use client";

import contact from "@/data/contact.json";
import Modal from "@/components/ui/Modal";
import { useEnquiryModal } from "@/components/ui/EnquiryModalProvider";
import EnquiryForm from "./EnquiryForm";

/** The global "Enquire Now" popup, opened from any CTA on the page. */
export default function EnquiryModal() {
  const { isOpen, close, source } = useEnquiryModal();

  return (
    <Modal open={isOpen} onClose={close} title={contact.formTitle} size="lg">
      <div className="max-h-[85vh] overflow-y-auto px-6 py-8 sm:px-9">
        <p className="font-label text-[13px] font-semibold uppercase tracking-[0.18em] text-orange">
          {contact.heading.prefix} {contact.heading.typed} {contact.heading.suffix}
        </p>
        <h2 className="mt-3 font-display text-[24px] font-semibold text-navy sm:text-[30px]">
          {contact.formTitle}
        </h2>
        <p className="mt-2.5 font-sans text-[14px] leading-relaxed text-body">
          {contact.description}
        </p>

        <div className="mt-7">
          <EnquiryForm source={source} />
        </div>
      </div>
    </Modal>
  );
}
