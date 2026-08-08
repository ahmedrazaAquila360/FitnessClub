import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ToggleActiveSwitch } from "@/components/admin/toggle-active-switch";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteProgram, duplicateProgram, toggleProgramActive } from "@/lib/actions/programs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Pencil } from "lucide-react";
import { parsePage, getPagination } from "@/lib/pagination";
import { PaginationControls } from "@/components/admin/pagination-controls";

export const dynamic = "force-dynamic";

export default async function AdminProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const totalItems = await prisma.program.count();
  const { skip, take, currentPage, totalPages } = getPagination(parsePage(pageParam), totalItems);
  const programs = await prisma.program.findMany({
    orderBy: { order: "asc" },
    include: { trainer: { select: { name: true } } },
    skip,
    take,
  });

  return (
    <div>
      <AdminPageHeader
        title="Programs"
        description="Manage every training program shown on your website."
        action={{ href: "/admin/programs/new", label: "New Program" }}
      />

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Program</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Trainer</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-foreground/50">
                  No programs yet. Create your first one.
                </TableCell>
              </TableRow>
            )}
            {programs.map((program) => (
              <TableRow key={program.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/5">
                      <Image src={program.image} alt={program.name} fill sizes="40px" className="object-cover" />
                    </span>
                    <div>
                      <p className="font-medium">{program.name}</p>
                      <p className="text-xs text-foreground/45">/{program.slug}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-foreground/60">{program.category}</TableCell>
                <TableCell className="text-foreground/60">{program.trainer?.name ?? "—"}</TableCell>
                <TableCell>
                  {program.isFeatured && <Badge className="bg-brand text-black">Featured</Badge>}
                </TableCell>
                <TableCell>
                  <ToggleActiveSwitch id={program.id} isActive={program.isActive} onToggle={toggleProgramActive} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" nativeButton={false} render={<Link href={`/admin/programs/${program.id}`} />}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <form action={async () => { "use server"; await duplicateProgram(program.id); }}>
                      <Button variant="ghost" size="icon" type="submit">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </form>
                    <ConfirmDeleteButton
                      itemLabel={program.name}
                      onDelete={deleteProgram.bind(null, program.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <PaginationControls
        basePath="/admin/programs"
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={take}
      />
    </div>
  );
}
