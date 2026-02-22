export interface Address {
  city: string;
  state: string;
  country: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  joinDate: Date;
  isActive: boolean;
  skills: string[];
  city: string;
  state: string;
  country: string;
  projects: number;
  lastReview: Date;
  performanceRating: number;
}