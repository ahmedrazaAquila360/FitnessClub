import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ToggleActiveSwitch } from "@/components/admin/toggle-active-switch";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteFacility, toggleFacilityActive } from "@/lib/actions/facilities";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { parsePage, getPagination } from "@/lib/pagination";
import { PaginationControls } from "@/components/admin/pagination-controls";

export const dynamic = "force-dynamic";

export default async function AdminFacilitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const totalItems = await prisma.facility.count();
  const { skip, take, currentPage, totalPages } = getPagination(parsePage(pageParam), totalItems);
  const facilities = await prisma.facility.findMany({ orderBy: { order: "asc" }, skip, take });

  return (
    <div>
      <AdminPageHeader
        title="Facilities"
        description="Manage the spaces and amenities shown on your website."
        action={{ href: "/admin/facilities/new", label: "New Facility" }}
      />
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Facility</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {facilities.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="py-10 text-center text-foreground/50">
                  No facilities yet.
                </TableCell>
              </TableRow>
            )}
            {facilities.map((facility) => (
              <TableRow key={facility.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-white/5">
                      <Image src={facility.image} alt={facility.name} fill sizes="56px" className="object-cover" />
                    </span>
                    <div>
                      <p className="font-medium">{facility.name}</p>
                      <p className="max-w-sm truncate text-xs text-foreground/45">{facility.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <ToggleActiveSwitch id={facility.id} isActive={facility.isActive} onToggle={toggleFacilityActive} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" nativeButton={false} render={<Link href={`/admin/facilities/${facility.id}`} />}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <ConfirmDeleteButton itemLabel={facility.name} onDelete={deleteFacility.bind(null, facility.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <PaginationControls
        basePath="/admin/facilities"
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={take}
      />
    </div>
  );
}
