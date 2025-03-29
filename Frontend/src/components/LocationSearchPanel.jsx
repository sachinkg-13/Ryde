// import React from "react";

// const LocationSearchPanel = ({
//   suggestions,
//   setVehiclePanel,
//   setPanelOpen,
//   setPickup,
//   setDestination,
//   activeField,
// }) => {
//   const handleSuggestionClick = (suggestion) => {
//     if (activeField === "pickup") {
//       setPickup(suggestion.description);
//     } else if (activeField === "destination") {
//       setDestination(suggestion.description);
//     }
//     // setVehiclePanel(true);
//     setPanelOpen(false);
//   };
//   const formatDescription = (description) => {
//     const [firstPart, ...rest] = description.split(",");
//     return { firstPart, rest: rest.join(",") };
//   };

//   const { firstPart, rest } = formatDescription(elem.description);
//   return (
//     <div className>
//       {/* {console.log(suggestions)} */}
//       {/* Display fetched suggestions */}
//       {suggestions.map((elem, idx) => (
//         <div
//           key={idx}
//           onClick={() => handleSuggestionClick(elem)}
//           className="flex gap-4 border-2 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start cursor-pointer p-2"
//         >
//           <h2 className="bg-[#eee] h-8 aspect-square flex items-center justify-center w-8 rounded-full">
//             <i className="ri-map-pin-fill"></i>
//           </h2>
//           <h4 className="font-medium">
//             {firstPart}
//             {rest && <span className="text-gray-500">,{rest}</span>}
//           </h4>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default LocationSearchPanel;
import React from "react";

const LocationSearchPanel = ({
  suggestions,
  setVehiclePanel,
  setPanelOpen,
  setPickup,
  setDestination,
  activeField,
}) => {
  const handleSuggestionClick = (suggestion) => {
    if (activeField === "pickup") {
      setPickup(suggestion.description);
    } else if (activeField === "destination") {
      setDestination(suggestion.description);
    }
    setPanelOpen(false);
  };

  const formatDescription = (description) => {
    const [firstPart, ...rest] = description.split(",");
    return { firstPart, rest: rest.join(",") };
  };

  return (
    <div className="">
      {suggestions.length > 0 ? (
        suggestions.map((elem, idx) => {
          const { firstPart, rest } = formatDescription(elem.description);
          return (
            <div
              key={idx}
              onClick={() => handleSuggestionClick(elem)}
              className="flex gap-4 border-b last:border-none border-gray-100 hover:bg-gray-100 rounded-xl items-center my-2 justify-start cursor-pointer p-2 transition-all"
            >
              <h2 className="bg-[#eee] h-8 aspect-square flex items-center justify-center w-8 rounded-full">
                <i className="ri-map-pin-fill"></i>
              </h2>
              <h4 className="font-medium">
                {firstPart}
                {rest && <span className="text-gray-500">,{rest}</span>}
              </h4>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 p-3 text-center">No results found</p>
      )}
    </div>
  );
};

export default LocationSearchPanel;
