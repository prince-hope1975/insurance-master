const NavLinks = (props) => {
  return (
    <ul className="nav">
      <li onClick={() => props.isMobile && props.closeMobileMenu()}>
        <a href="/">HOME</a>
      </li>
      <li onClick={() => props.isMobile && props.closeMobileMenu()}>
        <a href="/#about us">ABOUT US</a>
      </li>
      <li onClick={() => props.isMobile && props.closeMobileMenu()}>
        <a href="/#services">SERVICES</a>
      </li>
      <li onClick={() => props.isMobile && props.closeMobileMenu()}>
        <a href="/#wallet">WALLET</a>
      </li>
      <li onClick={() => props.isMobile && props.closeMobileMenu()}>
        <a href="/#contact">CONTACT</a>
      </li>
    </ul>
  );
};

export default NavLinks;
