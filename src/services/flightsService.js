import axios from "axios";

class FlightsService {
  async getFlights(params) {
    try {
      const response = await axios.get("/api/flights/", { params });
      return response;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}

export default new FlightsService();
