import { ReactNode } from "react";
import { UserPlus, Users } from "lucide-react";
import { LucideIcon } from "lucide-react";
import Card from "../Card";

interface LandingOptionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  colorClasses: string;
}

const LandingOptionCard = ({
  icon,
  title,
  description,
  onClick,
  colorClasses,
}: LandingOptionCardProps) => {
  const Icon = icon;
  return (
    <Card hoverable className="group p-1">
      <div
        className="p-6 h-full flex flex-col items-center text-center space-y-4 cursor-pointer"
        onClick={onClick}
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${colorClasses}`}
        >
         <Icon className="w-6 h-6" />
        </div>

        <div>
          <h3 className="font-semibold text-slate-900 tracking-tight">
            {title}
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default LandingOptionCard;