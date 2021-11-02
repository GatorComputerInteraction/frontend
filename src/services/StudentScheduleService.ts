import http from "../http-common";
import { IStudentSchedule } from "types/Types";

const getAll = () => {
  return http.get<Array<IStudentSchedule>>("/StudentSchedule");
};

const StudentScheduleService = {
  getAll,
};

export default StudentScheduleService;
