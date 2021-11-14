import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { useAppSelector, useAppDispatch } from "../state";
import { Sidebar } from "../components/Sidebar";
import {
  ButtonGroup,
  Container,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";

import StudentService from "../services/StudentService";
import StudentScheduleService from "../services/StudentScheduleService";
import CourseInstanceService from "../services/CourseInstanceService";
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
      (timeslot) => (inst.slotId = timeslot.slotId)
    );
    return {
      courseId: inst.courseId,
      classId: inst.instanceId,
      courseName: course!!.courseName,
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
      (timeslot) => (inst.slotId = timeslot.slotId)
    );
    return {
      courseId: inst.courseId,
      classId: inst.instanceId,
      courseName: course!!.courseName,
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

  // Observe the counter value
  const studentId = useAppSelector((state) => state.student.id);

  // Use the app dispatch (see state/index.ts)
  const dispatch = useAppDispatch();

  useEffect(() => {
    getStudent();
  }, []);

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

  const classCards = studentSchedule?.map((studentClass) => (
    <ClassCard studentClass={studentClass} />
  ));

  return (
    <Container maxWidth="lg">
      <Paper>
        <Grid container spacing={2} style={{ padding: "0.75em" }}>
          <Grid item xs={12}>
            <Grid container justifyContent="space-between">
              <Grid item xs={4}>
                <Typography variant="h6">
                  {student?.firstName} {student?.lastName}
                </Typography>
                <Typography variant="body2" color="secondary">
                  Credits: #
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <ButtonGroup
                  variant="contained"
                  color="primary"
                  aria-label="outlined primary button group"
                >
                  <Button>List</Button>
                  <Button>Week</Button>
                  <Button>Map</Button>
                </ButtonGroup>
              </Grid>
              <Grid item xs={4}>
                <Button
                  className="addcoursebutton"
                  color="primary"
                  aria-label="outlined primary button"
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
            {classCards}
          </Grid>
          <Grid item xs={4}>
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
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};
