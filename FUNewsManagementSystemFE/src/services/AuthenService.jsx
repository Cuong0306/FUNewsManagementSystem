 
import {apiClient} from "../api/apiClient";

const AuthenService = {
  login: (data) => {
    return apiClient.post("Auth/login", data);
  },
};

export default AuthenService;