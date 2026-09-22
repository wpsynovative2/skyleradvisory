"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type EnquiryModalContextValue = {
  isOpen: boolean;
  source: string;
  open: (source?: string) => void;
  close: () => void;
};

const EnquiryModalContext = createContext<EnquiryModalContextValue | null>(null);

export function EnquiryModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState("Enquire Now");

  const open = useCallback((from = "Enquire Now") => {
    setSource(from);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ isOpen, source, open, close }), [isOpen, source, open, close]);

  return <EnquiryModalContext.Provider value={value}>{children}</EnquiryModalContext.Provider>;
}

export function useEnquiryModal() {
  const ctx = useContext(EnquiryModalContext);
  if (!ctx) throw new Error("useEnquiryModal must be used inside <EnquiryModalProvider>");
  return ctx;
}
