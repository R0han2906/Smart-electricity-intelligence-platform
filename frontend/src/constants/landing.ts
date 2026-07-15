import { UserPlus, Users } from "lucide-react";
import { ROUTES } from './routes';
export const LANDING_OPTIONS = [
  {
    title: "Create New Profile",
    description: "Start tracking your electricity usage from scratch.",
    icon: UserPlus,
    colorClasses: "bg-teal-50 text-teal-600 group-hover:bg-teal-100",
    path: ROUTES.CREATE_USER,
  },
  {
    title: "Select Existing",
    description: "Continue with an existing tracking profile.",
    icon: Users,
    colorClasses: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
    path: ROUTES.SELECT_USER,
  },
];