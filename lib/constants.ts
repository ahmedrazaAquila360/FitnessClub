export const SINGLETON_ID = "main";

export const SESSION_COOKIE_NAME = "apex_session";

export const ROLE_LABELS = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
} as const;

export const HOMEPAGE_SECTIONS: { key: string; name: string }[] = [
  { key: "hero", name: "Hero" },
  { key: "stats", name: "Trust / Statistics" },
  { key: "about", name: "About" },
  { key: "programs", name: "Training Programs" },
  { key: "memberships", name: "Membership Plans" },
  { key: "trainers", name: "Trainers" },
  { key: "schedule", name: "Class Schedule" },
  { key: "facilities", name: "Facilities" },
  { key: "transformations", name: "Transformations" },
  { key: "testimonials", name: "Testimonials" },
  { key: "gallery", name: "Gallery" },
  { key: "why-choose-us", name: "Why Choose Us" },
  { key: "cta", name: "Final CTA" },
  { key: "contact", name: "Contact" },
];

// Postgres jsonb does not preserve object key insertion order, so any UI
// that iterates GymSettings.openingHours must impose this order explicitly.
export const WEEK_DAY_KEYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const DAYS_OF_WEEK = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

export const DAY_LABELS: Record<string, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  ALL_LEVELS: "All Levels",
};

export const GALLERY_CATEGORY_LABELS: Record<string, string> = {
  GYM: "Gym",
  EQUIPMENT: "Equipment",
  TRAINING: "Training",
  CLASSES: "Classes",
  TRAINERS: "Trainers",
  EVENTS: "Events",
  LIFESTYLE: "Lifestyle",
};
