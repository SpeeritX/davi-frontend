import axios from "axios";

class MatrixService {
  async getAbsoluteMatrix(params) {
    try {
      const response = await axios.get("/api/matrix/absolute/", { params });
      return response;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
  async getExpectedMatrix(params) {
    try {
      const response = await axios.get("/api/matrix/expected/", { params });
      return response;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}

export default new MatrixService();
