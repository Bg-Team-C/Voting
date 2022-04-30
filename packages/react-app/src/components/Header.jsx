import { PageHeader } from "antd";
import classNames from "classnames";
import { Link } from "react-router-dom";
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
} from "react";


const Header = () => {


  const headerRef = useRef();
  const scrollHelper = useCallback(
     
  );

  const [shortenedAddress, setShortenedAddress] = useState("");


<<<<<<< HEAD
  // useEffect(() => {
  //   scrollHelper(window.pageYOffset);
  //   window.addEventListener("scroll", (event) => {
  //     scrollHelper(window.pageYOffset);
  //   });
  // }, [scrollHelper]);

=======
>>>>>>> 986815e7b829b8ffb88905357047a1cfdd3523a6
  return (
    <header
      className={classNames(
        "flex items-center justify-between py-4 sm:py-6 absolute w-full bg-no-repeat header",
     
      )}
      ref={headerRef}
    >
      <div className={classNames("flex items-center")}>
        <Link to="/">
          <h1 className="text-3xl font-extrabold text-gray-400">School Voting</h1>
        </Link>
      </div>
    </header>
  );
     


};
export default Header;


Header.defaultProps = {
  link: "https://github.com/Bg-Team-C/Voting",
  title: "🏗 Voting App",
  subTitle: " School Leadership Voting Platform",
}