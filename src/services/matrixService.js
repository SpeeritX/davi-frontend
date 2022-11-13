import axios from "axios";

class MatrixService {
  async getMatrix(params) {
    try {
      const response = await axios.get("/api/matrix/", { params });
      return response;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}

export default new MatrixService();
