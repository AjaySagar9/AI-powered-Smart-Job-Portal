import { PrismaClient, Role, JobStatus, EmploymentType, WorkMode } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Create a Company
  let company = await prisma.company.findFirst({
    where: { name: 'Tech Innovations Inc.' },
  });

  if (!company) {
    company = await prisma.company.create({
      data: {
        name: 'Tech Innovations Inc.',
        description: 'A leading tech company building cutting-edge cloud and AI solutions.',
        website: 'https://techinnovations.example.com',
        location: 'San Francisco, CA',
      },
    });
    console.log(`Created company: ${company.name}`);
  }

  // 2. Create Admin
  const adminEmail = 'admin@jobportal.local';
  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!admin) {
    const adminPassword = await bcrypt.hash('admin123', 10);
    admin = await prisma.user.create({
      data: {
        name: 'System Admin',
        email: adminEmail,
        password: adminPassword,
        role: Role.ADMIN,
      },
    });
    console.log(`Created admin user: ${admin.email}`);
  }

  // 3. Create Recruiter
  const recruiterEmail = 'alice@techinnovations.example.com';
  let recruiter = await prisma.user.findUnique({
    where: { email: recruiterEmail },
    include: { recruiterProfile: true },
  });

  if (!recruiter) {
    const recruiterPassword = await bcrypt.hash('recruiter123', 10);
    recruiter = await prisma.user.create({
      data: {
        name: 'Alice Recruiter',
        email: recruiterEmail,
        password: recruiterPassword,
        role: Role.RECRUITER,
        recruiterProfile: {
          create: {
            companyId: company.id,
            position: 'Senior Technical Recruiter',
          },
        },
      },
      include: { recruiterProfile: true },
    });
    console.log(`Created recruiter user: ${recruiter.email}`);
  }

  // 4. Create Candidate
  const candidateEmail = 'bob@example.com';
  let candidate = await prisma.user.findUnique({ where: { email: candidateEmail } });
  if (!candidate) {
    const candidatePassword = await bcrypt.hash('candidate123', 10);
    candidate = await prisma.user.create({
      data: {
        name: 'Bob Candidate',
        email: candidateEmail,
        password: candidatePassword,
        role: Role.CANDIDATE,
        candidateProfile: {
          create: {
            headline: 'Full Stack React & Node.js Developer',
            skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
            bio: 'Passionate developer building scalable web applications.',
            experienceYears: 3,
          },
        },
      },
    });
    console.log(`Created candidate user: ${candidate.email}`);
  }

  // 5. Seed Published Jobs if not existing
  if (recruiter.recruiterProfile) {
    const existingJobsCount = await prisma.job.count({
      where: { recruiterId: recruiter.recruiterProfile.id },
    });

    if (existingJobsCount === 0) {
      await prisma.job.createMany({
        data: [
          {
            title: 'Senior Full Stack Engineer',
            description:
              'We are seeking an experienced Full Stack Engineer to lead the development of our high-scale enterprise platform. You will design, build, and maintain frontend apps with React and microservices with Node.js/PostgreSQL.',
            location: 'San Francisco, CA',
            employmentType: EmploymentType.FULL_TIME,
            workMode: WorkMode.HYBRID,
            status: JobStatus.PUBLISHED,
            experienceMin: 4,
            experienceMax: 8,
            salaryMin: 120000,
            salaryMax: 160000,
            skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'GraphQL', 'Docker'],
            qualification: "Bachelor's or Master's in Computer Science or equivalent experience",
            responsibilities: [
              'Architect and scale cloud-native web applications',
              'Collaborate with product managers and designers',
              'Mentor junior and mid-level engineers',
              'Maintain rigorous test coverage and CI/CD pipelines',
            ],
            benefits: [
              'Competitive equity and 401(k) matching',
              'Comprehensive health, dental, and vision insurance',
              'Annual learning and conference budget ($2,500)',
              'Flexible paid time off',
            ],
            applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            companyId: company.id,
            recruiterId: recruiter.recruiterProfile.id,
          },
          {
            title: 'Frontend React Developer',
            description:
              'Join our UI/UX team to craft intuitive, pixel-perfect user interfaces using React, TypeScript, and modern styling libraries.',
            location: 'Remote',
            employmentType: EmploymentType.FULL_TIME,
            workMode: WorkMode.REMOTE,
            status: JobStatus.PUBLISHED,
            experienceMin: 2,
            experienceMax: 5,
            salaryMin: 90000,
            salaryMax: 120000,
            skills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux/Zustand', 'Next.js'],
            qualification: '2+ years working with modern frontend frameworks',
            responsibilities: [
              'Develop responsive, accessible web components',
              'Optimize application performance and bundle size',
              'Work closely with UI/UX designers to translate Figma into code',
            ],
            benefits: [
              '100% remote work flexibility',
              'Home office setup stipend ($1,000)',
              'Health and wellness stipend',
            ],
            applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
            companyId: company.id,
            recruiterId: recruiter.recruiterProfile.id,
          },
          {
            title: 'Backend Node.js / Prisma Architect',
            description:
              'We are looking for a Backend Specialist with deep expertise in database query optimization, REST/GraphQL APIs, and transactional integrity.',
            location: 'New York, NY',
            employmentType: EmploymentType.CONTRACT,
            workMode: WorkMode.HYBRID,
            status: JobStatus.PUBLISHED,
            experienceMin: 5,
            experienceMax: 10,
            salaryMin: 140000,
            salaryMax: 180000,
            skills: ['Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Redis', 'AWS'],
            qualification: 'Strong track record building backend architectures',
            responsibilities: [
              'Design resilient database models and migration strategies',
              'Implement secure authentication and role-based permissions',
              'Tune SQL query performance and cache layer',
            ],
            benefits: [
              'Competitive hourly/contract rate',
              'Option to convert to full-time',
              'State-of-the-art developer hardware',
            ],
            applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
            companyId: company.id,
            recruiterId: recruiter.recruiterProfile.id,
          },
          {
            title: 'Software Engineer Intern (Summer 2026)',
            description:
              'Exciting 3-month paid internship program for aspiring software engineers to work on real-world production systems alongside experienced mentors.',
            location: 'Austin, TX',
            employmentType: EmploymentType.INTERNSHIP,
            workMode: WorkMode.ONSITE,
            status: JobStatus.PUBLISHED,
            experienceMin: 0,
            experienceMax: 1,
            salaryMin: 45000,
            salaryMax: 60000,
            skills: ['JavaScript', 'React', 'HTML/CSS', 'Git'],
            qualification: 'Currently enrolled in Computer Science or related degree',
            responsibilities: [
              'Contribute to feature development and bug fixes',
              'Participate in agile sprints and daily standups',
              'Present an end-of-internship capstone project',
            ],
            benefits: [
              'Full mentorship program',
              'Housing assistance stipend',
              'Intern social events and networking',
            ],
            applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            companyId: company.id,
            recruiterId: recruiter.recruiterProfile.id,
          },
        ],
      });
      console.log('Seeded initial published jobs for Alice Recruiter.');
    }
  }

  console.log('Seeding finished successfully.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
