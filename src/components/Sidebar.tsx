import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { useAppSelector, useAppDispatch } from "../state";
import SettingsIcon from "@material-ui/icons/Settings";
import {
  ButtonGroup,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  FormHelperText,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import {
  IDegreeCourse,
  IRequirementType,
  IStudentCompletedCourse,
  StudentClass,
} from "types/Types";
import ScheduleDialog from "./ScheduleDialog";
import StudentScheduleService from "../services/StudentScheduleService";

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
  updateSchedule: () => void;
  studentId: number;
  allClasses?: StudentClass[];
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

interface CompleteScheduleRequest {
  term: string;
  year: number;
  current_course_ids: number[];
  min_credits: number;
  max_credits: number;
  max_classes: number;
  exclude_ids: number[];
}

interface CompleteScheduleResponse {
  schedule: number[];
  additions: number[];
}

const getRecommendedSchedules = async (
  semester: string,
  year: number,
  currentSchedule: StudentClass[],
  minCredits: number,
  maxCredits: number,
  maxClasses: number
): Promise<number[][]> => {
  let results: number[][] = [];
  let filter = [];
  const currentCourses = currentSchedule.map((x) => x.classId);

  for (let i = 0; i < 3; i++) {
    const payload: CompleteScheduleRequest = {
      term: "Fall",
      year: 2021,
      current_course_ids: currentCourses,
      min_credits: minCredits,
      max_credits: maxCredits,
      max_classes: maxClasses,
      exclude_ids: filter,
    };

    const res = await fetch(
      "https://api.hci.realliance.net/schedule/complete",
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
      let response: CompleteScheduleResponse = await res.json();
      if (response.additions === []) {
        return results;
      } else if (response.schedule === currentCourses) {
        return [];
      }
      results.push(response.additions);
      filter.push(response.additions[0]);
    } else {
      throw res.body;
    }
  }

  return results;
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

const verifyAndSetNumberFieldState = (
  value: string,
  setStateFunc: (param: number) => void,
  minNumber?: number,
  maxNumber?: number
) => {
  let parse = parseInt(value);
  if (parse !== NaN) {
    if (minNumber) {
      parse = Math.max(minNumber, parse);
    }

    if (maxNumber) {
      parse = Math.min(maxNumber, parse);
    }
    setStateFunc(parse);
  }
};

const addCourseOptions = async (ufId: number, classes: StudentClass[]) => {
  const promises = classes.map((classInst) =>
    StudentScheduleService.post({ ufId: ufId, instanceId: classInst.classId })
  );

  return Promise.all(promises);
};

export const Sidebar = ({
  updateSchedule,
  studentId,
  allClasses,
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

  const [minCreditField, setMinCredit] = useState<number | undefined>();
  const [maxCreditField, setMaxCredit] = useState<number | undefined>(18);
  const [maxClasses, setMaxClasses] = useState<number | undefined>();
  const [openDialog, setOpenDialog] = useState(false);
  const [recommendedCourses, setRecommendations] = useState<
    StudentClass[][] | undefined
  >();

  const semesterToLabel: SemesterMap = {
    fall: "Fall",
    spring: "Spring",
    summerC: "Summer",
  };

  useEffect(() => {
    if (studentClasses && requiredCourses && studentCompletedCourses) {
      setMinCredit(
        studentClasses.map((x) => x.credits).reduce((a, b) => a + b, 0)
      );
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

  const completedCoursesIds = studentCompletedCourses
    ? studentCompletedCourses.map((x) => x.courseId)
    : [];
  const requirements = requiredCourses
    ? buildDegreeRequirements(requiredCourses)
    : {};
  let totalCompleted = 0;
  let total = 0;
  const degreeRequirements = requirements
    ? Object.keys(requirements).map((key: string) => {
        const courseIds = requirements[key]!!.map((x) => x.courseId);
        const completedCount =
          courseIds.filter((x) => completedCoursesIds.includes(x)).length + 3;
        totalCompleted += completedCount;
        total += requirements[key]!!.length;
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
                {requirementTypes
                  ? requirementTypes!!.find(
                      (x) => x.requirementType.toString() === key
                    )?.name
                  : null}
              </Typography>
            </Grid>
          </Grid>
        );
      })
    : null;

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

  const getSchedule = () => {
    if (studentClasses) {
      setOpenDialog(true);
      setRecommendations(undefined);
      const minPossibleCredits = studentClasses
        .map((x) => x.credits)
        .reduce((a, b) => a + b, 0);
      getRecommendedSchedules(
        "Fall",
        2021,
        studentClasses,
        minCreditField ? minCreditField : minPossibleCredits,
        maxCreditField ? maxCreditField : 18,
        maxClasses ? maxClasses : 4
      ).then((result) =>
        setRecommendations(
          result.map((optionSet: number[]) =>
            optionSet.map(
              (id: number) =>
                allClasses!!.find((classInst) => classInst.courseId === id)!!
            )
          )
        )
      );
    }
  };

  const scheduleAssistantContent = (
    <Box style={{ padding: "0.5em", paddingLeft: "1em", paddingRight: "1em" }}>
      <Typography variant="h5">Schedule Options</Typography>
      <Typography
        variant="h5"
        style={{
          color: "#285797",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          marginTop: "0.75em",
          marginBottom: "0.5em",
        }}
      >
        <SettingsIcon style={{ marginRight: "0.5em" }} /> Credits
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <TextField
            label="Minimum"
            variant="outlined"
            value={minCreditField ? minCreditField : ""}
            onChange={(v) =>
              verifyAndSetNumberFieldState(v.target.value, setMinCredit)
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Maximum"
            variant="outlined"
            value={maxCreditField ? maxCreditField : ""}
            onChange={(v) =>
              verifyAndSetNumberFieldState(v.target.value, setMaxCredit)
            }
          />
        </Grid>
      </Grid>
      <Typography
        variant="h5"
        style={{
          color: "#285797",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          marginTop: "0.75em",
          marginBottom: "0.5em",
        }}
      >
        <SettingsIcon style={{ marginRight: "0.5em" }} /> Max Courses
      </Typography>
      <TextField
        label="Number"
        variant="outlined"
        value={maxClasses ? maxClasses : ""}
        onChange={(v) =>
          verifyAndSetNumberFieldState(
            v.target.value,
            setMaxClasses,
            studentClasses ? studentClasses.length : undefined
          )
        }
      />
      <Typography
        variant="h5"
        style={{
          color: "#285797",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          marginTop: "0.75em",
          marginBottom: "0.5em",
        }}
      >
        <SettingsIcon style={{ marginRight: "0.5em" }} /> Preferred Instructors
      </Typography>
      <TextField label="Name" variant="outlined" value="N/a" disabled />
      <FormHelperText>Disabled</FormHelperText>
      <Box style={{ marginTop: "3em" }}>
        <hr color="#eee" />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => getSchedule()}
        >
          Generate
        </Button>
      </Box>
    </Box>
  );

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
      <ScheduleDialog
        handleClose={() => setOpenDialog(false)}
        open={openDialog}
        currentSchedule={studentClasses}
        scheduleOptions={recommendedCourses}
        onApplySchedule={(selectedOptions) =>
          addCourseOptions(studentId, selectedOptions)
            .then(() => {
              setOpenDialog(false);
              updateSchedule();
            })
            .catch(() => updateSchedule())
        }
      />
    </>
  );
};
