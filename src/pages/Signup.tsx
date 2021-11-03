import React, { useState, useEffect } from "react";
import {
  Card,
  Grid,
  Paper,
  Typography,
  CardContent,
  Collapse,
  IconButton,
  IconButtonProps,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { styled } from "@material-ui/styles";

import StudentService from "../services/StudentService";
import CourseService from "../services/CourseService";
import CourseInstanceService from "../services/CourseInstanceService";
import RequirementTypeService from "../services/RequirementTypeService";
import TimeslotService from "../services/TimeslotService";
import {
  IStudent,
  ICourse,
  IRequirementType,
  ICourseInstance,
  ITimeslot,
} from "./../types/Types";

import "./Signup.css";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

export default () => {
  // states for interface options
  const [semester, setSemester] = React.useState("Spring");
  const [year, setYear] = React.useState(2021);
  const handleSemesterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSemester(event.target.value);
  };
  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYear(parseInt(event.target.value));
  };

  // states for backend loaded data
  const initialStudentState = {
    ufId: -1,
    firstName: "",
    lastName: "",
    degreeId: -1,
  };
  const [student, setStudent] = useState<IStudent>(initialStudentState);
  const [courseInstances, setCourseInstances] = useState<
    Array<ICourseInstance>
  >([]);
  const [courses, setCourses] = useState<Array<ICourse>>([]);
  const [requirementType, setRequirementType] = useState<
    Array<IRequirementType>
  >([]);
  const [timeslots, setTimeslots] = useState<Array<ITimeslot>>([]);

  // dictionary of open cards
  const [expandedDict, setExpandedDict] = React.useState<{
    [key: number]: boolean;
  }>({});
  const handleExpandClick = (id: number) => {
    setExpandedDict((expandedDict) => ({
      ...expandedDict,
      [id]: !expandedDict[id],
    }));
  };

  useEffect(() => {
    getStudent();
    getCourses();
    getCourseInstances();
    getRequirementType();
    getTimeSlots();
    updateExpandedDict();
  }, []);

  const getStudent = () => {
    StudentService.getById(10001000)
      .then((response) => {
        setStudent(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getCourseInstances = () => {
    CourseInstanceService.getBySemesterYear(year, semester)
      .then((response) => {
        setCourseInstances(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getCourses = () => {
    CourseService.getAll()
      .then((response) => {
        setCourses(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getRequirementType = () => {
    RequirementTypeService.getAll()
      .then((response) => {
        setRequirementType(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getTimeSlots = () => {
    TimeslotService.getAll()
      .then((response) => {
        setTimeslots(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const updateExpandedDict = () => {
    courseInstances.forEach(
      (course) => (expandedDict[course.instanceId] = false)
    );
  };

  const mapCourseIdToCredits = (id: number) => {
    return courses.find((course) => course.courseId == id)?.credits;
  };

  const mapCourseIdToName = (id: number) => {
    return courses.find((course) => course.courseId == id)?.courseName;
  };

  const mapSlotIdToDay = (id: number) => {
    return timeslots.find((slot) => slot.slotId == id)?.day;
  };

  const mapSlotIdToPeriods = (id: number) => {
    var timeslot = timeslots.find((slot) => slot.slotId == id);
    var formattedStr = timeslot?.periodId1.toString();
    if (timeslot?.periodId2 != null)
      formattedStr += ", " + timeslot?.periodId2.toString();
    if (timeslot?.periodId3 != null)
      formattedStr += ", " + timeslot?.periodId3.toString();
    return formattedStr;
  };

  const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} className="dropdown-button" />;
  })(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
  }));

  var shouldExpand = (i: number) => {
    return i in expandedDict ? expandedDict[i] : false;
  };

  var courseInstanceComponent = (course: ICourseInstance) => {
    return (
      <Card id={"course" + course.instanceId} className="course-card">
        <CardContent>
          <Typography>
            Course Name: {mapCourseIdToName(course.courseId)}
            <ExpandMore
              expand={
                course.instanceId in expandedDict
                  ? expandedDict[course.instanceId]
                  : false
              }
              onClick={() => handleExpandClick(course.instanceId)}
              aria-expanded={
                course.instanceId in expandedDict
                  ? expandedDict[course.instanceId]
                  : false
              }
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </Typography>
          <Collapse
            in={shouldExpand(course.instanceId)}
            timeout="auto"
            unmountOnExit
          >
            <CardContent>
              <Typography>Class Number: #{course.instanceId}</Typography>
              <Typography>
                Class Times: {mapSlotIdToDay(course.slotId)} Period{" "}
                {mapSlotIdToPeriods(course.slotId)}
              </Typography>
              <Typography>
                Credits: {mapCourseIdToCredits(course.courseId)}
              </Typography>
            </CardContent>
          </Collapse>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Paper>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{ padding: "1em" }}>
            <Typography variant="h3">Course of Schedules</Typography>
          </Grid>
          <Grid item xs={4} style={{ padding: "2em" }}>
            <Typography variant="h5">Options</Typography>
            <FormControl variant="standard">
              <InputLabel htmlFor="semester-input">Semester</InputLabel>
              <Input
                id="semester-input"
                value={semester}
                onChange={handleSemesterChange}
              />
            </FormControl>
            <FormControl variant="standard">
              <InputLabel htmlFor="year-input">Year</InputLabel>
              <Input id="year-input" value={year} onChange={handleYearChange} />
            </FormControl>
          </Grid>
          <Grid item xs={8} style={{ padding: "2em" }}>
            <Typography variant="h5">Courses</Typography>
            <div id="coursesParent" className="courses-parent">
              {courseInstances.map((course) => courseInstanceComponent(course))}
            </div>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
