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

interface ClassCardParams {
  studentClass: StudentClass;
}

export default ({ studentClass }: ClassCardParams) => {
  console.log(studentClass);
  const timeslots = studentClass.periods
    .filter((slot) => slot !== null)
    .join(", ");
  const periodLabel = timeslots.length > 1 ? "Periods" : "Period";

  return (
    <Paper
      style={{
        marginBottom: "0.5em",
        borderLeftColor: "#285797",
        borderLeftStyle: "solid",
        borderLeftWidth: "5px",
      }}
    >
      <Grid container style={{ padding: "0.5em" }}>
        <Grid item xs={6}>
          <Typography>
            <b>{studentClass.courseName}</b>
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
