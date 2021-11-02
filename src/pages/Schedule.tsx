import React from "react";
import Button from "@material-ui/core/Button";
import { useAppSelector, useAppDispatch } from "../state";
import { Sidebar } from "../components/Sidebar";
import { increment } from "../state/features/example";
import { ButtonGroup, Grid, Paper, Typography } from "@material-ui/core";

export default () => {
  // Observe the counter value
  // const count = useAppSelector((state) => state.example.value);

  // Use the app dispatch (see state/index.ts)
  const dispatch = useAppDispatch();

  return (
    <>
      <Paper>
        <Grid container spacing={2}>
          <Grid item xs={8} alignItems="center" justifyContent="center">
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

          <Grid item xs={4} style={{ padding: "1em" }}>
            <Sidebar></Sidebar>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
