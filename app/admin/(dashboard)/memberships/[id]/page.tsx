import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MembershipForm } from "@/components/admin/memberships/membership-form";
import { updateMembershipPlan } from "@/lib/actions/memberships";

export default async function EditMembershipPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan = await prisma.membershipPlan.findUnique({ where: { id } });
  if (!plan) notFound();

  return (
    <div>
      <AdminPageHeader title={`Edit ${plan.name}`} backHref="/admin/memberships" />
      <MembershipForm action={updateMembershipPlan.bind(null, id)} plan={plan} />
    </div>
  );
}
