import { Link } from "react-router-dom";

type NavItemProps = {
  to: string;
  children: React.ReactNode;
};

export default function NavItem({ to, children }: NavItemProps) {
  return (
    <Link
      to={to}
      className="
        relative
        px-5
        py-2
       text-orange-900
       
        group
        font-sans
       "
    >
      {children}

      {/* Top line */}
      <span
        className="
          absolute
    left-0
    top-0
    h-[2px]
    w-full
    bg-cyan-400
    shadow-[0_0_12px_#22d3ee]
    origin-left
    scale-x-0
    transition-transform
    duration-300
    group-hover:scale-x-100
        "
      />

      {/* Bottom line */}
      <span
        className="
    absolute
    right-0
    bottom-0
    h-[2px]
    w-full
    bg-pink-500
    shadow-[0_0_12px_#ec4899]
    origin-right
    scale-x-0
    transition-transform
    duration-300
    group-hover:scale-x-100
        "
      />
    </Link>
  );
}
