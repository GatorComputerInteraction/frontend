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
  AccordionSummary,
  AccordionDetails,
  Box,
  TableContainer,
  TableRow,
  TableCell,
  Table,
  Chip,
  TextField,
} from "@material-ui/core";
import MuiAccordion from "@material-ui/core/Accordion";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import StarIcon from "@material-ui/icons/Star";
import RoomIcon from "@material-ui/icons/Room";
import SearchIcon from "@material-ui/icons/Search";
import { styled, withStyles } from "@material-ui/styles";

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
      <Grid item xs={2}>
        {courseIsDuplicate(instanceId) ? (
          <Chip variant="outlined" icon={<CheckIcon />} label="Scheduled" />
        ) : null}
        {courseIsRequired(courseId) ? (
          <Chip
            color="primary"
            variant="outlined"
            icon={<StarIcon />}
            label="Required"
          />
        ) : null}
      </Grid>
    );
  };

  const Accordion = withStyles({
    root: {
      border: "1px solid rgba(0, 0, 0, .125)",
      boxShadow: "none",
      "&:not(:last-child)": {
        borderBottom: 0,
      },
      "&:before": {
        display: "none",
      },
      "&$expanded": {
        margin: "auto",
      },
    },
    expanded: {},
  })(MuiAccordion);

  const courseInstanceComponent = (course: ICourseInstance) => {
    return (
      <Accordion id={"course" + course.instanceId} className="course-card">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className="course-header" style={{ marginRight: "auto" }}>
            {mapCourseIdToName(course.courseId)}
          </Typography>
          <Grid container justifyContent="flex-end">
            {IndicatorIcons(course.instanceId, course.courseId)}
            <Grid item xs={2}>
              <Button
                className="add-button"
                color="primary"
                variant="contained"
                aria-label="outlined primary button"
                onClick={() => addCourse(course.instanceId)}
                disabled={courseIsDuplicate(course.instanceId)}
                size="small"
              >
                <AddIcon />
                Add Course
              </Button>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Paper style={{ width: "100%", height: "auto", padding: "1em" }}>
            <Typography>Class #{course.instanceId}</Typography>
            <hr style={{ color: "#eee" }} />
            <Grid container spacing={3}>
              <Grid item xs={2}>
                <Typography>
                  {mapSlotIdToDay(course.slotId)} | Period{" "}
                  {mapSlotIdToPeriods(course.slotId)}
                </Typography>
                <Typography
                  style={{
                    color: "#285797",
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <RoomIcon /> TBD
                </Typography>
              </Grid>
              <Grid
                item
                xs={5}
                style={{
                  borderStyle: "solid",
                  borderColor: "transparent #eee transparent #eee",
                  borderWidth: "2px",
                }}
              >
                Degree Information Here
              </Grid>
              <Grid item xs={5}>
                <TableContainer>
                  <Table>
                    <TableRow>
                      <TableCell variant="footer">Instructor</TableCell>
                      <TableCell>TBD</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell variant="footer">Meet</TableCell>
                      <TableCell>Primarily Classroom</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell variant="footer">Credits</TableCell>
                      <TableCell>
                        {mapCourseIdToCredits(course.courseId)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell variant="footer">Deparment</TableCell>
                      <TableCell>
                        Computer & Information Science & Engineering
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell variant="footer">Final Exam</TableCell>
                      <TableCell>TBD</TableCell>
                    </TableRow>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Paper>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={3}
        style={{
          backgroundColor: "white",
          paddingLeft: "1em",
          paddingRight: "1em",
          height: "100vh",
        }}
      >
        <Typography variant="h4" style={{ marginBottom: "0.25em" }}>
          Course Search
        </Typography>
        <Typography
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        >
          <SearchIcon /> Required
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Term"
          variant="outlined"
          id="semester-input"
          value={semester}
          onChange={handleSemesterChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Year"
          variant="outlined"
          id="year-input"
          value={year}
          onChange={handleYearChange}
        />
      </Grid>
      <Grid item xs={9} style={{ padding: "1em" }}>
        <Typography
          variant="h3"
          style={{ fontWeight: 200, marginBottom: "0.25em" }}
        >
          Schedule of Courses
        </Typography>
        <Paper>
          <Typography style={{ padding: "1em" }}>
            {courseInstances.length} results
          </Typography>
          {courseInstances.length > 0 ? (
            courseInstances.map((course) => courseInstanceComponent(course))
          ) : (
            <Typography>There are no courses available.</Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};
