import http from "../http-common";
import { IRequirementType } from "types/Types";

const getAll = () => {
  return http.get<Array<IRequirementType>>("/RequirementType");
};

const RequirementTypeService = {
  getAll,
};

export default RequirementTypeService;
