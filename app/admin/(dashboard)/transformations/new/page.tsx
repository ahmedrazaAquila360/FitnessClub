import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TransformationForm } from "@/components/admin/transformations/transformation-form";
import { createTransformation } from "@/lib/actions/transformations";

export default function NewTransformationPage() {
  return (
    <div>
      <AdminPageHeader title="New Transformation Story" backHref="/admin/transformations" />
      <TransformationForm action={createTransformation} />
    </div>
  );
}
