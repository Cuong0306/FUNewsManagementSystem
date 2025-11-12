// import {apiClient} from "../api/apiClient";

// const AccountService = {
//   getAllAccounts: () => {
//     return apiClient.get("Account");
//   },
//   createAccount: (data) => {
//     return apiClient.post("Account", data);
//   },
//    updateAccount: (id, data) => {
//     return apiClient.put('Account/${id}', data);  
//   },
//   deleteAccount: (id) => {
//     return apiClient.delete(`Account/${id}`);
//   },
// };

// export default AccountService;

// src/services/AccountService.js
import { apiClient } from "../api/apiClient";

const AccountService = {
  getAllAccounts: () => {
    return apiClient.get("Account");
  },
  createAccount: (data) => {
    return apiClient.post("Account", data);
  },
  updateAccount: (id, data) => {
    // Exclude accountId from body if present, as it's in URL path
    const { accountId, ...body } = data;
    console.log(accountId, body);
    return apiClient.put(`Account/${id}`, body);
  },
  deleteAccount: (id) => {
    return apiClient.delete(`Account/${id}`);
  },
  getAccountById: (id) => {
    return apiClient.get(`Account/${id}`);
  },
};

export default AccountService;