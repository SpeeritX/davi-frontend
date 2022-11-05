import axios from "axios";

class FlightsService {
  async getFlights(params) {
    try {
      const response = await axios.get("/api/select_date/", { params });
      return response;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}

export default new FlightsService();
