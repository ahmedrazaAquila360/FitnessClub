"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { reorderSections, toggleSectionEnabled } from "@/lib/actions/sections";
import type { PageSection } from "@prisma/client";

function SortableRow({
  section,
  onToggle,
}: {
  section: PageSection;
  onToggle: (id: string, next: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-4 rounded-xl border border-white/10 bg-white/2 p-4",
        isDragging && "z-10 opacity-80 shadow-2xl",
        !section.isEnabled && "opacity-50"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-foreground/40 hover:text-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex flex-1 items-center gap-2">
        {section.isEnabled ? (
          <Eye className="h-4 w-4 text-brand" />
        ) : (
          <EyeOff className="h-4 w-4 text-foreground/30" />
        )}
        <span className="font-medium">{section.name}</span>
      </div>
      <Switch
        checked={section.isEnabled}
        onCheckedChange={(checked) => onToggle(section.id, checked)}
      />
    </div>
  );
}

export function SectionManager({ sections: initialSections }: { sections: PageSection[] }) {
  const [, startTransition] = useTransition();
  const [sections, setSections] = useState(initialSections);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    const next = arrayMove(sections, oldIndex, newIndex);
    setSections(next);
    startTransition(() => {
      reorderSections(next.map((s) => s.id));
    });
  }

  function handleToggle(id: string, next: boolean) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, isEnabled: next } : s)));
    startTransition(() => {
      toggleSectionEnabled(id, next);
    });
  }

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {sections.map((section) => (
            <SortableRow key={section.id} section={section} onToggle={handleToggle} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
