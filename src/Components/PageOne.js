import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Card,
  Paper,
  CircularProgress,
  TextField,
  Button,
} from "@material-ui/core";
import { Bar } from "@reactchartjs/react-chart.js";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

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
  const [chartData, setChartData] = useState(null);
  const [limit, setLimit] = useState(30);
  const [offset, setOffset] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    setIsLoaded(false);
    ApiCall(limit, offset, fromDate, toDate);
    return function cleanup() {
      setLimit(30);
      setOffset(1);
      setFromDate("");
      setToDate("");
      setChartData(null);
    };
  }, []);

  const ApiCall = (l, o, f, t) => {
    let fromdate = f ? parseInt(new Date(f).getTime() / 1000).toFixed(0) : "";
    let todate = t ? parseInt(new Date(t).getTime() / 1000).toFixed(0) : "";
    fetch(
      `https://api.stackexchange.com/2.2/tags?order=desc&sort=popular&site=stackoverflow&pagesize=${l}&page=${o}&fromdate=${fromdate}&todate=${todate}`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          formatData(result.items);
          //   console.log(result);
        },
        (error) => {
          setIsLoaded(true);
          console.error(error);
        }
      );
  };

  const formatData = (items) => {
    let values = [];
    let labels = [];
    for (let index = 0; index < items.length; index++) {
      const element = items[index];
      labels.push(element.name);
      values.push(element.count);
    }
    const data = {
      labels: labels,
      datasets: [
        {
          label: "# of Count of Tags",
          data: values,
          backgroundColor: "#112d4e",
        },
      ],
    };
    setChartData(data);
    setIsLoaded(true);
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  //from date, to date, pagesize, page

  const onChange = (value, type) => {
    if (type === "limit") {
      setLimit(value);
    } else if (type === "offset") {
      setOffset(value);
    } else if (type === "toDate") {
      setToDate(value);
      //   console.log(parseInt(new Date(value).getTime() / 1000).toFixed(0));
    } else if (type === "fromDate") {
      setFromDate(value);
    }
  };
  const onSearch = () => {
    setIsLoaded(false);
    ApiCall(limit, offset, fromDate, toDate);
  };

  return (
    <>
      {isLoaded && chartData ? (
        <Grid container spacing={2} className={classes.grid}>
          <Grid item md={12}>
            <Typography variant="h4" gutterBottom>
              Bar Chart for Languages
            </Typography>
          </Grid>
          <Grid item container spacing={1} md={12}>
            <Grid item md={1}>
              <Typography variant="subtitle2" gutterBottom>
                Filters:
              </Typography>
            </Grid>
            <Grid item md={2}>
              <TextField
                label="Page Size"
                value={limit}
                onChange={(event) => {
                  onChange(event.target.value, "limit");
                }}
                variant="filled"
              />
            </Grid>
            <Grid item md={2}>
              <TextField
                label="Page"
                value={offset}
                onChange={(event) => {
                  onChange(event.target.value, "offset");
                }}
                variant="filled"
              />
            </Grid>
            <Grid item md={2}>
              <DatePicker
                selected={fromDate}
                onChange={(date) => onChange(date, "fromDate")}
                isClearable
                placeholderText="From Date"
              />
            </Grid>
            <Grid item md={2}>
              <DatePicker
                selected={toDate}
                onChange={(date) => onChange(date, "toDate")}
                isClearable
                placeholderText="To Date"
              />
            </Grid>
            <Grid item md={2}>
              <Button variant="contained" color="secondary" onClick={onSearch}>
                {"Search >"}
              </Button>
            </Grid>
          </Grid>
          <Grid item md={12}>
            <Card style={{ padding: "10px" }}>
              <Bar data={chartData} options={options} />
            </Card>
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
