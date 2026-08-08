import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TrainerForm } from "@/components/admin/trainers/trainer-form";
import { createTrainer } from "@/lib/actions/trainers";

export default function NewTrainerPage() {
  return (
    <div>
      <AdminPageHeader title="New Trainer" backHref="/admin/trainers" />
      <TrainerForm action={createTrainer} />
    </div>
  );
}
