import http from "../http-common";
import { ITimeslot } from "types/Types";

const getAll = () => {
  return http.get<Array<ITimeslot>>("/Timeslot");
};

const TimeslotService = {
  getAll,
};

export default TimeslotService;
