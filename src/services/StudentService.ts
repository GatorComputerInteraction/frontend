import http from "../http-common";
import IStudent from "../types/Types";

const getAll = () => {
  return http.get("/Student");
};

const getById = (id: number) => {
  return http.get(`/Student/${id}`);
};

const StudentService = {
  getAll,
  getById,
};

export default StudentService;
