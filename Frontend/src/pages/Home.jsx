

import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import { SocketContext } from "../context/SocketContest";
import { useContext } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import LocationSearchPanel from "../components/LocationSearchPanel";
import LiveTracking from "../components/LiveTracking";
import Navbar from "../components/Navbar";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);

  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);

  const navigate = useNavigate();

  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  // Join user socket
  useEffect(() => {
    socket.emit("join", { userType: "user", userId: user._id });
  }, [user]);

  // Socket event listeners
  socket.on("ride-confirmed", (ride) => {
    console.log("ride confirmed");
    setVehicleFound(false);
    setWaitingForDriver(true);
    setRide(ride);
  });

  socket.on("ride-started", (ride) => {
    console.log("ride-started");
    setWaitingForDriver(false);
    navigate("/riding", { state: { ride } });
  });

  // Handle search input changes
  const handlePickupChange = async (e) => {
    setPickup(e.target.value);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: e.target.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPickupSuggestions(response.data);
    } catch (error) {
      // handle error
    }
  };

  const handleDestinationChange = async (e) => {
    setDestination(e.target.value);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: e.target.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDestinationSuggestions(response.data);
    } catch (error) {
      // handle error
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  // GSAP animations for location search panel
  useGSAP(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: "300px",
        opacity: 1,
        padding: "5px",
      });
      gsap.to(panelCloseRef.current, { opacity: 1 });
    } else {
      gsap.to(panelRef.current, {
        height: "0px",
        opacity: 0,
        padding: 0,
      });
      gsap.to(panelCloseRef.current, { opacity: 0 });
    }
  }, [panelOpen]);

  // Find trip function
  async function findTrip() {
    setVehiclePanel(true);
    setPanelOpen(false);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          params: { pickup, destination },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setFare(response.data);
    } catch (error) {
      console.error("Error fetching fare:", error);
    }
  }

  // Create ride function
  async function createRide() {
    console.log("creating ride");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        {
          pickup,
          destination,
          vehicleType,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error creating ride:", error);
    }
  }

  // Determine which panel to show
  const getCurrentPanel = () => {
    if (waitingForDriver) {
      return (
        <WaitingForDriver
          ride={ride}
          setVehicleFound={setVehicleFound}
          setWaitingForDriver={setWaitingForDriver}
          waitingForDriver={waitingForDriver}
        />
      );
    } else if (vehicleFound) {
      return (
        <LookingForDriver
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setVehicleFound={setVehicleFound}
        />
      );
    } else if (confirmRidePanel) {
      return (
        <ConfirmRide
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          passenger={user}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
        />
      );
    } else if (vehiclePanel) {
      return (
        <VehiclePanel
          selectVehicle={setVehicleType}
          fare={fare}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanel={setVehiclePanel}
        />
      );
    }
    return null;
  };

  return (
    <div className="h-screen relative bg-white overflow-hidden">
      <Navbar />

      <main className="flex h-full gap-6 py-6">
        {/* Left side: Form section */} 
        
        <div
          className={`relative flex flex-col justify-start items-start ${
            vehiclePanel || confirmRidePanel || vehicleFound || waitingForDriver
              ? "sm:w-[25vw]"
              : "sm:w-[25vw]"
          }`}
        >
          <div className="h-[40%] md:w-[100%] mx-auto rounded-[10px] p-6 bg-white relative border border-gray-200">
            <h5
              ref={panelCloseRef}
              onClick={() => setPanelOpen(false)}
              className="absolute opacity-0 right-6 top-6 text-2xl cursor-pointer"
            >
              <i className="ri-arrow-down-wide-line"></i>
            </h5>
            <h4 className="text-2xl font-semibold">Find a trip</h4>

            <form className="relative py-3" onSubmit={submitHandler}>
              <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>

              {/* Pickup Input */}
              <div className="relative">
                <input
                  onFocus={() => {
                    setPanelOpen(true);
                    setActiveField("pickup");
                  }}
                  onBlur={() => {
                    if (!pickup) setPanelOpen(false);
                  }}
                  value={pickup}
                  onChange={handlePickupChange}
                  className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full focus:outline-none focus:ring-0"
                  type="text"
                  placeholder="Add a pick-up location"
                />

                {/* Pickup Location Search Panel */}
                {activeField === "pickup" && (
                  <div
                    ref={panelRef}
                    className="absolute left-0 top-full w-full bg-white border border-gray-200 shadow-lg rounded-md mt-1 max-h-[400px] overflow-y-auto transition-all duration-500 ease-in-out z-10"
                  >
                    <LocationSearchPanel
                      suggestions={pickupSuggestions}
                      setPanelOpen={setPanelOpen}
                      setPickup={setPickup}
                      activeField={activeField}
                    />
                  </div>
                )}
              </div>

              {/* Destination Input */}
              <div className="relative mt-3">
                <input
                  onFocus={() => {
                    setPanelOpen(true);
                    setActiveField("destination");
                  }}
                  onBlur={() => {
                    if (!destination) setPanelOpen(false);
                  }}
                  value={destination}
                  onChange={handleDestinationChange}
                  className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full focus:outline-none focus:ring-0"
                  type="text"
                  placeholder="Enter your destination"
                />

                {/* Destination Location Search Panel */}
                {activeField === "destination" && (
                  <div
                    ref={panelRef}
                    className="absolute left-0 top-full w-full bg-white border border-gray-200 shadow-lg rounded-md mt-1 max-h-[400px] overflow-y-auto transition-all duration-500 ease-in-out"
                  >
                    <LocationSearchPanel
                      suggestions={destinationSuggestions}
                      setPanelOpen={setPanelOpen}
                      setDestination={setDestination}
                      activeField={activeField}
                    />
                  </div>
                )}
              </div>
            </form>

            <button
              onClick={findTrip}
              className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full"
            >
              Find Trip
            </button>
          </div>
        </div>

        {/* Right side: Map area and panels */}
        <div className="relative h-screen w-screen sm:h-[85vh] sm:w-[75vw] flex">
          {/* Conditionally show the panels beside LiveTracking */}
          {vehiclePanel ||
          confirmRidePanel ||
          vehicleFound ||
          waitingForDriver ? (
            <>
              <div className="w-1/2 h-full bg-white rounded-lg overflow-y-auto pl-2">
                {getCurrentPanel()}
              </div>
              <div className="w-1/2 h-full overflow-y-auto pr-2">
                <LiveTracking />
              </div>
            </>
          ) : (
            <div className="w-full h-full">
              <LiveTracking />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
