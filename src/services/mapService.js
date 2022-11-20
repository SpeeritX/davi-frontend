import axios from "axios";

class MapService {
  async getFlightPerRegion(params) {
    try {
      const response = await axios.get("/api/regions/", { params });
      return response;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}

export default new MapService();
