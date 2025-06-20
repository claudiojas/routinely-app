// src/components/Layout.tsx
import { useLocation } from "react-router-dom";
import Header from "./Header"; // ajuste o caminho se necessário
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation();
  const hideHeader = pathname === "/login" || pathname === "/signup";

  return (
    <>
      {!hideHeader && <Header />}
      <main>{children}</main>
    </>
  );
};

export default Layout;
