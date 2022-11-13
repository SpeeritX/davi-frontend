import axios from "axios";

class ParallelSetsService {
    async getParallelSets(params) {
      try {
        const response = await axios.get("/api/parallel/", { params });
        return response;
      } catch (e) {
        console.error(e);
        return [];
      }
    }
  }
  
  export default new ParallelSetsService();