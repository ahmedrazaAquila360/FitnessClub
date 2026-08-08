import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { HOMEPAGE_SECTIONS, SINGLETON_ID } from "../lib/constants";

const prisma = new PrismaClient();

function img(id: string, w = 1600) {
  return `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;
}

// Curated, verified Unsplash photo IDs grouped by subject.
const PHOTOS = {
  heroBg: "1534438327276-14e5300c3a48",
  aboutMain: "1571902943202-507ec2618e8f",
  aboutSecondary: "1517836357463-d25dfeac3438",
  ctaBg: "1517963879433-6ad2b056d712",
  gymFloor1: "1526506118085-60ce8714f8c5",
  gymFloor2: "1571019613454-1cb2f99b2d8b",
  equipment1: "1583454110551-21f2fa2afe61",
  equipment2: "1594381898411-846e7d193883",
  strength1: "1470468969717-61d5d54fd036",
  strength2: "1549060279-7e168fcee0c2",
  strength3: "1550345332-09e3ac987658",
  boxing1: "1517438322307-e67111335449",
  boxing2: "1583473848882-f9a5bc7fd2ee",
  running: "1552674605-db6ffd4facb5",
  yoga1: "1544367567-0f2fcb009e0b",
  yoga2: "1518611012118-696072aa579a",
  gymAction1: "1601422407692-ec4eeec1d9b3",
  gymAction2: "1571731956672-f2b94d7dd0cb",
  gymAction3: "1546483875-ad9014c88eba",
  gymAction4: "1584464491033-06628f3a6b7b",
  gymAction5: "1434682772747-f16d3ea162c3",
  gymAction6: "1567598508481-65985588e295",
  gymAction7: "1461896836934-ffe607ba8211",
  gymAction8: "1550259979-ed79b48d2a30",
  portraitM1: "1633332755192-727a05c4013d",
  portraitF1: "1573497019940-1c28c88b4f3e",
  portraitM2: "1580489944761-15a19d654956",
  portraitF2: "1522075469751-3a6694fb2f61",
  portraitM3: "1500648767791-00dcc994a43e",
  portraitF3: "1544005313-94ddf0286df2",
  portraitM4: "1552058544-f2b08422138a",
  portraitM5: "1531123897727-8f129e1688ce",
  portraitM6: "1489980557514-251d61e3eeb6",
  portraitM7: "1531384441138-2736e62e0919",
  portraitF4: "1554151228-14d9def656e4",
  portraitF5: "1607746882042-944635dfe10e",
  portraitM8: "1548690312-e3b507d8c110",
} as const;

async function main() {
  console.log("Seeding Apex Athletic...");

  // ---------------------------------------------------------------------
  // Clear existing content (safe, idempotent reseed)
  // ---------------------------------------------------------------------
  await prisma.activityLog.deleteMany();
  await prisma.classSchedule.deleteMany();
  await prisma.program.deleteMany();
  await prisma.trainer.deleteMany();
  await prisma.membershipPlan.deleteMany();
  await prisma.facility.deleteMany();
  await prisma.transformation.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.whyChooseUsItem.deleteMany();
  await prisma.statistic.deleteMany();
  await prisma.navigationItem.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.pageSection.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.user.deleteMany();

  // ---------------------------------------------------------------------
  // Users
  // ---------------------------------------------------------------------
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const superAdmin = await prisma.user.create({
    data: {
      name: "Studio Admin",
      email: "admin@apexathletic.com",
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      name: "Jordan Lee",
      email: "manager@apexathletic.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      name: "Taylor Brooks",
      email: "editor@apexathletic.com",
      passwordHash,
      role: "EDITOR",
    },
  });

  // ---------------------------------------------------------------------
  // Global settings
  // ---------------------------------------------------------------------
  await prisma.gymSettings.upsert({
    where: { id: SINGLETON_ID },
    create: {
      id: SINGLETON_ID,
      brandName: "Apex Athletic",
      tagline: "Premium Performance Training",
      phone: "+1 (512) 555-0148",
      whatsapp: "+15125550148",
      email: "hello@apexathletic.com",
      address: "2400 Iron Horse Boulevard",
      city: "Austin",
      state: "TX",
      zip: "78701",
      country: "United States",
      latitude: 30.2672,
      longitude: -97.7431,
    },
    update: {},
  });

  await prisma.themeSettings.upsert({
    where: { id: SINGLETON_ID },
    create: { id: SINGLETON_ID },
    update: {},
  });

  await prisma.sEOSettings.upsert({
    where: { id: SINGLETON_ID },
    create: {
      id: SINGLETON_ID,
      defaultTitle: "Apex Athletic | Premium Performance Training Gym in Austin",
      titleTemplate: "%s | Apex Athletic",
      defaultDescription:
        "Apex Athletic is Austin's premium strength, conditioning and performance training club. Elite trainers, world-class facilities, real transformations.",
      ogImage: img(PHOTOS.heroBg, 1200),
      canonicalUrl: "https://apexathletic.com",
    },
    update: {},
  });

  await prisma.footerSettings.upsert({
    where: { id: SINGLETON_ID },
    create: { id: SINGLETON_ID },
    update: {},
  });

  // ---------------------------------------------------------------------
  // Navigation + Social
  // ---------------------------------------------------------------------
  const headerNav = [
    { label: "Home", href: "/" },
    { label: "About", href: "/#about" },
    { label: "Programs", href: "/programs" },
    { label: "Membership", href: "/membership" },
    { label: "Trainers", href: "/trainers" },
    { label: "Schedule", href: "/schedule" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ];
  for (const [i, item] of headerNav.entries()) {
    await prisma.navigationItem.create({
      data: { ...item, location: "HEADER", order: i },
    });
  }

  const footerNav = [
    { label: "Programs", href: "/programs" },
    { label: "Membership", href: "/membership" },
    { label: "Trainers", href: "/trainers" },
    { label: "Schedule", href: "/schedule" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ];
  for (const [i, item] of footerNav.entries()) {
    await prisma.navigationItem.create({
      data: { ...item, location: "FOOTER", order: i },
    });
  }

  const socials = [
    { platform: "INSTAGRAM" as const, url: "https://instagram.com/apexathletic" },
    { platform: "FACEBOOK" as const, url: "https://facebook.com/apexathletic" },
    { platform: "TWITTER" as const, url: "https://x.com/apexathletic" },
    { platform: "YOUTUBE" as const, url: "https://youtube.com/@apexathletic" },
  ];
  for (const [i, s] of socials.entries()) {
    await prisma.socialLink.create({ data: { ...s, order: i } });
  }

  // ---------------------------------------------------------------------
  // Homepage sections
  // ---------------------------------------------------------------------
  for (const [i, section] of HOMEPAGE_SECTIONS.entries()) {
    await prisma.pageSection.create({
      data: { key: section.key, name: section.name, order: i, isEnabled: true },
    });
  }

  // ---------------------------------------------------------------------
  // Hero
  // ---------------------------------------------------------------------
  await prisma.heroSection.upsert({
    where: { id: SINGLETON_ID },
    create: {
      id: SINGLETON_ID,
      badge: "Austin's #1 Rated Performance Gym",
      heading: "BUILD YOUR",
      headingHighlight: "STRONGEST SELF",
      description:
        "Elite coaching, world-class facilities and a community obsessed with results. This is where ordinary limits end.",
      primaryCtaLabel: "Join Now",
      primaryCtaHref: "/membership",
      secondaryCtaLabel: "Book a Tour",
      secondaryCtaHref: "/contact",
      backgroundImage: img(PHOTOS.heroBg, 2400),
    },
    update: {},
  });

  // ---------------------------------------------------------------------
  // About + Statistics
  // ---------------------------------------------------------------------
  await prisma.aboutSection.upsert({
    where: { id: SINGLETON_ID },
    create: {
      id: SINGLETON_ID,
      eyebrow: "Our Story",
      heading: "WE BUILD MORE THAN BODIES",
      description:
        "Founded by athletes for athletes, Apex Athletic was built on a simple belief: discipline, expert coaching and community turn ordinary people into their strongest selves. Every program, every class, every square foot of this facility is engineered around real results.",
      image: img(PHOTOS.aboutMain, 1800),
      secondaryImage: img(PHOTOS.aboutSecondary, 1200),
      missionTitle: "Our Mission",
      missionText:
        "To deliver premium, science-backed training experiences that transform bodies, sharpen minds and build a community that pushes each other further than they'd ever go alone.",
      values: [
        { title: "Discipline", description: "Consistency beats intensity. We build habits that last a lifetime." },
        { title: "Community", description: "You never train alone. Our members push each other to new limits daily." },
        { title: "Results", description: "Every program is measured, tracked and optimized for real outcomes." },
      ],
    },
    update: {},
  });

  const statistics = [
    { label: "Years Established", value: 12, suffix: "+", icon: "Calendar" },
    { label: "Active Members", value: 2400, suffix: "+", icon: "Users" },
    { label: "Expert Trainers", value: 18, suffix: "", icon: "Award" },
    { label: "Weekly Classes", value: 65, suffix: "+", icon: "CalendarDays" },
    { label: "Locations", value: 3, suffix: "", icon: "MapPin" },
  ];
  for (const [i, s] of statistics.entries()) {
    await prisma.statistic.create({ data: { ...s, order: i } });
  }

  // ---------------------------------------------------------------------
  // Trainers
  // ---------------------------------------------------------------------
  const trainerData = [
    {
      name: "Marcus Bell",
      slug: "marcus-bell",
      image: img(PHOTOS.portraitM1, 800),
      position: "Head Strength Coach",
      specialization: ["Strength Training", "Olympic Lifting"],
      bio: "Marcus has spent a decade coaching competitive powerlifters and everyday athletes alike. His programming philosophy blends raw strength work with joint-friendly mechanics built for longevity.",
      experienceYears: 10,
      certifications: ["NASM-CPT", "USA Weightlifting L2", "CSCS"],
      instagram: "https://instagram.com/marcusbell",
    },
    {
      name: "Sofia Ramirez",
      slug: "sofia-ramirez",
      image: img(PHOTOS.portraitF1, 800),
      position: "HIIT & Conditioning Coach",
      specialization: ["HIIT", "Metabolic Conditioning"],
      bio: "Sofia designs high-intensity programs that torch fat without sacrificing muscle. Her classes are famous for pushing members past plateaus in a supportive, high-energy environment.",
      experienceYears: 7,
      certifications: ["ACE-CPT", "Precision Nutrition L1"],
      instagram: "https://instagram.com/sofiaramirez",
    },
    {
      name: "Jamal Carter",
      slug: "jamal-carter",
      image: img(PHOTOS.portraitM4, 800),
      position: "Boxing Coach",
      specialization: ["Boxing", "Footwork & Conditioning"],
      bio: "A former amateur boxer, Jamal brings ring-tested technique to every session — building fighters and fitness enthusiasts with equal precision and intensity.",
      experienceYears: 9,
      certifications: ["USA Boxing Certified Coach", "CPR/AED"],
      youtube: "https://youtube.com/@jamalcarterboxing",
    },
    {
      name: "Elena Novak",
      slug: "elena-novak",
      image: img(PHOTOS.portraitF2, 800),
      position: "Yoga & Mobility Coach",
      specialization: ["Yoga", "Mobility", "Recovery"],
      bio: "Elena's background in physical therapy shapes her approach to mobility — helping members move better, recover faster and prevent the injuries that sideline progress.",
      experienceYears: 8,
      certifications: ["RYT-500", "FRC Mobility Specialist"],
      instagram: "https://instagram.com/elenanovakyoga",
    },
    {
      name: "Diego Torres",
      slug: "diego-torres",
      image: img(PHOTOS.portraitM5, 800),
      position: "Functional & Cross Training Coach",
      specialization: ["Functional Training", "Cross Training"],
      bio: "Diego coaches athletic, full-body movement patterns that translate directly to real-world strength and performance — no machines required.",
      experienceYears: 6,
      certifications: ["CF-L2", "NASM-CPT"],
      facebook: "https://facebook.com/diegotorrescoach",
    },
    {
      name: "Amara Johnson",
      slug: "amara-johnson",
      image: img(PHOTOS.portraitF3, 800),
      position: "Personal Training Director",
      specialization: ["Personal Training", "Weight Loss", "Muscle Building"],
      bio: "Amara leads our personal training team, building fully customized programs for members chasing specific, measurable transformations.",
      experienceYears: 12,
      certifications: ["NASM-CPT", "ISSA Master Trainer"],
      instagram: "https://instagram.com/amarajohnsonfit",
      twitter: "https://x.com/amarajohnsonfit",
    },
  ];

  const trainers = [];
  for (const [i, t] of trainerData.entries()) {
    trainers.push(
      await prisma.trainer.create({
        data: { ...t, order: i, isFeatured: i < 4 },
      })
    );
  }

  // ---------------------------------------------------------------------
  // Programs
  // ---------------------------------------------------------------------
  const programData = [
    {
      name: "Strength Training",
      slug: "strength-training",
      description:
        "Build raw, functional strength with progressive overload programming rooted in proven barbell and compound movement principles. Every block is periodized to keep you progressing safely toward bigger lifts and a more resilient body.",
      shortDescription: "Progressive barbell programming for real, measurable strength gains.",
      image: img(PHOTOS.strength1, 1200),
      icon: "Dumbbell",
      category: "Strength",
      duration: "60 min",
      difficulty: "INTERMEDIATE" as const,
      trainerId: trainers[0].id,
      isFeatured: true,
    },
    {
      name: "HIIT",
      slug: "hiit",
      description:
        "High-Intensity Interval Training sessions that combine explosive cardio bursts with strength intervals to maximize calorie burn and cardiovascular capacity in minimal time.",
      shortDescription: "Explosive interval training built to torch calories fast.",
      image: img(PHOTOS.gymAction1, 1200),
      icon: "Flame",
      category: "Conditioning",
      duration: "45 min",
      difficulty: "ALL_LEVELS" as const,
      trainerId: trainers[1].id,
      isFeatured: true,
    },
    {
      name: "Functional Training",
      slug: "functional-training",
      description:
        "Multi-planar, athletic movement patterns that build strength, balance and coordination that carries directly into real-world performance and daily life.",
      shortDescription: "Athletic, full-body movement that builds real-world strength.",
      image: img(PHOTOS.gymAction2, 1200),
      icon: "Activity",
      category: "Functional",
      duration: "50 min",
      difficulty: "ALL_LEVELS" as const,
      trainerId: trainers[4].id,
      isFeatured: true,
    },
    {
      name: "Boxing",
      slug: "boxing",
      description:
        "Learn authentic boxing technique — footwork, combinations, defense — in a high-energy environment that builds cardio, coordination and confidence.",
      shortDescription: "Ring-tested technique meets a serious cardio workout.",
      image: img(PHOTOS.boxing1, 1200),
      icon: "Zap",
      category: "Combat",
      duration: "55 min",
      difficulty: "ALL_LEVELS" as const,
      trainerId: trainers[2].id,
      isFeatured: true,
    },
    {
      name: "Personal Training",
      slug: "personal-training",
      description:
        "Fully customized 1-on-1 coaching built around your specific goals, schedule and starting point — with programming, nutrition guidance and accountability built in.",
      shortDescription: "Fully customized 1-on-1 coaching for your specific goals.",
      image: img(PHOTOS.gymAction3, 1200),
      icon: "UserCheck",
      category: "1-on-1",
      duration: "60 min",
      difficulty: "ALL_LEVELS" as const,
      trainerId: trainers[5].id,
    },
    {
      name: "Cross Training",
      slug: "cross-training",
      description:
        "Constantly varied, high-intensity functional movements performed at a competitive pace — the ultimate test of strength, endurance and mental grit.",
      shortDescription: "Constantly varied training for total athletic performance.",
      image: img(PHOTOS.gymAction4, 1200),
      icon: "Layers",
      category: "Cross Training",
      duration: "50 min",
      difficulty: "ADVANCED" as const,
      trainerId: trainers[4].id,
    },
    {
      name: "Yoga",
      slug: "yoga",
      description:
        "Restorative and power yoga flows designed to build flexibility, core control and mental clarity — the perfect complement to high-intensity training.",
      shortDescription: "Restorative flows that build flexibility and mental clarity.",
      image: img(PHOTOS.yoga1, 1200),
      icon: "PersonStanding",
      category: "Recovery",
      duration: "45 min",
      difficulty: "ALL_LEVELS" as const,
      trainerId: trainers[3].id,
    },
    {
      name: "Mobility",
      slug: "mobility",
      description:
        "Targeted joint and tissue work that improves range of motion, reduces injury risk and accelerates recovery between hard training sessions.",
      shortDescription: "Targeted joint work that keeps you training injury-free.",
      image: img(PHOTOS.yoga2, 1200),
      icon: "HeartPulse",
      category: "Recovery",
      duration: "30 min",
      difficulty: "BEGINNER" as const,
      trainerId: trainers[3].id,
    },
    {
      name: "Weight Loss",
      slug: "weight-loss",
      description:
        "A structured combination of metabolic conditioning, strength work and nutrition coaching engineered specifically for sustainable fat loss.",
      shortDescription: "Structured training and nutrition coaching for lasting fat loss.",
      image: img(PHOTOS.gymAction5, 1200),
      icon: "Target",
      category: "Transformation",
      duration: "50 min",
      difficulty: "ALL_LEVELS" as const,
      trainerId: trainers[5].id,
    },
    {
      name: "Muscle Building",
      slug: "muscle-building",
      description:
        "Hypertrophy-focused programming using proven volume and intensity techniques to pack on lean, functional muscle mass.",
      shortDescription: "Hypertrophy programming built to pack on lean muscle.",
      image: img(PHOTOS.gymAction6, 1200),
      icon: "Trophy",
      category: "Hypertrophy",
      duration: "60 min",
      difficulty: "INTERMEDIATE" as const,
      trainerId: trainers[0].id,
    },
  ];

  const programs = [];
  for (const [i, p] of programData.entries()) {
    programs.push(await prisma.program.create({ data: { ...p, order: i } }));
  }

  // ---------------------------------------------------------------------
  // Membership Plans
  // ---------------------------------------------------------------------
  const plans = [
    {
      name: "Basic",
      price: 49,
      billingPeriod: "MONTHLY" as const,
      description: "Everything you need to get started.",
      features: [
        "Unlimited gym floor access",
        "Free fitness assessment",
        "Access to locker rooms & showers",
        "Mobile app with workout tracking",
      ],
      order: 0,
    },
    {
      name: "Standard",
      price: 89,
      billingPeriod: "MONTHLY" as const,
      description: "Our most popular plan for serious progress.",
      features: [
        "Everything in Basic",
        "Unlimited group classes",
        "1 personal training session / month",
        "Nutrition guidance check-ins",
        "Guest passes (2 / month)",
      ],
      badge: "Most Popular",
      isFeatured: true,
      order: 1,
    },
    {
      name: "Premium",
      price: 149,
      billingPeriod: "MONTHLY" as const,
      description: "The complete performance experience.",
      features: [
        "Everything in Standard",
        "4 personal training sessions / month",
        "Custom program design",
        "Recovery zone priority access",
        "Unlimited guest passes",
        "Dedicated coach check-ins",
      ],
      order: 2,
    },
  ];
  for (const plan of plans) {
    await prisma.membershipPlan.create({ data: plan });
  }

  // ---------------------------------------------------------------------
  // Class Schedule
  // ---------------------------------------------------------------------
  const schedule: {
    className: string;
    programSlug: string;
    trainerIndex: number;
    dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
    startTime: string;
    endTime: string;
    room: string;
    difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
    capacity: number;
    booked: number;
  }[] = [
    { className: "Sunrise Strength", programSlug: "strength-training", trainerIndex: 0, dayOfWeek: "MONDAY", startTime: "06:00", endTime: "07:00", room: "Strength Zone", difficulty: "INTERMEDIATE", capacity: 16, booked: 12 },
    { className: "HIIT Ignite", programSlug: "hiit", trainerIndex: 1, dayOfWeek: "MONDAY", startTime: "07:30", endTime: "08:15", room: "Studio A", difficulty: "ALL_LEVELS", capacity: 20, booked: 19 },
    { className: "Boxing Fundamentals", programSlug: "boxing", trainerIndex: 2, dayOfWeek: "MONDAY", startTime: "18:00", endTime: "18:55", room: "Boxing Ring", difficulty: "ALL_LEVELS", capacity: 14, booked: 14 },
    { className: "Power Flow Yoga", programSlug: "yoga", trainerIndex: 3, dayOfWeek: "TUESDAY", startTime: "06:30", endTime: "07:15", room: "Recovery Studio", difficulty: "ALL_LEVELS", capacity: 18, booked: 9 },
    { className: "Functional Athlete", programSlug: "functional-training", trainerIndex: 4, dayOfWeek: "TUESDAY", startTime: "09:00", endTime: "09:50", room: "Functional Area", difficulty: "ALL_LEVELS", capacity: 16, booked: 11 },
    { className: "Evening Strength", programSlug: "strength-training", trainerIndex: 0, dayOfWeek: "TUESDAY", startTime: "19:00", endTime: "20:00", room: "Strength Zone", difficulty: "INTERMEDIATE", capacity: 16, booked: 8 },
    { className: "Cross Training WOD", programSlug: "cross-training", trainerIndex: 4, dayOfWeek: "WEDNESDAY", startTime: "06:00", endTime: "06:50", room: "Functional Area", difficulty: "ADVANCED", capacity: 14, booked: 13 },
    { className: "HIIT Ignite", programSlug: "hiit", trainerIndex: 1, dayOfWeek: "WEDNESDAY", startTime: "12:00", endTime: "12:45", room: "Studio A", difficulty: "ALL_LEVELS", capacity: 20, booked: 15 },
    { className: "Mobility Reset", programSlug: "mobility", trainerIndex: 3, dayOfWeek: "WEDNESDAY", startTime: "17:30", endTime: "18:00", room: "Recovery Studio", difficulty: "BEGINNER", capacity: 18, booked: 6 },
    { className: "Boxing Conditioning", programSlug: "boxing", trainerIndex: 2, dayOfWeek: "THURSDAY", startTime: "18:00", endTime: "18:55", room: "Boxing Ring", difficulty: "INTERMEDIATE", capacity: 14, booked: 10 },
    { className: "Strength Fundamentals", programSlug: "strength-training", trainerIndex: 0, dayOfWeek: "THURSDAY", startTime: "07:00", endTime: "08:00", room: "Strength Zone", difficulty: "BEGINNER", capacity: 16, booked: 7 },
    { className: "Fat Loss Circuit", programSlug: "weight-loss", trainerIndex: 5, dayOfWeek: "THURSDAY", startTime: "09:30", endTime: "10:20", room: "Studio B", difficulty: "ALL_LEVELS", capacity: 18, booked: 12 },
    { className: "Sunrise Yoga", programSlug: "yoga", trainerIndex: 3, dayOfWeek: "FRIDAY", startTime: "06:30", endTime: "07:15", room: "Recovery Studio", difficulty: "ALL_LEVELS", capacity: 18, booked: 8 },
    { className: "Hypertrophy Block", programSlug: "muscle-building", trainerIndex: 0, dayOfWeek: "FRIDAY", startTime: "17:00", endTime: "18:00", room: "Strength Zone", difficulty: "INTERMEDIATE", capacity: 16, booked: 14 },
    { className: "Friday Night Boxing", programSlug: "boxing", trainerIndex: 2, dayOfWeek: "FRIDAY", startTime: "19:00", endTime: "19:55", room: "Boxing Ring", difficulty: "ALL_LEVELS", capacity: 14, booked: 11 },
    { className: "Saturday Cross Training", programSlug: "cross-training", trainerIndex: 4, dayOfWeek: "SATURDAY", startTime: "09:00", endTime: "09:50", room: "Functional Area", difficulty: "ADVANCED", capacity: 14, booked: 9 },
    { className: "Weekend Warrior HIIT", programSlug: "hiit", trainerIndex: 1, dayOfWeek: "SATURDAY", startTime: "10:30", endTime: "11:15", room: "Studio A", difficulty: "ALL_LEVELS", capacity: 20, booked: 16 },
    { className: "Restorative Yoga", programSlug: "yoga", trainerIndex: 3, dayOfWeek: "SUNDAY", startTime: "10:00", endTime: "10:45", room: "Recovery Studio", difficulty: "BEGINNER", capacity: 18, booked: 5 },
  ];

  for (const item of schedule) {
    const program = programs.find((p) => p.slug === item.programSlug);
    await prisma.classSchedule.create({
      data: {
        className: item.className,
        programId: program?.id,
        trainerId: trainers[item.trainerIndex].id,
        dayOfWeek: item.dayOfWeek,
        startTime: item.startTime,
        endTime: item.endTime,
        room: item.room,
        difficulty: item.difficulty,
        capacity: item.capacity,
        booked: item.booked,
      },
    });
  }

  // ---------------------------------------------------------------------
  // Facilities
  // ---------------------------------------------------------------------
  const facilities = [
    { name: "Premium Equipment", description: "Top-of-the-line strength machines, free weights and cardio equipment from the industry's leading brands.", image: img(PHOTOS.equipment1), icon: "Dumbbell", isFeatured: true },
    { name: "Strength Zone", description: "A dedicated space with power racks, platforms and heavy iron for serious lifters.", image: img(PHOTOS.strength2), icon: "Trophy" },
    { name: "Cardio Zone", description: "Rows of treadmills, bikes and rowers with skyline views to keep your heart rate up.", image: img(PHOTOS.gymAction7), icon: "Activity" },
    { name: "Functional Training Area", description: "Open turf space for sleds, battle ropes, plyo boxes and athletic conditioning work.", image: img(PHOTOS.gymAction8), icon: "Layers" },
    { name: "Recovery Zone", description: "Stretching stations, foam rollers and mobility tools to keep you training pain-free.", image: img(PHOTOS.yoga2), icon: "HeartPulse" },
    { name: "Locker Rooms & Showers", description: "Spacious, spotless locker rooms with premium amenities and hot showers.", image: img(PHOTOS.equipment2), icon: "DoorOpen" },
    { name: "Sauna & Steam Room", description: "Unwind and recover with dedicated sauna and steam facilities after every session.", image: img(PHOTOS.gymAction3), icon: "ThermometerSun" },
    { name: "Personal Training Studio", description: "A private, semi-enclosed studio for focused 1-on-1 coaching sessions.", image: img(PHOTOS.gymAction5), icon: "UserCheck" },
  ];
  for (const [i, f] of facilities.entries()) {
    await prisma.facility.create({ data: { ...f, order: i } });
  }

  // ---------------------------------------------------------------------
  // Transformations
  // ---------------------------------------------------------------------
  const transformations = [
    { memberName: "David Chen", beforeImage: img(PHOTOS.portraitM6, 900), afterImage: img(PHOTOS.portraitM7, 900), duration: "6 Months", goal: "Fat Loss", story: "David came to us at 235 lbs looking to reclaim his energy and confidence. Through consistent strength training and a structured nutrition plan, he transformed both his body and his daily habits.", result: "Lost 38 lbs and reduced body fat by 12%." },
    { memberName: "Priya Nair", beforeImage: img(PHOTOS.portraitF4, 900), afterImage: img(PHOTOS.portraitF5, 900), duration: "8 Months", goal: "Strength", story: "Priya walked in unable to do a single push-up. Eight months of dedicated coaching later, she's deadlifting 1.5x her bodyweight and mentoring new members.", result: "Deadlift PR of 185 lbs, first pull-up achieved." },
    { memberName: "Marcus Webb", beforeImage: img(PHOTOS.portraitM8, 900), afterImage: img(PHOTOS.portraitM2, 900), duration: "1 Year", goal: "Muscle Gain", story: "A dedicated hypertrophy block and disciplined nutrition helped Marcus add serious, functional muscle while staying lean year-round.", result: "Gained 22 lbs of lean muscle mass." },
    { memberName: "Grace Kim", beforeImage: img(PHOTOS.portraitF2, 900), afterImage: img(PHOTOS.portraitF1, 900), duration: "5 Months", goal: "Weight Loss", story: "Grace combined our HIIT program with weekly nutrition coaching to completely change her relationship with fitness — and the scale.", result: "Lost 29 lbs and now runs her first 10K." },
    { memberName: "Anthony Reyes", beforeImage: img(PHOTOS.portraitM3, 900), afterImage: img(PHOTOS.portraitM1, 900), duration: "10 Months", goal: "Body Recomposition", story: "Anthony wanted to lose fat and gain muscle at the same time. A carefully periodized program made it happen.", result: "Lost 15 lbs of fat while gaining 10 lbs of muscle." },
  ];
  for (const [i, t] of transformations.entries()) {
    await prisma.transformation.create({ data: { ...t, order: i, isFeatured: i < 3 } });
  }

  // ---------------------------------------------------------------------
  // Testimonials
  // ---------------------------------------------------------------------
  const testimonials = [
    { name: "David Chen", image: img(PHOTOS.portraitM7, 400), rating: 5, content: "Apex Athletic completely changed my life. The coaches actually care about your progress, not just your membership fee. Best gym I've ever trained at.", membership: "Premium Member" },
    { name: "Priya Nair", image: img(PHOTOS.portraitF5, 400), rating: 5, content: "I was intimidated to walk in the first day. Now I can't imagine my week without this place. The community here is unreal.", membership: "Standard Member" },
    { name: "James Whitfield", image: img(PHOTOS.portraitM4, 400), rating: 5, content: "The programming is next level. I've hit more PRs in six months here than in three years at my old gym.", membership: "Premium Member" },
    { name: "Grace Kim", image: img(PHOTOS.portraitF1, 400), rating: 5, content: "The HIIT classes with Sofia are brutal in the best way. I've lost weight, gained energy, and made real friends.", membership: "Standard Member" },
    { name: "Marcus Webb", image: img(PHOTOS.portraitM2, 400), rating: 4, content: "Clean facility, great equipment, and the personal training program is worth every penny.", membership: "Premium Member" },
    { name: "Anthony Reyes", image: img(PHOTOS.portraitM1, 400), rating: 5, content: "Best decision I made this year. The trainers actually listen and adjust your program as you progress.", membership: "Basic Member" },
    { name: "Olivia Bennett", image: img(PHOTOS.portraitF3, 400), rating: 5, content: "Elena's yoga classes are the perfect complement to my strength training. This place thinks of everything.", membership: "Standard Member" },
  ];
  for (const [i, t] of testimonials.entries()) {
    await prisma.testimonial.create({ data: { ...t, order: i, isFeatured: i < 6 } });
  }

  // ---------------------------------------------------------------------
  // Gallery
  // ---------------------------------------------------------------------
  const galleryData: { image: string; category: "GYM" | "EQUIPMENT" | "TRAINING" | "CLASSES" | "TRAINERS" | "EVENTS" | "LIFESTYLE"; caption: string }[] = [
    { image: img(PHOTOS.gymFloor1), category: "GYM", caption: "Main training floor" },
    { image: img(PHOTOS.gymFloor2), category: "GYM", caption: "Strength zone at golden hour" },
    { image: img(PHOTOS.equipment1), category: "EQUIPMENT", caption: "Premium free weight rack" },
    { image: img(PHOTOS.equipment2), category: "EQUIPMENT", caption: "Cardio equipment lineup" },
    { image: img(PHOTOS.strength1), category: "TRAINING", caption: "Heavy squat session" },
    { image: img(PHOTOS.strength2), category: "TRAINING", caption: "Deadlift day" },
    { image: img(PHOTOS.strength3), category: "TRAINING", caption: "Barbell work" },
    { image: img(PHOTOS.gymAction1), category: "CLASSES", caption: "HIIT class in session" },
    { image: img(PHOTOS.gymAction2), category: "CLASSES", caption: "Functional training group" },
    { image: img(PHOTOS.boxing1), category: "CLASSES", caption: "Boxing fundamentals" },
    { image: img(PHOTOS.boxing2), category: "CLASSES", caption: "Heavy bag work" },
    { image: img(PHOTOS.yoga1), category: "CLASSES", caption: "Power flow yoga" },
    { image: img(PHOTOS.portraitM1, 900), category: "TRAINERS", caption: "Coach Marcus Bell" },
    { image: img(PHOTOS.portraitF1, 900), category: "TRAINERS", caption: "Coach Sofia Ramirez" },
    { image: img(PHOTOS.portraitM4, 900), category: "TRAINERS", caption: "Coach Jamal Carter" },
    { image: img(PHOTOS.gymAction3, 1200), category: "EVENTS", caption: "Community deadlift challenge" },
    { image: img(PHOTOS.gymAction4, 1200), category: "EVENTS", caption: "Member appreciation night" },
    { image: img(PHOTOS.running, 1200), category: "LIFESTYLE", caption: "Morning run club" },
    { image: img(PHOTOS.yoga2, 1200), category: "LIFESTYLE", caption: "Recovery and mobility" },
    { image: img(PHOTOS.gymAction6, 1200), category: "LIFESTYLE", caption: "Post-workout high five" },
  ];
  for (const [i, g] of galleryData.entries()) {
    await prisma.galleryItem.create({
      data: { ...g, altText: g.caption, order: i, isFeatured: i < 6 },
    });
  }

  // ---------------------------------------------------------------------
  // FAQs
  // ---------------------------------------------------------------------
  const faqs = [
    { question: "Do I need to sign a long-term contract?", answer: "No. All of our memberships are month-to-month with no long-term commitment required. Cancel anytime with 30 days notice." },
    { question: "Can I try Apex Athletic before joining?", answer: "Yes — book a free tour and trial class through our contact page. We'll walk you through the facility and pair you with a coach." },
    { question: "What should I bring to my first class?", answer: "Just comfortable workout clothes, athletic shoes and a water bottle. We provide all equipment, towels and locker access." },
    { question: "Do you offer nutrition coaching?", answer: "Yes, our Standard and Premium plans include nutrition check-ins, and our Personal Training Director can build a fully custom nutrition plan." },
    { question: "Is Apex Athletic beginner-friendly?", answer: "Absolutely. Every program has modifications for all fitness levels, and our coaches specialize in meeting you exactly where you are." },
    { question: "What are your busiest hours?", answer: "Early mornings (5–8am) and evenings (5–8pm) tend to be busiest. Midday and late evening are great times for a quieter session." },
    { question: "Can I freeze my membership?", answer: "Yes, memberships can be paused for up to 3 months per year for travel, injury or other life events — just reach out to our team." },
  ];
  for (const [i, f] of faqs.entries()) {
    await prisma.fAQ.create({ data: { ...f, order: i } });
  }

  // ---------------------------------------------------------------------
  // Why Choose Us
  // ---------------------------------------------------------------------
  const whyChooseUs = [
    { title: "Expert Trainers", description: "Every coach is certified, experienced and genuinely invested in your progress.", icon: "Award", image: img(PHOTOS.portraitM1, 1200) },
    { title: "Premium Equipment", description: "Top-tier strength and cardio equipment maintained to the highest standard.", icon: "Dumbbell", image: img(PHOTOS.equipment1, 1200) },
    { title: "Personalized Programs", description: "No cookie-cutter plans — every program is built around your specific goals.", icon: "Target", image: img(PHOTOS.gymAction3, 1200) },
    { title: "Modern Facilities", description: "A clean, spacious, thoughtfully designed space built for serious training.", icon: "Building2", image: img(PHOTOS.gymFloor1, 1200) },
    { title: "Flexible Memberships", description: "No long-term contracts. Just transparent pricing and real flexibility.", icon: "ShieldCheck", image: img(PHOTOS.strength2, 1200) },
    { title: "Results-Driven Community", description: "Join a community that shows up, pushes hard and celebrates every win.", icon: "Trophy", image: img(PHOTOS.gymAction1, 1200) },
  ];
  for (const [i, w] of whyChooseUs.entries()) {
    await prisma.whyChooseUsItem.create({ data: { ...w, order: i } });
  }

  // ---------------------------------------------------------------------
  // CTA
  // ---------------------------------------------------------------------
  await prisma.cTASection.upsert({
    where: { id: SINGLETON_ID },
    create: {
      id: SINGLETON_ID,
      heading: "YOUR NEXT LEVEL",
      headingHighlight: "STARTS TODAY",
      description:
        "No contracts. No excuses. Just a free tour, a real training plan, and a team that will not let you settle for average.",
      backgroundImage: img(PHOTOS.ctaBg, 2400),
    },
    update: {},
  });

  // ---------------------------------------------------------------------
  // Contact Messages (sample inbox)
  // ---------------------------------------------------------------------
  const messages = [
    { name: "Rachel Adams", email: "rachel.adams@example.com", phone: "+1 (512) 555-0110", message: "Hi! I'm interested in the Premium plan — do you offer a free trial week before committing?", isRead: false },
    { name: "Tom Nguyen", email: "tom.nguyen@example.com", phone: "+1 (512) 555-0122", message: "What's the earliest boxing class you offer on weekdays? I work early mornings.", isRead: false },
    { name: "Sarah Patel", email: "sarah.patel@example.com", phone: null, message: "Do you have any group corporate membership packages for a team of 10?", isRead: true },
    { name: "Michael Ortiz", email: "michael.ortiz@example.com", phone: "+1 (512) 555-0134", message: "Looking to book a tour this weekend, is Saturday morning available?", isRead: true },
  ];
  for (const m of messages) {
    await prisma.contactMessage.create({ data: m });
  }

  // ---------------------------------------------------------------------
  // Newsletter subscribers
  // ---------------------------------------------------------------------
  for (const email of ["newsletter.fan@example.com", "fitness.reader@example.com"]) {
    await prisma.newsletterSubscriber.upsert({ where: { email }, create: { email }, update: {} });
  }

  // ---------------------------------------------------------------------
  // Activity log (seed a few entries so the dashboard isn't empty)
  // ---------------------------------------------------------------------
  const activityEntries = [
    { action: "CREATE", entityType: "Program", description: `${superAdmin.name} created program "Strength Training"` },
    { action: "CREATE", entityType: "Trainer", description: `${superAdmin.name} added trainer "Marcus Bell"` },
    { action: "UPDATE", entityType: "HeroSection", description: `${superAdmin.name} updated the hero section` },
    { action: "CREATE", entityType: "MembershipPlan", description: `${superAdmin.name} created membership plan "Standard"` },
  ];
  for (const entry of activityEntries) {
    await prisma.activityLog.create({ data: { ...entry, userId: superAdmin.id } });
  }

  console.log("Seed complete.");
  console.log("");
  console.log("Admin login: admin@apexathletic.com / Password123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
