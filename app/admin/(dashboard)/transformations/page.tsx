import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ToggleActiveSwitch } from "@/components/admin/toggle-active-switch";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteTransformation, toggleTransformationActive } from "@/lib/actions/transformations";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { parsePage, getPagination } from "@/lib/pagination";
import { PaginationControls } from "@/components/admin/pagination-controls";

export const dynamic = "force-dynamic";

export default async function AdminTransformationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const totalItems = await prisma.transformation.count();
  const { skip, take, currentPage, totalPages } = getPagination(parsePage(pageParam), totalItems);
  const transformations = await prisma.transformation.findMany({ orderBy: { order: "asc" }, skip, take });

  return (
    <div>
      <AdminPageHeader
        title="Transformations"
        description="Manage member before/after stories."
        action={{ href: "/admin/transformations/new", label: "New Story" }}
      />
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Member</TableHead>
              <TableHead>Goal</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transformations.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-foreground/50">
                  No transformation stories yet.
                </TableCell>
              </TableRow>
            )}
            {transformations.map((t) => (
              <TableRow key={t.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/5">
                      <Image src={t.afterImage} alt={t.memberName} fill sizes="40px" className="object-cover" />
                    </span>
                    <p className="font-medium">{t.memberName}</p>
                  </div>
                </TableCell>
                <TableCell className="text-foreground/60">{t.goal}</TableCell>
                <TableCell className="text-foreground/60">{t.duration}</TableCell>
                <TableCell>
                  <ToggleActiveSwitch id={t.id} isActive={t.isActive} onToggle={toggleTransformationActive} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" nativeButton={false} render={<Link href={`/admin/transformations/${t.id}`} />}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <ConfirmDeleteButton itemLabel={t.memberName} onDelete={deleteTransformation.bind(null, t.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <PaginationControls
        basePath="/admin/transformations"
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={take}
      />
    </div>
  );
}
