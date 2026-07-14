import { useState } from "react";
import { Navigation } from "../Navbar";
import HeaderActions from "./HeaderActions";
import Logo from "./Logo";

interface Props {
  showNavigation: boolean;
}

const AppHeader = ({ showNavigation }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed z-50 top-0 left-0 w-full bg-white px-[150px] shadow-md flex justify-between items-center px-4 py-3">
      <Logo />
      {showNavigation && <Navigation />}
      <HeaderActions openDrawer={() => setIsOpen(true)} />
    </div>
  );
};

export default AppHeader;
