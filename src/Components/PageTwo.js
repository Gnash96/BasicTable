import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, CircularProgress } from "@material-ui/core";

const useStyles = makeStyles({
  grid: {
    padding: "40px",
  },
  spinnerContainer: {
    display: "flex",
    justifyContent: "center",
    height: "60vh",
    alignItems: "center",
  },
});

export default function BasicTable() {
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = useState(false);
  const [query, setQuery] = useState(null);

  useEffect(() => {
    setIsLoaded(false);
    let query = new URLSearchParams(document.location.search).get("q") || null;
    if (query) {
      navigator.clipboard.writeText(query);
    }
    setQuery(query);
    setIsLoaded(true);
    return function cleanup() {
      setQuery(null);
    };
  }, []);

  return (
    <>
      {isLoaded ? (
        <Grid container spacing={2} className={classes.grid}>
          <Grid item md={12}>
            <Typography variant="h4" gutterBottom>
              {`Your Typed QueryParams from URL==> `} <i>{query}</i>
            </Typography>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2} className={classes.spinnerContainer}>
          <CircularProgress />
        </Grid>
      )}
    </>
  );
}
