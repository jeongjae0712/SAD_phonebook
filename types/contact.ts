export type Contact = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  memo: string | null;
  created_at: string;
  updated_at: string;
};

export type ContactFormData = {
  name: string;
  phone: string;
  email: string;
  memo: string;
};
