import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TestimonialForm } from "@/components/admin/testimonials/testimonial-form";
import { updateTestimonial } from "@/lib/actions/testimonials";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) notFound();

  return (
    <div>
      <AdminPageHeader title={`Edit ${testimonial.name}`} backHref="/admin/testimonials" />
      <TestimonialForm action={updateTestimonial.bind(null, id)} testimonial={testimonial} />
    </div>
  );
}
