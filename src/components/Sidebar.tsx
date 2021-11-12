import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { useAppSelector, useAppDispatch } from "../state";
import {
  ButtonGroup,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import {
  IDegreeCourse,
  IRequirementType,
  IStudentCompletedCourse,
  StudentClass,
} from "types/Types";

//styles
const useStyles = makeStyles({
  title: {
    width: "100%",
    fontSize: "30px",
  },
  track: {
    color: "#000000",
    fontWeight: "bold",
    textAlign: "center",
  },
  textTop: {
    borderBottom: "1px solid",
    width: "95%",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
  listSubItem: {
    marginLeft: "20px",
  },
});

interface SideBarProps {
  studentClasses?: StudentClass[];
  requiredCourses?: IDegreeCourse[];
  studentCompletedCourses?: IStudentCompletedCourse[];
  requirementTypes?: IRequirementType[];
  degreeName?: string;
}

interface ExpectedGraduationResponse {
  semester: string;
  year: number;
}

interface ExpectedGraduationRequest {
  current_term: string;
  current_year: number;
  required_course_ids: number[];
  completed_course_ids: number[];
  max_fall_spring_credits: number;
  max_total_summer_credits: number;
}

type SemesterMap = {
  [key: string]: string;
};

type RequirementTable = {
  [key: string]: IDegreeCourse[] | undefined;
};

const getPredictedGraduation = async (
  semester: string,
  year: number,
  completedCourses: number[],
  requiredIds: number[]
): Promise<ExpectedGraduationResponse> => {
  const payload: ExpectedGraduationRequest = {
    current_term: "Fall",
    current_year: 2021,
    required_course_ids: [1, 2, 3, 5, 6],
    completed_course_ids: completedCourses,
    max_fall_spring_credits: 4,
    max_total_summer_credits: 4,
  };

  const res = await fetch(
    "https://api.hci.realliance.net/schedule/predict_grad",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      referrerPolicy: "no-referrer",
      body: JSON.stringify(payload),
    }
  );

  if (res.ok) {
    const json = await res.json();
    return {
      semester: json.expected_graduation_semester,
      year: json.expected_graduation_year,
    };
  } else {
    throw res.json();
  }
};

const buildDegreeRequirements = (
  requiredCourses: IDegreeCourse[]
): RequirementTable => {
  let table: RequirementTable = {};
  requiredCourses.forEach((course) => {
    if (table[course.requirementType] === undefined) {
      table[course.requirementType] = [];
    }
    table[course.requirementType] =
      table[course.requirementType]!!.concat(course);
  });

  return table;
};

export const Sidebar = ({
  studentClasses,
  requiredCourses,
  studentCompletedCourses,
  requirementTypes,
  degreeName,
}: SideBarProps) => {
  const [onGraduationStatusPage, setGradStatusPage] = useState(true);
  const [predictedGraduation, setGrad] = useState<
    ExpectedGraduationResponse | undefined
  >();

  const semesterToLabel: SemesterMap = {
    fall: "Fall",
    spring: "Spring",
    summerC: "Summer",
  };

  useEffect(() => {
    if (studentClasses && requiredCourses && studentCompletedCourses) {
      const coursesTaking = studentClasses?.map((sClass) => sClass.courseId);
      const completedCourses = studentCompletedCourses?.map(
        (cClass) => cClass.courseId
      );
      const totalCoursesCompleted = completedCourses?.concat(coursesTaking!!);
      const requiredCourseIds = requiredCourses?.map(
        (rCourse) => rCourse.courseId
      );
      getPredictedGraduation(
        "Fall",
        2021,
        totalCoursesCompleted!!,
        requiredCourseIds!!
      )
        .then((grad) => setGrad(grad))
        .catch(() => {});
    }
  }, [studentClasses, requiredCourses, studentCompletedCourses]);

  const styles = useStyles();

  console.log(studentCompletedCourses);
  const completedCoursesIds = studentCompletedCourses
    ? studentCompletedCourses.map((x) => x.courseId)
    : [];
  const requirements = requiredCourses
    ? buildDegreeRequirements(requiredCourses)
    : {};
  let totalCompleted = 0;
  let total = 0;
  const degreeRequirements = Object.keys(requirements).map((key: string) => {
    const courseIds = requirements[key]!!.map((x) => x.courseId);
    const completedCount =
      courseIds.filter((x) => completedCoursesIds.includes(x)).length + 3;
    totalCompleted += completedCount;
    total += requirements[key]!!.length;
    console.log(completedCoursesIds);
    return (
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative" }}>
              <CircularProgress
                size={45}
                style={{ color: "#ddd", position: "absolute" }}
                variant="determinate"
                value={100}
              />
              <CircularProgress
                size={45}
                variant="determinate"
                value={(completedCount / requirements[key]!!.length) * 100}
              />
            </div>
          </div>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="h6">
            {
              requirementTypes!!.find(
                (x) => x.requirementType.toString() === key
              )?.name
            }
          </Typography>
        </Grid>
      </Grid>
    );
  });

  const loadingSpinner = (
    <div style={{ padding: "1em", display: "flex", justifyContent: "center" }}>
      <CircularProgress />
    </div>
  );

  const graduationStatusContent =
    predictedGraduation !== undefined ? (
      <>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          style={{ padding: "0.25em" }}
        >
          <Grid item xs={12}>
            <Typography
              variant="h5"
              style={{
                fontWeight: 200,
                marginBottom: "0.25em",
                textAlign: "center",
              }}
            >
              On Track to Graduate
            </Typography>
            <Typography variant="h5" className={styles.track}>
              {semesterToLabel[predictedGraduation!!.semester]}{" "}
              {predictedGraduation!!.year}
            </Typography>
            <hr color="#eee" />
          </Grid>
          <Grid item xs={12} className={styles.content}>
            <Grid container alignContent="center" alignItems="center">
              <Grid item xs={2}>
                <div style={{ position: "relative" }}>
                  <CircularProgress
                    size={45}
                    style={{ color: "#ddd", position: "absolute" }}
                    variant="determinate"
                    value={100}
                  />
                  <CircularProgress
                    size={45}
                    variant="determinate"
                    value={(totalCompleted / total) * 100}
                  />
                </div>
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" style={{ fontWeight: 200 }}>
                  {degreeName}
                </Typography>
              </Grid>
            </Grid>
            <Box style={{ padding: "0.5em" }}>{degreeRequirements}</Box>
          </Grid>
        </Grid>
      </>
    ) : null;

  const scheduleAssistantContent = <></>;

  const contentPage = onGraduationStatusPage
    ? graduationStatusContent
    : scheduleAssistantContent;
  const isLoading = studentClasses === undefined ? loadingSpinner : contentPage;

  const statusButtonVariant = onGraduationStatusPage ? "primary" : "default";
  const assistantButtonVariant = !onGraduationStatusPage
    ? "primary"
    : "default";

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ButtonGroup style={{ marginBottom: "0.5em" }}>
          <Button
            variant="contained"
            color={statusButtonVariant}
            onClick={() => setGradStatusPage(true)}
          >
            Graduation Status
          </Button>
          <Button
            variant="contained"
            color={assistantButtonVariant}
            onClick={() => setGradStatusPage(false)}
          >
            Schedule Assistant
          </Button>
        </ButtonGroup>
      </div>
      <Paper style={{ minHeight: "75vh" }}>{isLoading}</Paper>
    </>
  );
};
