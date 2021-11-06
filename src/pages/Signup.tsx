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
  Button,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import StarIcon from "@material-ui/icons/Star";
import { styled } from "@material-ui/styles";

import StudentService from "../services/StudentService";
import CourseService from "../services/CourseService";
import CourseInstanceService from "../services/CourseInstanceService";
import RequirementTypeService from "../services/RequirementTypeService";
import TimeslotService from "../services/TimeslotService";
import StudentScheduleService from "../services/StudentScheduleService";
import DegreeCourseService from "../services/DegreeCourseService";
import {
  IStudent,
  ICourse,
  IRequirementType,
  ICourseInstance,
  ITimeslot,
  IStudentSchedule,
  IDegreeCourse,
} from "./../types/Types";

import "./Signup.css";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

export default () => {
  // states for interface options
  const studentId = 10001000;
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
  const [studentSchedule, setStudentSchedule] = useState<
    Array<IStudentSchedule>
  >([]);
  const [studentDegree, setStudentDegree] = useState<Array<IDegreeCourse>>([]);
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
    getStudentSchedule();
    getTimeSlots();
    updateExpandedDict();
  }, []);

  useEffect(() => {
    getStudentDegree();
  }, [student]);

  const getStudent = () => {
    StudentService.getById(studentId)
      .then((response) => {
        console.log(response.data);
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

  const getStudentSchedule = () => {
    StudentScheduleService.getByUfId(studentId)
      .then((response) => {
        setStudentSchedule(response.data);
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

  const getStudentDegree = () => {
    DegreeCourseService.getByDegreeId(student.degreeId)
      .then((response) => {
        setStudentDegree(response.data);
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

  const addCourse = (id: number) => {
    var data = { ufId: studentId, instanceId: id };
    StudentScheduleService.post(data)
      .then((response) => {
        getStudentSchedule();
        console.log(studentSchedule);
      })
      .catch((e) => {
        console.log(e);
      });
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

  const shouldExpand = (i: number) => {
    return i in expandedDict ? expandedDict[i] : false;
  };

  const courseIsDuplicate = (id: number) => {
    return (
      studentSchedule.find((record) => record.instanceId == id) !== undefined
    );
  };

  const courseIsRequired = (id: number) => {
    return studentDegree.find((record) => record.courseId == id) !== undefined;
  };

  const IndicatorIcons = (instanceId: number, courseId: number) => {
    return (
      <div className="indicator-icons">
        {courseIsDuplicate(instanceId) ? (
          <div className="indicator">
            <CheckIcon className="indicator-icon checkmark" />
            <p className="sub-text">Scheduled</p>
          </div>
        ) : (
          ""
        )}
        {courseIsRequired(courseId) ? (
          <div className="indicator">
            <StarIcon className="indicator-icon star" />
            <p className="sub-text">Required</p>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  var courseInstanceComponent = (course: ICourseInstance) => {
    return (
      <Card id={"course" + course.instanceId} className="course-card">
        <CardContent>
          <Typography className="course-header">
            {mapCourseIdToName(course.courseId)}
            <ExpandMore
              expand={shouldExpand(course.instanceId)}
              onClick={() => handleExpandClick(course.instanceId)}
              aria-expanded={shouldExpand(course.instanceId)}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
            {IndicatorIcons(course.instanceId, course.courseId)}
          </Typography>
          <Collapse
            in={shouldExpand(course.instanceId)}
            timeout="auto"
            unmountOnExit
          >
            <CardContent className="course-details outlined">
              <div className="text">
                <Typography>Class Number: #{course.instanceId}</Typography>
                <Typography>
                  Class Times: {mapSlotIdToDay(course.slotId)} Period{" "}
                  {mapSlotIdToPeriods(course.slotId)}
                </Typography>
                <Typography>
                  Credits: {mapCourseIdToCredits(course.courseId)}
                </Typography>
              </div>
              <Button
                className="add-button"
                color="primary"
                aria-label="outlined primary button"
                onClick={() => addCourse(course.instanceId)}
                disabled={courseIsDuplicate(course.instanceId)}
                size="small"
              >
                <AddIcon />
                Add Course
              </Button>
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
            <div id="coursesParent" className="courses-parent outlined">
              {courseInstances.length > 0 ? (
                courseInstances.map((course) => courseInstanceComponent(course))
              ) : (
                <Typography>There are no courses available.</Typography>
              )}
            </div>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
