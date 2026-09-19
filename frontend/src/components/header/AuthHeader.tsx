import { Icon, type LucideIcon } from "lucide-react";
import Logo from "./Logo";

interface AuthHeaderProps {
  statusText: string;
  contextIcon: LucideIcon;
}

const AuthHeader = ({ contextIcon: Icon, statusText }: AuthHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs px-6 py-4 transition-all ">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo />
        </div>

        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-linear-to-r from-sky-50 to-emerald-50 border border-sky-100/80 shadow-xs">
          <div className="p-1 rounded-full bg-white text-emerald-600 shadow-xs ">
            <Icon className="h-4 w-4" />
          </div>
          <span className="text-xs md:text-sm font-semibold bg-linear-to-r from-sky-950 to-emerald-950 bg-clip-text text-transparent">
            {statusText}
          </span>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
