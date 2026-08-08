import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TestimonialForm } from "@/components/admin/testimonials/testimonial-form";
import { createTestimonial } from "@/lib/actions/testimonials";

export default function NewTestimonialPage() {
  return (
    <div>
      <AdminPageHeader title="New Testimonial" backHref="/admin/testimonials" />
      <TestimonialForm action={createTestimonial} />
    </div>
  );
}
