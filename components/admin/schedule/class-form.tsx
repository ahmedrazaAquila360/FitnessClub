"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/admin/submit-button";
import { DAYS_OF_WEEK, DAY_LABELS } from "@/lib/constants";
import type { ActionResult } from "@/lib/actions/types";
import type { ClassSchedule } from "@prisma/client";

type Action = (prev: ActionResult, formData: FormData) => Promise<ActionResult>;

export function ClassForm({
  action,
  classItem,
  trainers,
  programs,
}: {
  action: Action;
  classItem?: ClassSchedule;
  trainers: { id: string; name: string }[];
  programs: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, {});

  useEffect(() => {
    if (state.success) {
      toast.success(classItem ? "Class updated" : "Class scheduled");
      router.push("/admin/schedule");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, classItem, router]);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="className">Class Name</Label>
        <Input id="className" name="className" required defaultValue={classItem?.className} placeholder="Sunrise HIIT" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="trainerId">Trainer</Label>
          <Select name="trainerId" defaultValue={classItem?.trainerId ?? trainers[0]?.id}>
            <SelectTrigger className="w-full" id="trainerId">
              <SelectValue placeholder="Select a trainer" />
            </SelectTrigger>
            <SelectContent>
              {trainers.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="programId">Program (optional)</Label>
          <Select name="programId" defaultValue={classItem?.programId ?? "none"}>
            <SelectTrigger className="w-full" id="programId">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {programs.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="dayOfWeek">Day</Label>
          <Select name="dayOfWeek" defaultValue={classItem?.dayOfWeek ?? "MONDAY"}>
            <SelectTrigger className="w-full" id="dayOfWeek">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAYS_OF_WEEK.map((day) => (
                <SelectItem key={day} value={day}>
                  {DAY_LABELS[day]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select name="difficulty" defaultValue={classItem?.difficulty ?? "ALL_LEVELS"}>
            <SelectTrigger className="w-full" id="difficulty">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BEGINNER">Beginner</SelectItem>
              <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
              <SelectItem value="ADVANCED">Advanced</SelectItem>
              <SelectItem value="ALL_LEVELS">All Levels</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input id="startTime" name="startTime" type="time" required defaultValue={classItem?.startTime ?? "06:00"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input id="endTime" name="endTime" type="time" required defaultValue={classItem?.endTime ?? "07:00"} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="room">Room</Label>
          <Input id="room" name="room" required defaultValue={classItem?.room ?? "Main Floor"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity</Label>
          <Input id="capacity" name="capacity" type="number" required defaultValue={classItem?.capacity ?? 20} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="booked">Booked</Label>
          <Input id="booked" name="booked" type="number" defaultValue={classItem?.booked ?? 0} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <Switch name="isActive" defaultChecked={classItem?.isActive ?? true} /> Active
      </label>

      <SubmitButton className="bg-brand text-black hover:bg-brand/90">
        {classItem ? "Save Changes" : "Schedule Class"}
      </SubmitButton>
    </form>
  );
}
