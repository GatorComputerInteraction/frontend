import http from "../http-common";
import { IStudentSchedule } from "types/Types";

const getAll = () => {
  return http.get<Array<IStudentSchedule>>("/StudentSchedule");
};

const getByUfId = (ufId: number) => {
  return http.get<Array<IStudentSchedule>>(`/StudentSchedule/${ufId}`);
};

const post = (data: IStudentSchedule) => {
  return http.post<IStudentSchedule>("/StudentSchedule", data);
};
const StudentScheduleService = {
  getAll,
  getByUfId,
  post,
};

export default StudentScheduleService;
