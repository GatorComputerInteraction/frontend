import React, { useState, useEffect, ChangeEvent } from "react";
import Button from "@material-ui/core/Button";
import { useAppSelector, useAppDispatch } from "../state";
import { increment } from "../state/features/example";
import { ButtonGroup, Grid, Paper, Typography } from "@material-ui/core";

import StudentService from "../services/StudentService";
import IStudent from "../types/Types";

export default () => {
  const initialStudentState = {
    ufId: -1,
    firstName: "",
    lastName: "",
    degreeId: -1,
  };
  const [student, setStudent] = useState<IStudent>(initialStudentState);

  // Observe the counter value
  const count = useAppSelector((state) => state.example.value);

  // Use the app dispatch (see state/index.ts)
  const dispatch = useAppDispatch();

  useEffect(() => {
    getStudent();
  }, []);

  const getStudent = () => {
    StudentService.getById(10001000)
      .then((response) => {
        setStudent(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <Paper>
        <Grid container spacing={2}>
          <Grid item xs={5} style={{ padding: "1em" }}>
            <Typography>{student.ufId}</Typography>
            <Typography>{student.firstName}</Typography>
            <Typography>{student.lastName}</Typography>
            <Typography>{student.degreeId}</Typography>
            <Typography variant="body2" color="secondary">
              Credits: #
            </Typography>
          </Grid>
          <Grid item xs={7} style={{ padding: "1em" }}>
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
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={8} style={{ padding: "1em" }}>
            <Typography>Name</Typography>
            <Typography variant="body2" color="secondary">
              Credits: #
            </Typography>
          </Grid>
          <Grid item xs={4} style={{ padding: "1em" }}>
            <Typography>Name</Typography>
            <Typography variant="body2" color="secondary">
              Credits: #
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
