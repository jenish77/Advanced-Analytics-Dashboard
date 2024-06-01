"use client";
import React, { FunctionComponent, useEffect, useState } from "react";

const Dashboard = () => {
  const [MyAwesomeMap, setClient] = useState()
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const newClient = (await import("@/Components/General/Dashboard")).default;
        setClient(() => newClient);
      }
    })();
  }, []);
  return MyAwesomeMap ? <MyAwesomeMap /> : "";
};

export default Dashboard;
