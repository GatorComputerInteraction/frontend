import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { useAppSelector, useAppDispatch } from "../state";
import { Sidebar } from "../components/Sidebar";
import {
  Box,
  ButtonGroup,
  Container,
  Grid,
  IconButton,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

import StudentService from "../services/StudentService";
import StudentScheduleService from "../services/StudentScheduleService";
import CourseInstanceService from "../services/CourseInstanceService";
import RoomIcon from "@material-ui/icons/Room";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import {
  ICourseInstance,
  IDegreeCourse,
  IRequirementType,
  IStudent,
  IStudentCompletedCourse,
  IStudentSchedule,
  StudentClass,
} from "../types/Types";
import "./Schedule.css";
import CourseService from "../services/CourseService";
import TimeslotService from "../services/TimeslotService";
import ClassCard from "../components/ClassCard";
import DegreeCourseService from "../services/DegreeCourseService";
import StudentCompletedCourseService from "../services/StudentCompletedCourseService";
import RequirementTypeService from "../services/RequirementTypeService";
import DegreeService from "../services/DegreeService";
import CloseIcon from "@material-ui/icons/Close";

const getStudentSchedule = async (
  studentId: number
): Promise<[StudentClass[], StudentClass[]]> => {
  const res = await StudentScheduleService.getByUfId(studentId);
  const classes = res.data;
  const instanceIds = classes.map((classObj) => classObj.instanceId);
  const courseInstancesRes = await CourseInstanceService.getAll();
  const courseInstances = courseInstancesRes.data;
  const studentClassInstances = courseInstances.filter((item) =>
    instanceIds.includes(item.instanceId)
  );
  const coursesRes = await CourseService.getAll();
  const courses = coursesRes.data;
  const timeslotsRes = await TimeslotService.getAll();
  const timeslots = timeslotsRes.data;
  const studentClasses: StudentClass[] = studentClassInstances.map((inst) => {
    const course = courses.find((course) => course.courseId == inst.courseId);
    const timeslot = timeslots.find(
      (timeslot) => inst.slotId == timeslot.slotId
    );
    return {
      courseId: inst.courseId,
      classId: inst.instanceId,
      courseName: course!!.courseName,
      friendlyName: course!!.friendlyName,
      credits: course!!.credits,
      semester: inst.semester,
      year: inst.year,
      day: timeslot!!.day,
      periods: [
        timeslot!!.periodId1,
        timeslot!!.periodId2,
        timeslot!!.periodId3,
      ],
    };
  });

  const allClasses: StudentClass[] = courseInstances.map((inst) => {
    const course = courses.find((course) => course.courseId == inst.courseId);
    const timeslot = timeslots.find(
      (timeslot) => inst.slotId == timeslot.slotId
    );
    return {
      courseId: inst.courseId,
      classId: inst.instanceId,
      courseName: course!!.courseName,
      friendlyName: course!!.friendlyName,
      credits: course!!.credits,
      semester: inst.semester,
      year: inst.year,
      day: timeslot!!.day,
      periods: [
        timeslot!!.periodId1,
        timeslot!!.periodId2,
        timeslot!!.periodId3,
      ],
    };
  });

  return [allClasses, studentClasses];
};

const dropCourse = async (ufId: number, courseNumber: number) =>
  StudentScheduleService.drop({ ufId, instanceId: courseNumber });

export default () => {
  let history = useHistory();

  const [student, setStudent] = useState<IStudent | undefined>();
  const [allClasses, setAllClasses] = useState<StudentClass[] | undefined>();
  const [studentSchedule, setStudentSchedule] = useState<
    StudentClass[] | undefined
  >();
  const [requiredCourses, setRequiredCourses] = useState<
    IDegreeCourse[] | undefined
  >();
  const [studentCompletedCourses, setCompletedCourses] = useState<
    IStudentCompletedCourse[] | undefined
  >();
  const [requirementTypes, setRequirementTypes] = useState<
    IRequirementType[] | undefined
  >();
  const [degreeName, setDegreeName] = useState<string | undefined>();

  const [courseSelected, setCourseSelected] = useState<number | undefined>();

  // Observe the counter value
  const studentId = useAppSelector((state) => state.student.id);

  // Use the app dispatch (see state/index.ts)
  const dispatch = useAppDispatch();

  useEffect(() => {
    getStudent();
  }, []);

  //loading spinner
  const loadingSpinner = (
    <div style={{ padding: "1em", display: "flex", justifyContent: "center" }}>
      <CircularProgress />
    </div>
  );

  const getStudent = () => {
    StudentService.getById(studentId)
      .then((response) => {
        setStudent(response.data);
        DegreeCourseService.getByDegreeId(response.data.degreeId).then(
          (res) => {
            setRequiredCourses(res.data);
          }
        );

        DegreeService.getAll().then((res) =>
          setDegreeName(
            res.data.find((x) => x.degreeId == response.data.degreeId)
              ?.degreeName
          )
        );
      })
      .catch((e) => {
        console.log(e);
      });

    getStudentSchedule(studentId).then(([allClasses, classes]) => {
      setAllClasses(allClasses);
      setStudentSchedule(classes);
    });

    StudentCompletedCourseService.getAll().then((res) => {
      const completedCourses = res.data.filter(
        (course) => course.ufId == studentId
      );
      setCompletedCourses(completedCourses);
    });

    RequirementTypeService.getAll().then((res) => {
      setRequirementTypes(res.data);
    });
  };

  const classCards = studentSchedule?.map((studentClass, index) => (
    <ClassCard
      key={studentClass.classId}
      studentClass={studentClass}
      selected={index === courseSelected}
      onClick={() => setCourseSelected(index)}
    />
  ));

  const courseSelectedSideBar = (studentClass: StudentClass) => {
    const timeslots = studentClass.periods
      .filter((slot) => slot !== null)
      .join(", ");
    const periodLabel = timeslots.length > 1 ? "Periods" : "Period";
    return (
      <Box
        style={{
          padding: "1em",
          minHeight: "75vh",
          borderLeftColor: "#eee",
          borderLeftStyle: "solid",
          borderLeftWidth: "1px",
        }}
      >
        <Grid
          container
          style={{
            borderLeftColor: "#285797",
            borderLeftStyle: "solid",
            borderLeftWidth: "5px",
            padding: "1em",
            backgroundColor: "#eee",
            minHeight: "3em",
          }}
          alignItems="center"
        >
          <Grid item xs={10}>
            <Typography>
              <b>
                {studentClass.courseName} - {studentClass.friendlyName}
              </b>
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <IconButton onClick={() => setCourseSelected(undefined)}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
        <br />
        <Typography variant="h6">Class #{studentClass.classId}</Typography>
        <br />
        <Typography>
          {studentClass.day} | {periodLabel} {timeslots}
        </Typography>
        <br />
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
        <br />
        <TableContainer>
          <Table size="small">
            <TableRow>
              <TableCell
                variant="footer"
                style={{ borderBottomColor: "transparent" }}
              >
                Instructor
              </TableCell>
              <TableCell style={{ borderBottomColor: "transparent" }}>
                TBD
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                variant="footer"
                style={{ borderBottomColor: "transparent" }}
              >
                Credits
              </TableCell>
              <TableCell style={{ borderBottomColor: "transparent" }}>
                {studentClass.credits}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                variant="footer"
                style={{ borderBottomColor: "transparent" }}
              >
                Grading Basis
              </TableCell>
              <TableCell style={{ borderBottomColor: "transparent" }}>
                Letter Grade
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                variant="footer"
                style={{ borderBottomColor: "transparent" }}
              >
                Final Exam
              </TableCell>
              <TableCell style={{ borderBottomColor: "transparent" }}>
                TBD
              </TableCell>
            </TableRow>
          </Table>
        </TableContainer>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<DeleteIcon />}
              onClick={() => {
                dropCourse(studentId, studentClass.classId).then(() =>
                  window.location.reload()
                );
              }}
            >
              Drop
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              disabled
              variant="outlined"
              color="primary"
              startIcon={<SwapHorizIcon />}
            >
              Swap
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const sideBarContent =
    studentSchedule && courseSelected !== undefined ? (
      courseSelectedSideBar(studentSchedule!![courseSelected])
    ) : (
      <Sidebar
        updateSchedule={() => window.location.reload()}
        studentId={studentId}
        allClasses={allClasses}
        studentClasses={studentSchedule}
        requiredCourses={requiredCourses}
        studentCompletedCourses={studentCompletedCourses}
        requirementTypes={requirementTypes}
        degreeName={degreeName}
      />
    );

  const credits = studentSchedule
    ? studentSchedule.map((x) => x.credits).reduce((a, b) => a + b)
    : 0;

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        style={{ fontWeight: 200, marginBottom: "1em", marginTop: "1em" }}
      >
        My Schedule - Fall 2021
      </Typography>
      <Paper>
        <Grid container spacing={2} style={{ padding: "0.75em" }}>
          <Grid item xs={12}>
            <Grid container justifyContent="space-between">
              <Grid item xs={4}>
                <Typography variant="h6" style={{ fontWeight: 300 }}>
                  {student?.firstName} {student?.lastName}
                </Typography>
                <Typography variant="body2" color="secondary">
                  Credits: {studentSchedule ? credits : "-"}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <ButtonGroup
                  variant="contained"
                  color="primary"
                  aria-label="outlined primary button group"
                  fullWidth
                >
                  <Button>List</Button>
                  <Button color="secondary" disabled>
                    Week
                  </Button>
                  <Button color="secondary" disabled>
                    Map
                  </Button>
                </ButtonGroup>
              </Grid>
              <Grid item xs={4}>
                <Button
                  className="addcoursebutton"
                  color="primary"
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    history.push("/signup");
                  }}
                >
                  Add Course
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8}>
            {studentSchedule ? classCards : loadingSpinner}
          </Grid>
          <Grid item xs={4}>
            {sideBarContent}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};
