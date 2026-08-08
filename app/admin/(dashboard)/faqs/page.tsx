import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ToggleActiveSwitch } from "@/components/admin/toggle-active-switch";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteFAQ, toggleFAQActive } from "@/lib/actions/faqs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminFAQsPage() {
  const faqs = await prisma.fAQ.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <AdminPageHeader
        title="FAQs"
        description="Manage frequently asked questions."
        action={{ href: "/admin/faqs/new", label: "New FAQ" }}
      />
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-foreground/50">
                  No FAQs yet.
                </TableCell>
              </TableRow>
            )}
            {faqs.map((faq) => (
              <TableRow key={faq.id}>
                <TableCell className="max-w-md">{faq.question}</TableCell>
                <TableCell className="text-foreground/60">{faq.category}</TableCell>
                <TableCell>
                  <ToggleActiveSwitch id={faq.id} isActive={faq.isActive} onToggle={toggleFAQActive} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" nativeButton={false} render={<Link href={`/admin/faqs/${faq.id}`} />}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <ConfirmDeleteButton itemLabel="this FAQ" onDelete={deleteFAQ.bind(null, faq.id)} />
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
