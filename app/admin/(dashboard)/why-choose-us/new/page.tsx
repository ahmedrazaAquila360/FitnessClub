import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { WhyChooseUsForm } from "@/components/admin/why-choose-us/why-choose-us-form";
import { createWhyChooseUsItem } from "@/lib/actions/why-choose-us";

export default function NewWhyChooseUsItemPage() {
  return (
    <div>
      <AdminPageHeader title="New Why Choose Us Item" backHref="/admin/why-choose-us" />
      <WhyChooseUsForm action={createWhyChooseUsItem} />
    </div>
  );
}
