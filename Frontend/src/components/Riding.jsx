import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContest";
import LiveTracking from "./LiveTracking";
import Navbar from "./Navbar";

const Riding = () => {
  const location = useLocation();
  const { ride } = location.state || {}; // Retrieve ride data
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  socket.on("ride-ended", (data) => {
    console.log("Ride Ended");
    navigate("/home");
  });
  return (
    <div className="h-screen ">
      <Navbar />

      <main className="flex  gap-6 py-6">
        <div className="w-1/3 p-4">
          <div className="flex items-center justify-between">
            <img
              className="h-12"
              src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
              alt=""
            />
            <div className="text-right">
              <h2 className="text-lg font-medium capitalize">
                {ride?.captain.fullname.firstname}
              </h2>
              <h4 className="text-xl font-semibold -mt-1 -mb-1">
                {ride?.captain.vehicle.plate}
              </h4>
              <p className="text-sm text-gray-600">Maruti Suzuki Alto</p>
            </div>
          </div>

          <div className="flex gap-2 justify-between flex-col items-center">
            <div className="w-full mt-5">
              <div className="flex items-center gap-5 p-3 border-b-2">
                <i className="text-lg ri-map-pin-2-fill"></i>
                <div>
                  <h3 className="text-lg font-medium">562/11-A</h3>
                  <p className="text-sm -mt-1 text-gray-600">
                    {ride?.destination}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5 p-3">
                <i className="ri-currency-line"></i>
                <div>
                  <h3 className="text-lg font-medium">₹{ride?.fare} </h3>
                  <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
                </div>
              </div>
            </div>
          </div>
          <button className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg">
            Make a Payment
          </button>
        </div>
        <div className="relative h-screen w-screen sm:h-[85vh] sm:w-[75vw] flex">
          <LiveTracking />
        </div>
      </main>
    </div>
  );
};

export default Riding;
