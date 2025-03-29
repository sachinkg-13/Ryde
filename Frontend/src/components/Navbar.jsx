import React from "react";

export default function Navbar() {
  return (
    <div>
      <div className="flex justify-between items-center p-4 bg-white text-black border-b-4 border-gray-200 ">
        <nav>
          <div className="text-2xl font-bold">TITLE</div>
          <div>
            <img
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
              alt="User Icon"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </nav>
      </div>
    </div>
  );
}
