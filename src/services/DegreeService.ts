import http from "../http-common";
import { IDegree } from "../types/Types";

const getAll = () => {
  return http.get<Array<IDegree>>("/Degree");
};

const DegreeService = {
  getAll,
};

export default DegreeService;
