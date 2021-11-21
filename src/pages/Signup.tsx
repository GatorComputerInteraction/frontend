import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Button,
  AccordionSummary,
  AccordionDetails,
  TableContainer,
  TableRow,
  TableCell,
  Table,
  Chip,
  TextField,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  FormHelperText,
  CircularProgress,
} from "@material-ui/core";
import MuiAccordion from "@material-ui/core/Accordion";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import StarIcon from "@material-ui/icons/Star";
import RoomIcon from "@material-ui/icons/Room";
import ExitIcon from "@material-ui/icons/ExitToApp";
import SearchIcon from "@material-ui/icons/Search";
import { withStyles } from "@material-ui/styles";

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
import { useHistory } from "react-router-dom";

export default () => {
  let history = useHistory();

  // states for interface options
  const studentId = 10001000;
  const [semester, setSemester] = React.useState("Fall");
  const [year, setYear] = React.useState(2021);
  const [course, setCourse] = React.useState("");
  const [classNumber, setClassNumber] = React.useState("");
  const handleSemesterChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSemester(String(event.target.value));
  };
  const handleYearChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setYear(parseInt(String(event.target.value)));
  };
  const handleCourseChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCourse(String(event.target.value));
  };
  const handleClassNumberChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setClassNumber(String(event.target.value));
  };

  // default options values
  const defaultProgramLevel = "Undergraduate";
  const defaultDepartment = "Computer & Information Science & Engineering";

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
  const [courseInstNum, setCourseInstNum] = useState<Number>(-1);
  const [studentDegree, setStudentDegree] = useState<Array<IDegreeCourse>>([]);
  const [requirementType, setRequirementType] = useState<
    Array<IRequirementType>
  >([]);
  const [timeslots, setTimeslots] = useState<Array<ITimeslot>>([]);

  useEffect(() => {
    getStudent();
    getCourses();
    getCourseInstances();
    getRequirementType();
    getStudentSchedule();
    getTimeSlots();
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
        var data = response.data;
        setCourseInstNum(response.data.length);
        if (course != "") {
          var data = data.filter((x) => {
            var c = courses
              .find((y) => y.courseId == x.courseId)
              ?.courseName.toLowerCase();
            return (
              c &&
              (c.startsWith(course.toLowerCase()) || c == course.toLowerCase())
            );
          });
        }
        if (classNumber != "") {
          var data = courseInstances.filter(
            (x) =>
              x.instanceId
                .toString()
                .toLowerCase()
                .startsWith(classNumber.toLowerCase()) ||
              x.instanceId == parseInt(classNumber)
          );
        }
        setCourseInstances(data);
        setCourse("");
        setClassNumber("");
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
        console.log(response.data);
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

  const mapCourseToRequirements = (id: number) => {
    return studentDegree.filter((record) => record.courseId == id);
  };

  const mapRequirementToName = (type: number) => {
    return requirementType.find((req) => req.requirementType == type)?.name;
  };

  const courseIsDuplicate = (id: number) => {
    return (
      studentSchedule.find((record) => record.instanceId == id) !== undefined
    );
  };

  const courseIsRequired = (id: number) => {
    return studentDegree.find((record) => record.courseId == id) !== undefined;
  };

  //loading spinner
  const loadingSpinner = (
    <div style={{ padding: "1em", display: "flex", justifyContent: "center" }}>
      <CircularProgress />
    </div>
  );

  const renderCourseInstances = () => {
    if (courseInstances.length > 0) {
      return courseInstances.map((course) => courseInstanceComponent(course));
    } else {
      return (
        <Typography style={{ padding: "1em" }}>
          There are no courses available.
        </Typography>
      );
    }
  };

  const IndicatorIcons = (instanceId: number, courseId: number) => {
    return (
      <Grid item xs={2}>
        {courseIsRequired(courseId) ? (
          <Grid item xs={1}>
            <Chip
              color="primary"
              variant="outlined"
              icon={<StarIcon />}
              label="Required"
            />
          </Grid>
        ) : null}

        {courseIsDuplicate(instanceId) ? (
          <Grid item xs={1}>
            <Chip variant="outlined" icon={<CheckIcon />} label="Scheduled" />
          </Grid>
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
          <Grid container>
            <Grid item xs={10}>
              <Typography className="course-header">
                {mapCourseIdToName(course.courseId)}{" "}
                {courses
                  ? `- ${
                      courses.find((x) => x.courseId === course.courseId)
                        ?.friendlyName
                    }`
                  : null}
              </Typography>
            </Grid>
            {IndicatorIcons(course.instanceId, course.courseId)}
            <Grid item xs={12}>
              <Typography variant="caption">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Paper style={{ width: "100%", height: "auto", padding: "1em" }}>
            <div style={{ display: "flow-root" }}>
              <Typography style={{ float: "left", lineHeight: "32px" }}>
                Class #{course.instanceId}
              </Typography>
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
            </div>
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
                <TableRow>
                  <Typography variant="subtitle2">
                    Fulfilled Degree Requirements
                  </Typography>
                </TableRow>
                <TableRow>
                  <Typography variant="body2">
                    <ul>
                      {mapCourseToRequirements(course.courseId)?.map(
                        (req: IDegreeCourse) => (
                          <li>{mapRequirementToName(req.requirementType)}</li>
                        )
                      )}
                    </ul>
                  </Typography>
                </TableRow>
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
        xs={2}
        style={{
          backgroundColor: "white",
          paddingLeft: "1.5em",
          paddingRight: "1.5em",
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
        <Grid style={{ marginTop: "15px" }}>
          <FormControl fullWidth>
            <InputLabel
              id="semester-input-label"
              variant="outlined"
              margin="dense"
            >
              Semester
            </InputLabel>
            <Select
              labelId="semester-input-label"
              id="semester-input"
              variant="outlined"
              value={semester}
              label="Semester"
              onChange={handleSemesterChange}
            >
              <MenuItem value={"Fall"}>Fall</MenuItem>
              <MenuItem value={"Spring"}>Spring</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth disabled style={{ marginTop: "15px" }}>
            <InputLabel id="year-input-label" variant="outlined" margin="dense">
              Year
            </InputLabel>
            <Select
              labelId="year-input-label"
              id="year-input"
              variant="outlined"
              value={year}
              label="Year"
              onChange={handleYearChange}
            >
              <MenuItem value={2020}>2020</MenuItem>
              <MenuItem value={2021}>2021</MenuItem>
              <MenuItem value={2022}>2022</MenuItem>
            </Select>
            <FormHelperText>Disabled</FormHelperText>
          </FormControl>
          <TextField
            fullWidth
            margin="dense"
            label="Course"
            variant="outlined"
            id="course-input"
            helperText="Ex: COP3502"
            value={course}
            onChange={handleCourseChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Class Number"
            variant="outlined"
            id="classNumber-input"
            helperText="Ex: 12345"
            value={classNumber}
            onChange={handleClassNumberChange}
          />
          <TextField
            fullWidth
            disabled
            margin="dense"
            label="Course Title"
            variant="outlined"
            id="course-title-input"
            helperText="Part or all of Title or Keyword"
          />
          <TextField
            fullWidth
            disabled
            margin="dense"
            label="Instructor"
            variant="outlined"
            id="instructor-input"
            helperText="Instructor Last Name"
          />
        </Grid>
        <FormControl fullWidth disabled style={{ marginTop: "15px" }}>
          <InputLabel
            id="program-level-input-label"
            variant="outlined"
            margin="dense"
          >
            Program Level
          </InputLabel>
          <Select
            labelId="program-level-input-label"
            id="program-level-input"
            variant="outlined"
            value={defaultProgramLevel}
            label="Program Level"
          >
            <MenuItem value={"Undergraduate"}>Undergraduate</MenuItem>
          </Select>
          <FormHelperText>Disabled</FormHelperText>
        </FormControl>
        <FormControl fullWidth disabled style={{ marginTop: "15px" }}>
          <InputLabel
            id="department-input-label"
            variant="outlined"
            margin="dense"
          >
            Departments
          </InputLabel>
          <Select
            labelId="department-input-label"
            id="department-input"
            variant="outlined"
            value={defaultDepartment}
            label="Departments"
          >
            <MenuItem value={"Computer & Information Science & Engineering"}>
              Computer & Information Science & Engineering
            </MenuItem>
          </Select>
          <FormHelperText>Disabled</FormHelperText>
        </FormControl>
        <Button
          aria-label="Search"
          variant="contained"
          color="primary"
          fullWidth
          style={{ bottom: 0 }}
          onClick={() => getCourseInstances()}
        >
          Search
        </Button>
      </Grid>
      <Grid item xs={10} style={{ padding: "1em" }}>
        <Grid container alignItems="center">
          <Grid item xs={8}>
            <Typography
              variant="h3"
              style={{ fontWeight: 200, marginBottom: "0.25em" }}
            >
              Schedule of Courses
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Button
              className="addcoursebutton"
              color="primary"
              startIcon={<ExitIcon />}
              onClick={() => {
                history.push("/");
              }}
            >
              Return to Schedule
            </Button>
          </Grid>
        </Grid>
        <Paper>
          <Typography style={{ padding: "1em" }}>
            {courseInstances.length} results
          </Typography>
          {courseInstNum == -1 ? loadingSpinner : renderCourseInstances()}
        </Paper>
      </Grid>
    </Grid>
  );
};
