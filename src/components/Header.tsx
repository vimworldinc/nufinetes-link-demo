import { useMemo } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export default function Header() {
  const { pathname } = window.location;
  const rawPathname = useMemo(() => {
    if (pathname.includes("/nufinetes-link-demo/")) {
      return pathname.replace("/nufinetes-link-demo", "");
    }
    return pathname;
  }, [pathname]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "600px",
        padding: "1rem",
        margin: "1rem",
        overflow: "auto",
        border: "1px solid",
        borderRadius: "1rem",
        flexWrap: "wrap",
      }}
    >
      <HeaderLink className={rawPathname === "/" ? "active" : ""}>
        <Link to="/">Multi wallet example</Link>
      </HeaderLink>

      <HeaderLink className={rawPathname === "/dapp" ? "active" : ""}>
        <Link to="/dapp">Dapp wallet example</Link>
      </HeaderLink>

      <HeaderLink className={rawPathname === "/eth-sign" ? "active" : ""}>
        <Link to="/eth-sign">Ethereum Sign example</Link>
      </HeaderLink>

      <HeaderLink className={rawPathname === "/contract" ? "active" : ""}>
        <Link to="/contract">Eth Contract call example</Link>
      </HeaderLink>

      <HeaderLink className={rawPathname === "/vechain" ? "active" : ""}>
        <Link to="/vechain">Vechain Contract call example</Link>
      </HeaderLink>

      <HeaderLink className={rawPathname === "/bnb" ? "active" : ""}>
        <Link to="/bnb">Bnb Contract call example</Link>
      </HeaderLink>
    </div>
  );
}

const HeaderLink = styled.div`
  margin-right: 20px;

  &:last-child {
    margin-right: 0;
  }

  a {
    text-decoration: underline;
    color: #000;
  }
  &.active {
    a {
      color: #1665e3;
      text-decoration: none;
    }
  }
`;
