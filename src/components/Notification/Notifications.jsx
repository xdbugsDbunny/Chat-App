import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notifications = () => {
  return (
    <div>
      <ToastContainer position="top-center" style={{ color: "black" }} />
    </div>
  );
};

export default Notifications;
