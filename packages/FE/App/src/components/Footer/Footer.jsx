import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { FaArrowUp } from "react-icons/fa";

export default function Footer() {
  const handelToTop = () => {
    window.scrollTo(0, 0);
  };
  return (
    <footer className="footer">
      <span onClick={handelToTop} className="go_top">
        <FaArrowUp />
      </span>
      <div className="footer_first">
        <div style={{ display: 'flex', justifyContent: 'center'}}>
          <p>
            This source is cloned from Github :D
          </p>
        </div>
      </div>
    </footer>
  );
}
