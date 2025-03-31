import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center p-4 bg-white text-black border-b-4 border-gray-200 ">
      <nav>
        <div className="text-2xl font-bold">RYDE</div>
        <Link
          to="/captain-home"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </nav>
    </div>
  );
}

{/* <div>
  <div className="flex justify-between items-center p-4 bg-white text-black border-b-4 border-gray-200 ">
    <nav>
      <div className="text-2xl font-bold">RYDE</div>
      <div>
        <img
          src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
          alt="User Icon"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </nav>
  </div>
</div>; */}
