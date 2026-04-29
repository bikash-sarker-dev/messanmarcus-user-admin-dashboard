"use client";

import React from "react";
import { PulseLoader } from "react-spinners";

const LoadingButton = () => {
  return (
    <div className="">
      <PulseLoader color="#fff" size={13} speedMultiplier={0.7} />
    </div>
  );
};

export default LoadingButton;
