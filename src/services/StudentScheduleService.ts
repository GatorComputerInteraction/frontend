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

const drop = (data: IStudentSchedule) => {
  return http.delete<IStudentSchedule>(
    `/StudentSchedule/${data.ufId}?instanceId=${data.instanceId}`
  );
};

const StudentScheduleService = {
  getAll,
  getByUfId,
  post,
  drop,
};

export default StudentScheduleService;
