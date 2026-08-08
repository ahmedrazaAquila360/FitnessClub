import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ToggleActiveSwitch } from "@/components/admin/toggle-active-switch";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteMembershipPlan, duplicateMembershipPlan, toggleMembershipPlanActive } from "@/lib/actions/memberships";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Copy, Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminMembershipsPage() {
  const plans = await prisma.membershipPlan.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <AdminPageHeader
        title="Membership Plans"
        description="Control pricing, features and ordering for every plan."
        action={{ href: "/admin/memberships/new", label: "New Plan" }}
      />

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Plan</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-foreground/50">
                  No membership plans yet.
                </TableCell>
              </TableRow>
            )}
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>
                  <p className="font-medium">{plan.name}</p>
                  <p className="text-xs text-foreground/45">{plan.billingPeriod}</p>
                </TableCell>
                <TableCell className="text-foreground/70">{formatCurrency(plan.price.toString())}</TableCell>
                <TableCell>{plan.isFeatured && <Badge className="bg-brand text-black">{plan.badge || "Featured"}</Badge>}</TableCell>
                <TableCell>
                  <ToggleActiveSwitch id={plan.id} isActive={plan.isActive} onToggle={toggleMembershipPlanActive} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" nativeButton={false} render={<Link href={`/admin/memberships/${plan.id}`} />}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <form action={async () => { "use server"; await duplicateMembershipPlan(plan.id); }}>
                      <Button variant="ghost" size="icon" type="submit">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </form>
                    <ConfirmDeleteButton itemLabel={plan.name} onDelete={deleteMembershipPlan.bind(null, plan.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
