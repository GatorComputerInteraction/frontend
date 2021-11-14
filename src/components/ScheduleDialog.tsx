import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { StudentClass } from "../types/Types";
import ClassCard from "./ClassCard";

interface ScheduleDialogProps {
  handleClose: () => void;
  open: boolean;
  currentSchedule?: StudentClass[];
  scheduleOptions?: StudentClass[][];
  onApplySchedule: (option: StudentClass[]) => void;
}

export default ({
  open,
  handleClose,
  scheduleOptions,
  currentSchedule,
  onApplySchedule,
}: ScheduleDialogProps) => {
  const [optionSelected, setSelected] = useState<number>(0);
  const [prevOpenState, setPrevOpenState] = useState<boolean>(open);

  const loadingSpinner = (
    <div style={{ padding: "1em", display: "flex", justifyContent: "center" }}>
      <CircularProgress />
    </div>
  );

  const schedules = !scheduleOptions
    ? []
    : scheduleOptions.filter((x) => x.length > 0);

  const options = !currentSchedule
    ? null
    : schedules.map((options) =>
        currentSchedule
          .map((classInst) => <ClassCard studentClass={classInst} />)
          .concat(
            options.map((classInst) => (
              <ClassCard studentClass={classInst} newCourse />
            ))
          )
      );

  const option =
    options && options.length > 0 ? (
      options[optionSelected]
    ) : (
      <Typography>
        Looks like no recommendations are possible with your settings, try
        again.
      </Typography>
    );

  if (prevOpenState !== open) {
    setPrevOpenState(open);
    setSelected(0);
  }

  const content = scheduleOptions ? option : loadingSpinner;

  const selectMenuOptions = currentSchedule
    ? schedules.map((option, i) => (
        <MenuItem value={i}>
          Option {i + 1} | Credits:{" "}
          {currentSchedule
            .concat(option)
            .map((x) => x.credits)
            .reduce((a, b) => a + b)}
        </MenuItem>
      ))
    : null;

  const hasOptions = scheduleOptions && schedules.length > 0;
  const selectMenu = hasOptions ? (
    <FormControl variant="outlined" style={{ marginBottom: "0.5em" }}>
      <InputLabel>Option</InputLabel>
      <Select
        autoWidth
        label="Option"
        value={optionSelected}
        onChange={(t) => setSelected(t.target.value as number)}
      >
        {selectMenuOptions}
      </Select>
    </FormControl>
  ) : null;

  const buttons = hasOptions ? (
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Cancel
      </Button>
      <Button
        onClick={() => onApplySchedule(scheduleOptions!![optionSelected])}
        color="primary"
      >
        Apply Schedule
      </Button>
    </DialogActions>
  ) : (
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Close
      </Button>
    </DialogActions>
  );

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={handleClose}>
      <DialogTitle>Our Recommended Schedule</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Here is some recommended additions to your schedule based on your
          input and degree.
        </DialogContentText>
        {selectMenu}
        {content}
      </DialogContent>
      {buttons}
    </Dialog>
  );
};
