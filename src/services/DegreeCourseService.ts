import http from "../http-common";
import { IDegreeCourse } from "types/Types";

const getAll = () => {
  return http.get<Array<IDegreeCourse>>("/DegreeCourse");
};

const getByDegreeId = (id: number) => {
  return http.get<Array<IDegreeCourse>>(`/DegreeCourse/Query`, {
    params: { degreeId: id },
  });
};

const DegreeCourseService = {
  getAll,
  getByDegreeId,
};

export default DegreeCourseService;
