import Axios from "axios";

const BasicInstance = Axios.create({
  baseURL: "http://101.37.149.193:9876/api",
  timeout: 30000,
});

export { BasicInstance };
