import React from "react";
import { Grid, Container } from "@mui/material";

import { useNavigate } from "react-router-dom";

const Reviews = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl" style={{ height: "100vh", padding: 0 }}>
      <Grid container style={{ height: "100%" }}>
        <Grid item xs={12} style={{ height: "100%" }}>
          <iframe
            title="Reviews and Rating Dashoard"
            src="https://lookerstudio.google.com/embed/reporting/5120035c-3935-493a-986b-ba2523b4a407/page/wdnjD"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Reviews;
