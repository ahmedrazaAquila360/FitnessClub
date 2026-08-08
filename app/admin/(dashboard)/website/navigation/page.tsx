import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { NavItemsManager } from "@/components/admin/navigation/nav-items-manager";
import { SocialLinksManager } from "@/components/admin/navigation/social-links-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

export default async function AdminNavigationPage() {
  const [headerItems, footerItems, socialLinks] = await Promise.all([
    prisma.navigationItem.findMany({ where: { location: "HEADER" }, orderBy: { order: "asc" } }),
    prisma.navigationItem.findMany({ where: { location: "FOOTER" }, orderBy: { order: "asc" } }),
    prisma.socialLink.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Navigation & Social"
        description="Control header links, footer links and social profiles."
      />
      <Tabs defaultValue="header" className="max-w-4xl">
        <TabsList>
          <TabsTrigger value="header">Header Nav</TabsTrigger>
          <TabsTrigger value="footer">Footer Nav</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
        </TabsList>
        <TabsContent value="header" className="mt-6">
          <NavItemsManager items={headerItems} location="HEADER" />
        </TabsContent>
        <TabsContent value="footer" className="mt-6">
          <NavItemsManager items={footerItems} location="FOOTER" />
        </TabsContent>
        <TabsContent value="social" className="mt-6">
          <SocialLinksManager links={socialLinks} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
