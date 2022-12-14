import { Link, useLocation } from "react-router-dom";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import ModeIcon from "@mui/icons-material/Mode";
import Button from "@mui/material/Button/Button";
import logo from "../assets/logo.png";
import { useContext, useState } from "react";
import NavItem from "./mini/NavItem";
import config from "../assets/config";
import { PageContext } from "../App";
import SearchPopup from "./mini/SearchPopup";

function LeftNav() {
  const [showNav, setShowNav] = useState(false);
  const [spinIcon, setSpinIcon] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  const validPagesForSearch = ["socks", "locations", "officers"];
  function showPopup() {
    setPopupOpen(true);
  }

  function hideNav() {
    setShowNav(false);
  }

  const loc = useLocation();

  const [page, setPage] = useContext(PageContext);
  return (
    <>
     {popupOpen ?  <SearchPopup open={popupOpen} setOpen={setPopupOpen} />:<></> }
      <div className={"left-nav" + (showNav ? " show" : "")}>
        <div className="page-name">
          <Link to="/" className="title">
            <img src={logo} alt="russian socks logo" />
            <span>{"socks panel".toUpperCase()}</span>
          </Link>
          {showNav ? (
            <Button
              variant={"text"}
              id="close-logo"
              className="nav-icon"
              style={{
                color: "white",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
              }}
              onClick={() => {
                setShowNav(false);
              }}
            >
              <CloseIcon />
            </Button>
          ) : (
            <></>
          )}
          {!showNav ? (
            <Button
              variant={"text"}
              // color={""}
              id="open-menu"
              className="nav-icon"
              style={{
                color: "white",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
              }}
              onClick={() => {
                setShowNav(true);
              }}
            >
              <MenuIcon />
            </Button>
          ) : (
            <></>
          )}
        </div>

        <div className="nav-panel">
          <div className="nav-items">
            {validPagesForSearch.includes(page) ? (
              <Button
                variant={"text"}
                style={{ color: "white" }}
                className="nav-item"
                onClick={() => {
                  showPopup();
                }}
              >
                Search
              </Button>
            ) : (
              <></>
            )}
            <span style={{ userSelect: "none" }} className="title">
              Menu
            </span>
            <NavItem
              hide={hideNav}
              path="/socks"
              text="Socks"
              icon={<SearchIcon />}
              key={0}
            />
            <NavItem
              hide={hideNav}
              path="/locations"
              text="Locations"
              icon={<LocationOnIcon />}
              key={1}
            />
            <NavItem
              hide={hideNav}
              path="/history"
              text="history"
              icon={<ListAltIcon />}
              key={2}
            />
            <NavItem
              hide={hideNav}
              path="/officers"
              text="officers"
              icon={<AccountBoxIcon />}
              key={3}
            />
            <span style={{ userSelect: "none" }} className="title">
              Tools
            </span>
            <NavItem
              hide={hideNav}
              path={`/${
                // loc.pathname.replace(/^\//g, "").split("/")[0] || "socks"
                page
              }/add`}
              text="Add new item"
              icon={<ModeIcon />}
              key={4}
            />
            <div
              className="nav-item"
              onClick={(e) => {
                setSpinIcon(true);
                fetch(config.apiHost + "/api/reset", {
                  method: "put",
                })
                  .then((res) => {
                    if (res.ok) return res.json();
                  })
                  .then((res) => {
                    setSpinIcon(false);
                  })
                  .catch(() => {
                    setSpinIcon(false);
                  });
              }}
            >
              <Button
                variant={"text"}
                style={{ color: "white" }}
                startIcon={
                  <RestartAltIcon className={spinIcon ? "spin" : ""} />
                }
              >
                Reset data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LeftNav;
