import { prisma } from "../lib/prisma.js";
import { Employee } from "../types/employee.type.js";

const departments = [
  "Engineering",
  "HR",
  "Finance",
  "Marketing",
  "Sales"
];

const roles = [
  "Junior Developer",
  "Senior Developer",
  "Team Lead",
  "Manager",
  "Analyst",
  "HR Executive",
  "Product Manager"
];

const cities = [
  { city: "San Francisco", state: "CA", country: "USA" },
  { city: "New York", state: "NY", country: "USA" },
  { city: "Austin", state: "TX", country: "USA" },
  { city: "Seattle", state: "WA", country: "USA" },
  { city: "Chicago", state: "IL", country: "USA" }
];

const skillPool = [
  "React",
  "TypeScript",
  "Node.js",
  "GraphQL",
  "AWS",
  "Docker",
  "Kubernetes",
  "Python",
  "SQL",
  "Next.js"
];

const randomFromArray = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const randomSkills = () => {
  const shuffled = [...skillPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 4) + 2);
};

const randomDate = (start: Date, end: Date) =>
  new Date(
    start.getTime() +
      Math.random() * (end.getTime() - start.getTime())
  );

export const employees: Employee[] = Array.from(
  { length: 60 },
  (_, i) => {
    const department = randomFromArray(departments);
    const city = randomFromArray(cities);

    const baseSalary =
      department === "Engineering"
        ? 90000
        : department === "Finance"
        ? 80000
        : department === "Marketing"
        ? 70000
        : department === "Sales"
        ? 65000
        : 60000;

    const salary =
      baseSalary +
      Math.floor(Math.random() * 40000);

    const joinDate = randomDate(
      new Date(2018, 0, 1),
      new Date(2023, 11, 31)
    );

    const lastReview = randomDate(
      new Date(2023, 0, 1),
      new Date(2025, 0, 1)
    );

    return {
      id: `emp_${i + 1}`,
      name: `Employee ${i + 1}`,
      email: `employee${i + 1}@company.com`,
      department,
      role: randomFromArray(roles),
      salary,
      joinDate,
      isActive: Math.random() > 0.2,
      skills: randomSkills(),
      city: city.city,
      state: city.state,
      country: city.country,
      projects: Math.floor(Math.random() * 8) + 1,
      lastReview,
      performanceRating:
        Math.round((Math.random() * 2 + 3) * 10) / 10 // 3.0 – 5.0
    };
  }
);

async function main() {
  console.log("Seeding data...");

  await prisma.employee.createMany({
    data: employees.map((emp) => ({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      role: emp.role,
      salary: emp.salary,
      joinDate: new Date(emp.joinDate),
      isActive: emp.isActive,
      skills: emp.skills,
      city: emp.city,
      state: emp.state,
      country: emp.country,
      projects: emp.projects,
      lastReview: new Date(emp.lastReview),
      performanceRating: emp.performanceRating
    }))
  });

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });