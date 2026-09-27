import type { LucideIcon } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  statusText: string;
  icon?: LucideIcon;
}

const DashboardHeader = ({
  statusText,
  title,
  icon: Icon,
  subtitle,
}: HeaderProps) => {
  return (
    <header className="bg-white/85 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-sky-100/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between ">
        <div className="flex  items-center space-x-3.5">
          <div className="grid grid-cols-2 gap-1 p-2 rounded-xl bg-sky-50/80 border border-sky-100 ">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-sky-300" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <div className="flex flex-col">
            <h2 className=" text-2xl font-black bg-linear-to-r from-sky-500  to-sky-900 bg-clip-text text-transparent tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs font-medium text-sky-900/60 tracking-wide mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {statusText && (
          <div className="hidden sm:flex items-center space-x-2.5 bg-linear-to-r from-emerald-50/80 via-sky-50/50 to-white px-4 py-2 rounded-full border border-sky-100 shadow-sm">
            {Icon && <Icon className="w-4 h-4 text-emerald-600" />}
            <span className="text-xs font-bold text-sky-900/80 tracking-wide uppercase">
              {statusText}
            </span>
          </div>
        )}
      </div>
      <div className="h-[2px] w-full bg-linear-to-r from-transparent via-emerald-500/25 to-transparent" />
    </header>
  );
};

export default DashboardHeader;
