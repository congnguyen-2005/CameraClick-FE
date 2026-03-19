// services/inventoryService.js
import http from "./http";

const InventoryService = {
  import(data) {
    return http.post("/inventory/import", data);
  },

  export(data) {
    return http.post("/inventory/export", data);
  },
};

export default InventoryService;
