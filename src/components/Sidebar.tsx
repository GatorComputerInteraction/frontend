import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { useAppSelector, useAppDispatch } from "../state";
import { increment } from "../state/features/example";
import {
  ButtonGroup,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { getDefaultMiddleware } from "@reduxjs/toolkit";

//styles
const useStyles = makeStyles({
  title: {
    width: "100%",
    fontSize: "30px",
  },
  track: {
    color: "#000000",
    fontWeight: "bold",
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

export const Sidebar: React.FC = () => {
  // Observe the counter value
  //   const count = useAppSelector((state) => state.example.value);

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = () => {};

  const styles = useStyles();

  const renderStatus = () => {
    return (
      <List>
        <ListItem>hello</ListItem>
        <List>
          <ListItem className={styles.listSubItem}>hello</ListItem>
        </List>
      </List>
    );
  };

  // Use the app dispatch (see state/index.ts)
  const dispatch = useAppDispatch();

  return (
    <Paper>
      <Grid container alignItems="center" justifyContent="center">
        <Grid item xs={12} className={styles.textTop}>
          <Typography className={styles.title}>On Track To Graduate</Typography>
          <Typography variant="h3" className={styles.track}>
            Fall 2023
          </Typography>
        </Grid>
        <Grid item xs={12} className={styles.content}>
          {renderStatus()}
        </Grid>
      </Grid>
    </Paper>
  );
};
