import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const programSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().regex(slugRegex, "Use lowercase letters, numbers and hyphens only"),
  description: z.string().min(10, "Description is required"),
  shortDescription: z.string().min(5, "Short description is required"),
  image: z.string().url("A valid image URL is required"),
  icon: z.string().min(1),
  category: z.string().min(1),
  duration: z.string().min(1),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"]),
  trainerId: z.string().optional().nullable(),
  ctaLabel: z.string().min(1),
  ctaHref: z.string().optional().nullable(),
  isFeatured: z.coerce.boolean().default(false),
  order: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});

export const membershipPlanSchema = z.object({
  name: z.string().min(2),
  price: z.coerce.number().min(0),
  billingPeriod: z.enum(["MONTHLY", "QUARTERLY", "YEARLY"]),
  description: z.string().min(5),
  features: z.array(z.string().min(1)).default([]),
  ctaLabel: z.string().min(1),
  ctaHref: z.string().min(1),
  badge: z.string().optional().nullable(),
  isFeatured: z.coerce.boolean().default(false),
  order: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});

export const trainerSchema = z.object({
  name: z.string().min(2),
  slug: z.string().regex(slugRegex),
  image: z.string().url(),
  position: z.string().min(2),
  specialization: z.array(z.string().min(1)).default([]),
  bio: z.string().min(10),
  experienceYears: z.coerce.number().int().min(0),
  certifications: z.array(z.string().min(1)).default([]),
  instagram: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  twitter: z.string().optional().nullable(),
  youtube: z.string().optional().nullable(),
  isFeatured: z.coerce.boolean().default(false),
  order: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});

export const classScheduleSchema = z.object({
  className: z.string().min(2),
  programId: z.string().optional().nullable(),
  trainerId: z.string().min(1, "Trainer is required"),
  dayOfWeek: z.enum([
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ]),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  room: z.string().min(1),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"]),
  capacity: z.coerce.number().int().min(1),
  booked: z.coerce.number().int().min(0).default(0),
  isActive: z.coerce.boolean().default(true),
});

export const facilitySchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  image: z.string().url(),
  icon: z.string().min(1),
  isFeatured: z.coerce.boolean().default(false),
  order: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});

export const transformationSchema = z.object({
  memberName: z.string().min(2),
  beforeImage: z.string().url(),
  afterImage: z.string().url(),
  duration: z.string().min(1),
  goal: z.string().min(2),
  story: z.string().min(10),
  result: z.string().min(2),
  isFeatured: z.coerce.boolean().default(false),
  order: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});

export const testimonialSchema = z.object({
  name: z.string().min(2),
  image: z.string().url().optional().nullable(),
  rating: z.coerce.number().int().min(1).max(5),
  content: z.string().min(10),
  membership: z.string().min(2),
  isFeatured: z.coerce.boolean().default(false),
  order: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});

export const galleryItemSchema = z.object({
  image: z.string().url(),
  category: z.enum([
    "GYM",
    "EQUIPMENT",
    "TRAINING",
    "CLASSES",
    "TRAINERS",
    "EVENTS",
    "LIFESTYLE",
  ]),
  caption: z.string().optional().nullable(),
  altText: z.string().default(""),
  isFeatured: z.coerce.boolean().default(false),
  order: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});

export const faqSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(5),
  category: z.string().default("General"),
  order: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});

export const whyChooseUsSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  icon: z.string().min(1),
  image: z.string().url().optional().nullable(),
  order: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});

export const statisticSchema = z.object({
  label: z.string().min(1),
  value: z.coerce.number().int(),
  suffix: z.string().default(""),
  icon: z.string().default("Users"),
  order: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});

export const contactMessageSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("A valid email is required"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message is too short"),
});
