export type NavLink = { label: string; href: string };

export type FormFieldConfig = {
  name: string;
  label: string;
  type: "text" | "tel" | "email" | "select" | "textarea";
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  options?: string[];
  rows?: number;
};

export type EnquiryPayload = Record<string, string | boolean> & {
  name: string;
  phone: string;
  email: string;
  consent: boolean;
};

export type EnquiryResponse = {
  ok: boolean;
  message: string;
  /** Present when the Apps Script endpoint has not been configured yet. */
  code?: "not_configured" | "validation" | "upstream" | "server";
};
