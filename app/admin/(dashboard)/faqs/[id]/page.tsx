import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FAQForm } from "@/components/admin/faqs/faq-form";
import { updateFAQ } from "@/lib/actions/faqs";

export default async function EditFAQPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const faq = await prisma.fAQ.findUnique({ where: { id } });
  if (!faq) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit FAQ" backHref="/admin/faqs" />
      <FAQForm action={updateFAQ.bind(null, id)} faq={faq} />
    </div>
  );
}
