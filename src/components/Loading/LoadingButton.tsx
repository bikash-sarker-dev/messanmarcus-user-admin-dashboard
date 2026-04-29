// "use client";

// import React from "react";
// import { PulseLoader } from "react-spinners";

// const LoadingButton = () => {
//   return (
//     <div className="">
//       <PulseLoader color="#fff" size={13} speedMultiplier={0.7} />
//     </div>
//   );
// };

// export default LoadingButton;

"use client";

import React from "react";
import { PulseLoader } from "react-spinners";

const LoadingButton = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="rounded-lg bg-teal-700 px-6 py-4 shadow-lg">
        <PulseLoader color="#fff" size={10} speedMultiplier={0.6} />
      </div>
    </div>
  );
};

export default LoadingButton;
