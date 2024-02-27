import Axios from "axios";

const BasicInstance = Axios.create({
  baseURL: "https://waka.cjiw.site/api",
  timeout: 30000,
});

export { BasicInstance };
