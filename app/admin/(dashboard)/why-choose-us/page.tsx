import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ToggleActiveSwitch } from "@/components/admin/toggle-active-switch";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteWhyChooseUsItem, toggleWhyChooseUsItemActive } from "@/lib/actions/why-choose-us";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { parsePage, getPagination } from "@/lib/pagination";
import { PaginationControls } from "@/components/admin/pagination-controls";

export const dynamic = "force-dynamic";

export default async function AdminWhyChooseUsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const totalItems = await prisma.whyChooseUsItem.count();
  const { skip, take, currentPage, totalPages } = getPagination(parsePage(pageParam), totalItems);
  const items = await prisma.whyChooseUsItem.findMany({ orderBy: { order: "asc" }, skip, take });

  return (
    <div>
      <AdminPageHeader
        title="Why Choose Us"
        description="Manage the reasons visitors should choose your gym."
        action={{ href: "/admin/why-choose-us/new", label: "New Item" }}
      />
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-foreground/50">
                  No items yet.
                </TableCell>
              </TableRow>
            )}
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="max-w-sm truncate text-foreground/60">{item.description}</TableCell>
                <TableCell>
                  <ToggleActiveSwitch id={item.id} isActive={item.isActive} onToggle={toggleWhyChooseUsItemActive} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" nativeButton={false} render={<Link href={`/admin/why-choose-us/${item.id}`} />}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <ConfirmDeleteButton itemLabel={item.title} onDelete={deleteWhyChooseUsItem.bind(null, item.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <PaginationControls
        basePath="/admin/why-choose-us"
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={take}
      />
    </div>
  );
}
