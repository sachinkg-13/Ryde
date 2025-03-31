// import React, { useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import { useGSAP } from "@gsap/react";
// import gsap from "gsap";
// import CaptainDetails from "../components/CaptainDetails";
// import RidePopUp from "../components/RidePopUp";
// import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
// import { CaptainDataContext } from "../context/CaptainContext";
// import { useContext } from "react";
// import { useEffect } from "react";
// import { SocketContext } from "../context/SocketContest";
// import axios from "axios";
// import LiveTracking from "../components/LiveTracking";

// const CaptainHome = () => {
//   const [ridePopupPanel, setRidePopupPanel] = useState(false);
//   const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);

//   const ridePopupPanelRef = useRef(null);
//   const confirmRidePopupPanelRef = useRef(null);
//   const [ride, setRide] = useState(null);

//   const { captain } = useContext(CaptainDataContext);
//   const { socket } = useContext(SocketContext);

//   useEffect(() => {
//     console.log(captain.socketId);
//     socket.emit("join", { userId: captain._id, userType: "captain" });

//     const updateLocation = () => {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition((position) => {
//           const { latitude, longitude } = position.coords;

//           socket.emit("update-location-captain", {
//             userId: captain._id,
//             location: { ltd: latitude, lng: longitude },
//           });
//         });
//       }
//     };

//     const locationInterval = setInterval(updateLocation, 10000);
//     updateLocation();

//     return () => clearInterval(locationInterval);
//   }, [captain]);

//   socket.on("message", (data) => {
//     console.log(data);
//   });

//   socket.on("new-ride", (data) => {
//     console.log("New Ride");
//     console.log(data);
//     setRide(data);
//     setRidePopupPanel(true);
//   });

//   async function confirmRide() {
//     console.log("Confirmed Ride");
//     const response = await axios.post(
//       `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
//       {
//         rideId: ride._id,
//         captainId: captain._id,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       }
//     );

//     setRidePopupPanel(false);
//     setConfirmRidePopupPanel(true);
//   }

//   useGSAP(
//     function () {
//       if (ridePopupPanel) {
//         gsap.to(ridePopupPanelRef.current, {
//           transform: "translateY(0)",
//         });
//       } else {
//         gsap.to(ridePopupPanelRef.current, {
//           transform: "translateY(100%)",
//         });
//       }
//     },
//     [ridePopupPanel]
//   );

//   useGSAP(
//     function () {
//       if (confirmRidePopupPanel) {
//         gsap.to(confirmRidePopupPanelRef.current, {
//           transform: "translateY(0)",
//         });
//       } else {
//         gsap.to(confirmRidePopupPanelRef.current, {
//           transform: "translateY(100%)",
//         });
//       }
//     },
//     [confirmRidePopupPanel]
//   );

//   return (
//     <div className="h-screen">
//       <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
//         <img
//           className="w-16"
//           src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
//           alt=""
//         />
//         <Link
//           to="/captain-home"
//           className=" h-10 w-10 bg-white flex items-center justify-center rounded-full"
//         >
//           <i className="text-lg font-medium ri-logout-box-r-line"></i>
//         </Link>
//       </div>
//       <div className="h-3/5">

//         <LiveTracking />
//       </div>
//       <div className="h-2/5 p-6">
//         <CaptainDetails />
//       </div>
//       <div
//         ref={ridePopupPanelRef}
//         className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
//       >
//         <RidePopUp
//           ride={ride}
//           setRidePopupPanel={setRidePopupPanel}
//           setConfirmRidePopupPanel={setConfirmRidePopupPanel}
//           confirmRide={confirmRide}
//         />
//       </div>
//       <div
//         ref={confirmRidePopupPanelRef}
//         className="fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
//       >
//         <ConfirmRidePopUp
//           ride={ride}
//           setConfirmRidePopupPanel={setConfirmRidePopupPanel}
//           setRidePopupPanel={setRidePopupPanel}
//         />
//       </div>
//     </div>
//   );
// };

// export default CaptainHome;

import React, { useRef, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { CaptainDataContext } from "../context/CaptainContext";
import { SocketContext } from "../context/SocketContest";
import axios from "axios";
import LiveTracking from "../components/LiveTracking";
import Navbar from "../components/Navbar";

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [ride, setRide] = useState(null);

  const { captain } = useContext(CaptainDataContext);
  const { socket } = useContext(SocketContext);

  // Initialize socket connection and location updates
  useEffect(() => {
    console.log(captain.socketId);
    socket.emit("join", { userId: captain._id, userType: "captain" });

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;

          socket.emit("update-location-captain", {
            userId: captain._id,
            location: { ltd: latitude, lng: longitude },
          });
        });
      }
    };

    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation();

    return () => clearInterval(locationInterval);
  }, [captain]);

  // Socket event listeners
  socket.on("message", (data) => {
    console.log(data);
  });

  socket.on("new-ride", (data) => {
    console.log("New Ride");
    console.log(data);
    setRide(data);
    setRidePopupPanel(true);
  });

  // Confirm ride function
  async function confirmRide() {
    console.log("Confirmed Ride");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        {
          rideId: ride._id,
          captainId: captain._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setRidePopupPanel(false);
      setConfirmRidePopupPanel(true);
    } catch (error) {
      console.error("Error confirming ride:", error);
    }
  }

  // Determine which panel to show
  const getCurrentPanel = () => {
    if (confirmRidePopupPanel) {
      return (
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      );
    } else if (ridePopupPanel) {
      return (
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
        />
      );
    }
    return null;
  };

  // Check if any panel is active
  const isPanelActive = ridePopupPanel || confirmRidePopupPanel;

  return (
    <div className="h-screen relative bg-white overflow-hidden">
      {/* Header */}
     <Navbar />

      {/* Main Content */}
      <main className="flex h-full gap-6 py-6">
        {/* Captain Details Section */}
        <div
          className={`relative flex flex-col justify-start items-start ${
            isPanelActive ? "sm:w-[25vw]" : "sm:w-[25vw]"
          }`}
        >
          <CaptainDetails />
        </div>

        {/* Map and Panel Section */}
        <div
          className={`flex relative h-screen w-screen sm:h-[85vh] sm:w-[75vw]`}
        >
          {isPanelActive ? (
            <>
              {/* Split view when panel is active */}
              <div className="w-1/2 h-full bg-white rounded-lg  overflow-y-auto p-4">
                {getCurrentPanel()}
              </div>
              <div className="w-1/2 h-full">
                <LiveTracking />
              </div>
            </>
          ) : (
            // Full width when no panel is active
            <div className="w-full h-full">
              <LiveTracking />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CaptainHome;
