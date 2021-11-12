import { IStudent } from "types/Types";
import http from "../http-common";

const getAll = () => {
  return http.get<Array<IStudent>>("/Student");
};

const getById = (id: number) => {
  return http.get<IStudent>(`/Student/${id}`);
};

const StudentService = {
  getAll,
  getById,
};

export default StudentService;
