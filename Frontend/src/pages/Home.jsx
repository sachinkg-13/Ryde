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
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
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

  const navigate = useNavigate();

  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);
  // console.log(user);

  useEffect(() => {
    socket.emit("join", { userType: "user", userId: user._id });
  }, [user]);

  socket.on("ride-confirmed", (ride) => {
    console.log("ride confirmed");
    setVehicleFound(false);
    setWaitingForDriver(true);
    setRide(ride);
  });

  socket.on("ride-started", (ride) => {
    console.log(ride);
    console.log("ride-started");
    setWaitingForDriver(false);
    navigate("/riding", { state: { ride } }); // Updated navigate to include ride data
  });

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
      console.log(response.data);
      setPickupSuggestions(response.data);
    } catch {
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
      console.log(response.data);
      setDestinationSuggestions(response.data);
    } catch {
      // handle error
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  // useGSAP(
  //   function () {
  //     if (panelOpen) {
  //       gsap.to(panelRef.current, {
  //         height: "70%",
  //         // position: absolute,
  //         // padding: 24,
  //         // opacity:1
  //       });
  //       gsap.to(panelCloseRef.current, {
  //         opacity: 1,
  //       });
  //     } else {
  //       gsap.to(panelRef.current, {
  //         height: "0%",
  //         padding: 0,
  //         // opacity:0
  //       });
  //       gsap.to(panelCloseRef.current, {
  //         opacity: 0,
  //       });
  //     }
  //   },
  //   [panelOpen]
  // );

  useGSAP(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: "300px", // Adjust height dynamically
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

  useGSAP(
    function () {
      if (vehiclePanel) {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehiclePanel]
  );

  useGSAP(
    function () {
      if (confirmRidePanel) {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePanel]
  );

  useGSAP(
    function () {
      if (vehicleFound) {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehicleFound]
  );

  useGSAP(
    function () {
      if (waitingForDriver) {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [waitingForDriver]
  );

  async function findTrip() {
    setVehiclePanel(true);
    setPanelOpen(false);

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
  }
  async function createRide() {
    console.log("creating ride");
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
  }

  return (
    <div className="h-screen relative bg-white overflow-hidden">
      <Navbar />
      {/* image for temporary use  */}
      <div className="hidden">
        <main className="flex h-full gap-6 py-6">
          {/* <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div> */}
          <div className="relative flex flex-col justify-start items-start sm:w-[25vw]">
            <div className="h-[40%] md:w-[100%] mx-auto rounded-[10px] p-6 bg-white relative border border-gray-200">
              <h5
                ref={panelCloseRef}
                onClick={() => {
                  setPanelOpen(false);
                }}
                className="absolute opacity-0 right-6 top-6 text-2xl"
              >
                <i className="ri-arrow-down-wide-line cursor-pointer"></i>{" "}
              </h5>
              <h4 className="text-2xl font-semibold">Find a trip</h4>
              <form
                className="relative py-3"
                onSubmit={(e) => {
                  submitHandler(e);
                }}
              >
                <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
                <input
                  onClick={() => {
                    setPanelOpen(true);
                    setActiveField("pickup");
                  }}
                  value={pickup}
                  onChange={handlePickupChange}
                  className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full"
                  type="text"
                  placeholder="Add a pick-up location"
                />
                <input
                  onClick={() => {
                    setPanelOpen(true);
                    setActiveField("destination");
                  }}
                  value={destination}
                  onChange={handleDestinationChange}
                  className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3"
                  type="text"
                  placeholder="Enter your destination"
                />
              </form>
              <button
                onClick={findTrip}
                className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full"
              >
                Find Trip
              </button>
              <div
                ref={panelRef}
                className="bg-green-300 h-0 absolute -bottom-10 w-full transition-all duration-500 ease-in-out"
              >
                <LocationSearchPanel
                  suggestions={
                    activeField === "pickup"
                      ? pickupSuggestions
                      : destinationSuggestions
                  }
                  setPanelOpen={setPanelOpen}
                  setVehiclePanel={setVehiclePanel}
                  setPickup={setPickup}
                  setDestination={setDestination}
                  activeField={activeField}
                />
              </div>
            </div>
          </div>

          <div className="relative h-screen w-screen sm:h-[85vh] sm:w-[75vw] px-2">
            <LiveTracking />
          </div>
        </main>
      </div>

      <main className="flex h-full gap-6 py-6">
        <div className="relative flex flex-col justify-start items-start sm:w-[25vw]">
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
                  className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  focus:outline-none focus:ring-0"
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

        <div className="relative h-screen w-screen sm:h-[85vh] sm:w-[75vw] px-2">
          <LiveTracking />
        </div>
      </main>

      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full"
      >
        <VehiclePanel
          selectVehicle={setVehicleType}
          fare={fare}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanel={setVehiclePanel}
        />
      </div>

      <div
        ref={confirmRidePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full "
      >
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
      </div>

      <div
        ref={vehicleFoundRef}
        className="fixed w-full z-10 bottom-0 translate-y-full"
      >
        <LookingForDriver
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setVehicleFound={setVehicleFound}
        />
      </div>

      <div
        ref={waitingForDriverRef}
        className="fixed w-full  z-10 bottom-0  bg-white px-3 py-6 pt-12"
      >
        <WaitingForDriver
          ride={ride}
          setVehicleFound={setVehicleFound}
          setWaitingForDriver={setWaitingForDriver}
          waitingForDriver={waitingForDriver}
        />
      </div>
    </div>
  );
};

export default Home;
