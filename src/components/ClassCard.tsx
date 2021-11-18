import {
  Grid,
  Paper,
  Typography,
  TableContainer,
  TableRow,
  TableCell,
  Table,
} from "@material-ui/core";
import React from "react";
import { StudentClass } from "../types/Types";
import RoomIcon from "@material-ui/icons/Room";
import AddIcon from "@material-ui/icons/Add";

interface ClassCardParams {
  studentClass: StudentClass;
  newCourse?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export default ({
  studentClass,
  newCourse,
  onClick,
  selected,
}: ClassCardParams) => {
  const timeslots = studentClass.periods
    .filter((slot) => slot !== null)
    .join(", ");
  const periodLabel = timeslots.length > 1 ? "Periods" : "Period";

  return (
    <Paper
      style={{
        marginBottom: "0.5em",
        borderLeftColor: newCourse ? "#7DA64E" : "#285797",
        borderLeftStyle: "solid",
        borderLeftWidth: "5px",
        backgroundColor: selected ? "#EFF4FB" : "#FFFFFF",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <Grid container style={{ padding: "0.5em" }}>
        <Grid item xs={6}>
          <Typography
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {newCourse ? <AddIcon /> : null}
            <b>
              {studentClass.courseName} - {studentClass.friendlyName}
            </b>
          </Typography>
          <Typography>Class #{studentClass.classId}</Typography>
          <br />
          <Typography>
            {studentClass.day} | {periodLabel} {timeslots}
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
        <Grid item xs={6}>
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
        </Grid>
      </Grid>
    </Paper>
  );
};
