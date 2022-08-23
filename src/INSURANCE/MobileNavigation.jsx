import NavLinks from "./NavLinks";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";
import { useState } from "react";
const MobileNavigation = ({children}) => {
const [open, setOpen] = useState(false);
const menuIcon = <GiHamburgerMenu className="menu" onClick={() => setOpen(!open)} />
const closeIcon = <IoCloseSharp  className="menu" onClick={() => setOpen(!open)} />

const closeMoblieMenu = ( ) => setOpen(false);

  return (
    <nav className="MobileNavigation">
      {children}
      {open ? closeIcon : menuIcon}
      {open && <NavLinks isMobile={true} closeMoblieMenu={closeMoblieMenu} />}
    </nav>
  );
};

export default MobileNavigation;
