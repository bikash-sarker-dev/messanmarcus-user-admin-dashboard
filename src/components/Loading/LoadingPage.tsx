"use client";

import { FadeLoader } from "react-spinners";

const LoadingPage = () => {
  return (
    <div className=" absolute inset-0 flex items-center justify-center bg-white/80 z-50">
      <FadeLoader
        color="#ff8000" // Tailwind sky-500 color
        loading={true}
        height={32} // bigger height
        width={8} // thicker lines
        margin={22} // more space between bars
        speedMultiplier={1.2} // slightly faster
      />
    </div>
  );
};

export default LoadingPage;
