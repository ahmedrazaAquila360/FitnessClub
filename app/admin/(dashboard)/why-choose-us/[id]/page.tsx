import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { WhyChooseUsForm } from "@/components/admin/why-choose-us/why-choose-us-form";
import { updateWhyChooseUsItem } from "@/lib/actions/why-choose-us";

export default async function EditWhyChooseUsItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.whyChooseUsItem.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Item" backHref="/admin/why-choose-us" />
      <WhyChooseUsForm action={updateWhyChooseUsItem.bind(null, id)} item={item} />
    </div>
  );
}
