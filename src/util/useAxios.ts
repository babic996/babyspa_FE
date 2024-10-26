import axios from "axios";

const req = axios.create({ baseURL: "http://localhost:8088" });

export const baseRequest = () => {
  // var token = localStorage.getItem("token-pass");
  // if (token) {
  //   req.defaults.headers.common.Authorization = `Bearer ${token}`;
  // }

  return req;
};
