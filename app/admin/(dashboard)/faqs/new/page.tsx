import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FAQForm } from "@/components/admin/faqs/faq-form";
import { createFAQ } from "@/lib/actions/faqs";

export default function NewFAQPage() {
  return (
    <div>
      <AdminPageHeader title="New FAQ" backHref="/admin/faqs" />
      <FAQForm action={createFAQ} />
    </div>
  );
}
