import React from "react";
import { Grid, Container } from "@mui/material";

import { useNavigate } from "react-router-dom";

const Customers = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl" style={{ height: "100vh", padding: 0 }}>
      <Grid container style={{ height: "100%" }}>
        <Grid item xs={12} style={{ height: "100%" }}>
          <iframe
            title="Reviews and Rating Dashoard"
            src="https://lookerstudio.google.com/embed/reporting/d34edd2a-1068-4994-8631-ee3be8ab39ed/page/tEnnC"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Customers;
