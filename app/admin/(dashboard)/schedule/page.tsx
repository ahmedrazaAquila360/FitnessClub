import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ToggleActiveSwitch } from "@/components/admin/toggle-active-switch";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteClass, toggleClassActive } from "@/lib/actions/schedule";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DAY_LABELS } from "@/lib/constants";
import { Pencil } from "lucide-react";
import { parsePage, getPagination } from "@/lib/pagination";
import { PaginationControls } from "@/components/admin/pagination-controls";

export const dynamic = "force-dynamic";

export default async function AdminSchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const totalItems = await prisma.classSchedule.count();
  const { skip, take, currentPage, totalPages } = getPagination(parsePage(pageParam), totalItems);
  const classes = await prisma.classSchedule.findMany({
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    include: { trainer: { select: { name: true } }, program: { select: { name: true } } },
    skip,
    take,
  });

  return (
    <div>
      <AdminPageHeader
        title="Class Schedule"
        description="Manage every class, trainer assignment and time slot."
        action={{ href: "/admin/schedule/new", label: "New Class" }}
      />

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Class</TableHead>
              <TableHead>Day / Time</TableHead>
              <TableHead>Trainer</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-foreground/50">
                  No classes scheduled yet.
                </TableCell>
              </TableRow>
            )}
            {classes.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <p className="font-medium">{c.className}</p>
                  {c.program && <p className="text-xs text-foreground/45">{c.program.name}</p>}
                </TableCell>
                <TableCell className="text-foreground/60">
                  {DAY_LABELS[c.dayOfWeek]} · {c.startTime}–{c.endTime}
                </TableCell>
                <TableCell className="text-foreground/60">{c.trainer.name}</TableCell>
                <TableCell className="text-foreground/60">{c.room}</TableCell>
                <TableCell className="text-foreground/60">{c.booked}/{c.capacity}</TableCell>
                <TableCell>
                  <ToggleActiveSwitch id={c.id} isActive={c.isActive} onToggle={toggleClassActive} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" nativeButton={false} render={<Link href={`/admin/schedule/${c.id}`} />}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <ConfirmDeleteButton itemLabel={c.className} onDelete={deleteClass.bind(null, c.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <PaginationControls
        basePath="/admin/schedule"
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={take}
      />
    </div>
  );
}
