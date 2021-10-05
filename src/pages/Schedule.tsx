import React from "react";
import Button from "@material-ui/core/Button";
import { useAppSelector, useAppDispatch } from "../state";
import { increment } from "../state/features/example";

export default () => {
  // Observe the counter value
  const count = useAppSelector((state) => state.example.value);

  // Use the app dispatch (see state/index.ts)
  const dispatch = useAppDispatch();

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => dispatch(increment())}
      >
        Increment Count
      </Button>
      <h1>{count}</h1>
    </>
  );
};
