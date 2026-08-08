import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MembershipForm } from "@/components/admin/memberships/membership-form";
import { createMembershipPlan } from "@/lib/actions/memberships";

export default function NewMembershipPlanPage() {
  return (
    <div>
      <AdminPageHeader title="New Membership Plan" backHref="/admin/memberships" />
      <MembershipForm action={createMembershipPlan} />
    </div>
  );
}
