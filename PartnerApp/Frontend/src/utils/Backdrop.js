import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function CustomBackdrop(props) {
  return (
    <div>
      <Backdrop
        open={props.backdrop}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 2 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
