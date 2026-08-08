-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS');

-- CreateEnum
CREATE TYPE "BillingPeriod" AS ENUM ('MONTHLY', 'QUARTERLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "GalleryCategory" AS ENUM ('GYM', 'EQUIPMENT', 'TRAINING', 'CLASSES', 'TRAINERS', 'EVENTS', 'LIFESTYLE');

-- CreateEnum
CREATE TYPE "SocialPlatform" AS ENUM ('INSTAGRAM', 'FACEBOOK', 'TWITTER', 'YOUTUBE', 'TIKTOK', 'LINKEDIN', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "NavLocation" AS ENUM ('HEADER', 'FOOTER');

-- CreateEnum
CREATE TYPE "ButtonStyle" AS ENUM ('ROUNDED', 'PILL', 'SQUARE');

-- CreateEnum
CREATE TYPE "TextAlign" AS ENUM ('LEFT', 'CENTER', 'RIGHT');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "AnimationType" AS ENUM ('FADE_UP', 'FADE_IN', 'ZOOM_IN', 'SLIDE_LEFT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EDITOR',
    "avatar" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GymSettings" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "brandName" TEXT NOT NULL DEFAULT 'APEX ATHLETIC',
    "tagline" TEXT NOT NULL DEFAULT 'Premium Performance Training',
    "logoUrl" TEXT,
    "logoDarkUrl" TEXT,
    "logoLightUrl" TEXT,
    "faviconUrl" TEXT,
    "phone" TEXT NOT NULL DEFAULT '+1 (555) 010-2040',
    "whatsapp" TEXT NOT NULL DEFAULT '+15550102040',
    "email" TEXT NOT NULL DEFAULT 'hello@apexathletic.com',
    "address" TEXT NOT NULL DEFAULT '2400 Iron Horse Boulevard',
    "city" TEXT NOT NULL DEFAULT 'Austin',
    "state" TEXT NOT NULL DEFAULT 'TX',
    "zip" TEXT NOT NULL DEFAULT '78701',
    "country" TEXT NOT NULL DEFAULT 'United States',
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 30.2672,
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT -97.7431,
    "googleMapsEmbed" TEXT,
    "openingHours" JSONB NOT NULL DEFAULT '{"monday":"5:00 AM - 11:00 PM","tuesday":"5:00 AM - 11:00 PM","wednesday":"5:00 AM - 11:00 PM","thursday":"5:00 AM - 11:00 PM","friday":"5:00 AM - 11:00 PM","saturday":"6:00 AM - 9:00 PM","sunday":"7:00 AM - 8:00 PM"}',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GymSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThemeSettings" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "primaryColor" TEXT NOT NULL DEFAULT 'oklch(0.92 0.19 130)',
    "secondaryColor" TEXT NOT NULL DEFAULT 'oklch(0.20 0 0)',
    "accentColor" TEXT NOT NULL DEFAULT 'oklch(0.92 0.19 130)',
    "backgroundColor" TEXT NOT NULL DEFAULT 'oklch(0.09 0 0)',
    "foregroundColor" TEXT NOT NULL DEFAULT 'oklch(0.98 0 0)',
    "mutedColor" TEXT NOT NULL DEFAULT 'oklch(0.65 0 0)',
    "buttonStyle" "ButtonStyle" NOT NULL DEFAULT 'PILL',
    "borderRadius" TEXT NOT NULL DEFAULT '0.75rem',
    "fontHeading" TEXT NOT NULL DEFAULT 'Anton',
    "fontBody" TEXT NOT NULL DEFAULT 'Inter',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThemeSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SEOSettings" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "defaultTitle" TEXT NOT NULL DEFAULT 'Apex Athletic | Premium Performance Training Gym',
    "titleTemplate" TEXT NOT NULL DEFAULT '%s | Apex Athletic',
    "defaultDescription" TEXT NOT NULL DEFAULT 'Apex Athletic is a premium strength, conditioning and performance training club. Elite trainers, world-class facilities, real transformations.',
    "ogImage" TEXT,
    "canonicalUrl" TEXT NOT NULL DEFAULT 'https://apexathletic.com',
    "keywords" TEXT NOT NULL DEFAULT 'gym, fitness club, personal training, strength training, HIIT, boxing gym, premium gym',
    "robotsIndex" BOOLEAN NOT NULL DEFAULT true,
    "robotsFollow" BOOLEAN NOT NULL DEFAULT true,
    "structuredDataType" TEXT NOT NULL DEFAULT 'HealthClub',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SEOSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FooterSettings" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "description" TEXT NOT NULL DEFAULT 'Apex Athletic is where dedicated athletes and everyday people come to build strength, discipline and unstoppable momentum.',
    "copyrightText" TEXT NOT NULL DEFAULT 'Apex Athletic. All rights reserved.',
    "newsletterEnabled" BOOLEAN NOT NULL DEFAULT true,
    "newsletterHeading" TEXT NOT NULL DEFAULT 'Get exclusive training tips & offers',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FooterSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavigationItem" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "location" "NavLocation" NOT NULL DEFAULT 'HEADER',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isExternal" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NavigationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL,
    "platform" "SocialPlatform" NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageSection" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroSection" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "badge" TEXT NOT NULL DEFAULT 'Austin''s #1 Rated Performance Gym',
    "heading" TEXT NOT NULL DEFAULT 'BUILD YOUR',
    "headingHighlight" TEXT NOT NULL DEFAULT 'STRONGEST SELF',
    "subtitle" TEXT DEFAULT '',
    "description" TEXT NOT NULL DEFAULT 'Elite coaching, world-class facilities and a community obsessed with results. This is where ordinary limits end.',
    "primaryCtaLabel" TEXT NOT NULL DEFAULT 'Join Now',
    "primaryCtaHref" TEXT NOT NULL DEFAULT '/membership',
    "secondaryCtaLabel" TEXT NOT NULL DEFAULT 'Book a Tour',
    "secondaryCtaHref" TEXT NOT NULL DEFAULT '/contact',
    "backgroundImage" TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2400&auto=format&fit=crop',
    "backgroundVideo" TEXT,
    "overlayOpacity" DOUBLE PRECISION NOT NULL DEFAULT 0.6,
    "textAlign" "TextAlign" NOT NULL DEFAULT 'LEFT',
    "animationType" "AnimationType" NOT NULL DEFAULT 'FADE_UP',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutSection" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "eyebrow" TEXT NOT NULL DEFAULT 'Our Story',
    "heading" TEXT NOT NULL DEFAULT 'WE BUILD MORE THAN BODIES',
    "description" TEXT NOT NULL DEFAULT 'Founded by athletes for athletes, Apex Athletic was built on a simple belief: discipline, expert coaching and community turn ordinary people into their strongest selves. Every program, every class, every square foot of this facility is engineered around real results.',
    "image" TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1800&auto=format&fit=crop',
    "secondaryImage" TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop',
    "missionTitle" TEXT NOT NULL DEFAULT 'Our Mission',
    "missionText" TEXT NOT NULL DEFAULT 'To deliver premium, science-backed training experiences that transform bodies, sharpen minds and build a community that pushes each other further than they''d ever go alone.',
    "values" JSONB NOT NULL DEFAULT '[{"title":"Discipline","description":"Consistency beats intensity. We build habits that last."},{"title":"Community","description":"You never train alone. Our members push each other daily."},{"title":"Results","description":"Every program is measured, tracked and optimized for outcomes."}]',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statistic" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "suffix" TEXT NOT NULL DEFAULT '',
    "icon" TEXT NOT NULL DEFAULT 'Users',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Statistic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'Dumbbell',
    "category" TEXT NOT NULL DEFAULT 'Strength',
    "duration" TEXT NOT NULL DEFAULT '60 min',
    "difficulty" "Difficulty" NOT NULL DEFAULT 'ALL_LEVELS',
    "trainerId" TEXT,
    "ctaLabel" TEXT NOT NULL DEFAULT 'Explore Program',
    "ctaHref" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "billingPeriod" "BillingPeriod" NOT NULL DEFAULT 'MONTHLY',
    "description" TEXT NOT NULL,
    "features" TEXT[],
    "ctaLabel" TEXT NOT NULL DEFAULT 'Join Now',
    "ctaHref" TEXT NOT NULL DEFAULT '/contact',
    "badge" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MembershipPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trainer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "specialization" TEXT[],
    "bio" TEXT NOT NULL,
    "experienceYears" INTEGER NOT NULL DEFAULT 1,
    "certifications" TEXT[],
    "instagram" TEXT,
    "facebook" TEXT,
    "twitter" TEXT,
    "youtube" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassSchedule" (
    "id" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "programId" TEXT,
    "trainerId" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "room" TEXT NOT NULL DEFAULT 'Main Floor',
    "difficulty" "Difficulty" NOT NULL DEFAULT 'ALL_LEVELS',
    "capacity" INTEGER NOT NULL DEFAULT 20,
    "booked" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facility" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'Building2',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transformation" (
    "id" TEXT NOT NULL,
    "memberName" TEXT NOT NULL,
    "beforeImage" TEXT NOT NULL,
    "afterImage" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "story" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "content" TEXT NOT NULL,
    "membership" TEXT NOT NULL DEFAULT 'Member',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryItem" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "category" "GalleryCategory" NOT NULL DEFAULT 'GYM',
    "caption" TEXT,
    "altText" TEXT NOT NULL DEFAULT '',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQ" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhyChooseUsItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'Trophy',
    "image" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "WhyChooseUsItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CTASection" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "heading" TEXT NOT NULL DEFAULT 'YOUR NEXT LEVEL',
    "headingHighlight" TEXT NOT NULL DEFAULT 'STARTS TODAY',
    "description" TEXT NOT NULL DEFAULT 'No contracts. No excuses. Just a free tour, a real training plan, and a team that will not let you settle for average.',
    "primaryCtaLabel" TEXT NOT NULL DEFAULT 'Join Now',
    "primaryCtaHref" TEXT NOT NULL DEFAULT '/membership',
    "secondaryCtaLabel" TEXT NOT NULL DEFAULT 'Book a Tour',
    "secondaryCtaHref" TEXT NOT NULL DEFAULT '/contact',
    "backgroundImage" TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=2400&auto=format&fit=crop',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CTASection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "altText" TEXT NOT NULL DEFAULT '',
    "caption" TEXT,
    "folder" TEXT NOT NULL DEFAULT 'general',
    "width" INTEGER,
    "height" INTEGER,
    "size" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_entityType_idx" ON "ActivityLog"("entityType");

-- CreateIndex
CREATE INDEX "NavigationItem_location_order_idx" ON "NavigationItem"("location", "order");

-- CreateIndex
CREATE INDEX "SocialLink_order_idx" ON "SocialLink"("order");

-- CreateIndex
CREATE UNIQUE INDEX "PageSection_key_key" ON "PageSection"("key");

-- CreateIndex
CREATE INDEX "PageSection_order_idx" ON "PageSection"("order");

-- CreateIndex
CREATE INDEX "Statistic_order_idx" ON "Statistic"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Program_slug_key" ON "Program"("slug");

-- CreateIndex
CREATE INDEX "Program_slug_idx" ON "Program"("slug");

-- CreateIndex
CREATE INDEX "Program_isActive_order_idx" ON "Program"("isActive", "order");

-- CreateIndex
CREATE INDEX "MembershipPlan_isActive_order_idx" ON "MembershipPlan"("isActive", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Trainer_slug_key" ON "Trainer"("slug");

-- CreateIndex
CREATE INDEX "Trainer_slug_idx" ON "Trainer"("slug");

-- CreateIndex
CREATE INDEX "Trainer_isActive_order_idx" ON "Trainer"("isActive", "order");

-- CreateIndex
CREATE INDEX "ClassSchedule_dayOfWeek_idx" ON "ClassSchedule"("dayOfWeek");

-- CreateIndex
CREATE INDEX "ClassSchedule_isActive_idx" ON "ClassSchedule"("isActive");

-- CreateIndex
CREATE INDEX "Facility_isActive_order_idx" ON "Facility"("isActive", "order");

-- CreateIndex
CREATE INDEX "Transformation_isActive_order_idx" ON "Transformation"("isActive", "order");

-- CreateIndex
CREATE INDEX "Testimonial_isActive_order_idx" ON "Testimonial"("isActive", "order");

-- CreateIndex
CREATE INDEX "GalleryItem_category_idx" ON "GalleryItem"("category");

-- CreateIndex
CREATE INDEX "GalleryItem_isActive_order_idx" ON "GalleryItem"("isActive", "order");

-- CreateIndex
CREATE INDEX "FAQ_isActive_order_idx" ON "FAQ"("isActive", "order");

-- CreateIndex
CREATE INDEX "WhyChooseUsItem_isActive_order_idx" ON "WhyChooseUsItem"("isActive", "order");

-- CreateIndex
CREATE INDEX "ContactMessage_isRead_idx" ON "ContactMessage"("isRead");

-- CreateIndex
CREATE INDEX "ContactMessage_createdAt_idx" ON "ContactMessage"("createdAt");

-- CreateIndex
CREATE INDEX "MediaAsset_folder_idx" ON "MediaAsset"("folder");

-- CreateIndex
CREATE INDEX "MediaAsset_type_idx" ON "MediaAsset"("type");

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSchedule" ADD CONSTRAINT "ClassSchedule_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSchedule" ADD CONSTRAINT "ClassSchedule_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
