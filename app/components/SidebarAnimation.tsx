import React from "react";

const SidebarAnimation = () => {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(6)].map((_, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-white/10 animate-pulse"
        >
          {/* Avatar */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#c9cdd3]"></div>

            {/* Name + Status */}
            <div className="flex flex-col gap-1">
              <div className="h-3 w-24 bg-[#c9cdd3] rounded"></div>
              <div className="h-2 w-16 bg-[#c9cdd3] rounded"></div>
            </div>
          </div>

          {/* Unseen message badge placeholder */}
          <div className="w-5 h-5 rounded-full bg-[#c9cdd3]"></div>
        </div>
      ))}
    </div>
  );
};

export default SidebarAnimation;
