import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ToggleActiveSwitch } from "@/components/admin/toggle-active-switch";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteTrainer, toggleTrainerActive } from "@/lib/actions/trainers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminTrainersPage() {
  const trainers = await prisma.trainer.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <AdminPageHeader
        title="Trainers"
        description="Manage coach profiles shown across the site."
        action={{ href: "/admin/trainers/new", label: "New Trainer" }}
      />

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Trainer</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-foreground/50">
                  No trainers yet.
                </TableCell>
              </TableRow>
            )}
            {trainers.map((trainer) => (
              <TableRow key={trainer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white/5">
                      <Image src={trainer.image} alt={trainer.name} fill sizes="40px" className="object-cover" />
                    </span>
                    <div>
                      <p className="font-medium">{trainer.name}</p>
                      <p className="text-xs text-foreground/45">/{trainer.slug}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-foreground/60">{trainer.position}</TableCell>
                <TableCell className="text-foreground/60">{trainer.experienceYears} yrs</TableCell>
                <TableCell>{trainer.isFeatured && <Badge className="bg-brand text-black">Featured</Badge>}</TableCell>
                <TableCell>
                  <ToggleActiveSwitch id={trainer.id} isActive={trainer.isActive} onToggle={toggleTrainerActive} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" nativeButton={false} render={<Link href={`/admin/trainers/${trainer.id}`} />}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <ConfirmDeleteButton itemLabel={trainer.name} onDelete={deleteTrainer.bind(null, trainer.id)} />
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
