import type { ReactNode } from "react";
import logoImage from "@/assets/metrolane-logo.png";

type AuthHeaderProps = {
  title: string;
  description: string;
  badge?: ReactNode;
};

export function AuthHeader({ title, description, badge }: AuthHeaderProps) {
  return (
    <div className="space-y-4 text-center lg:text-left">
      <div className="flex flex-col items-center gap-3 lg:flex-row lg:items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 shadow-md shadow-orange-500/20">
          <img
            src={logoImage}
            alt="Metrolane logo"
            className="h-7 w-7 object-contain"
          />
        </div>
        <div className="min-w-0 text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">
            METROLANE
          </p>
          <p className="text-xs leading-snug text-gray-500">
            College of Health Sciences and Technology
          </p>
        </div>
      </div>

      {badge}

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          {title}
        </h1>
        <p className="text-sm leading-relaxed text-gray-500">{description}</p>
      </div>
    </div>
  );
}
