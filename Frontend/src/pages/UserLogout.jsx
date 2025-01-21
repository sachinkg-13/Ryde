import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const UserLogout = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  console.log(token);

  axios
    .get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        console.log(response.data);
        console.log(token);
        localStorage.removeItem("token");
        navigate("/login");
      }
    });
  navigate("/login");

  return <div>UserLogout</div>;
};

export default UserLogout;
