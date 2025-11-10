import { Outlet } from "react-router-dom";
import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
);
};

export default Layout;