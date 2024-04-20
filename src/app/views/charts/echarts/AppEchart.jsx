import { Box, styled, useTheme } from "@mui/material";

import Breadcrumb from "app/components/Breadcrumb";
import SimpleCard from "app/components/SimpleCard";

import AreaChart from "./AreaChart";
import LineChart from "./LineChart";
import DoughnutChart from "./Doughnut";
import ComparisonChart from "./ComparisonChart";
import { useQuery } from "@tanstack/react-query";
import { getNewUserByMonth, getRevByMonth, getSaleTrend } from "api/dashboardApi";

// STYLED COMPONENT
const Container = styled("div")(({ theme }) => ({
  margin: 30,
  [theme.breakpoints.down("sm")]: { margin: 16 },
  "& .breadcrumb": { marginBottom: 30, [theme.breakpoints.down("sm")]: { marginBottom: 16 } }
}));

export default function AppEchart() {
  function getCurrentMonth() {
    const date = new Date();
    const month = date.getMonth() + 1; // JavaScript months are 0-11, so we add 1 to get the current month
    return month;
  }

  function getPreviousMonth() {
    const date = new Date();
    let month = date.getMonth(); // JavaScript months are 0-11, so we subtract 1 to get the previous month
    if (month === 0) {
      // If the current month is January (0), the previous month is December (12)
      month = 12;
    }
    return month;
  }

  const currentMonth = getCurrentMonth();
  const previousMonth = getPreviousMonth();

  const trendQueryCurrentMonth = useQuery({
    queryKey: ["saleTrend", currentMonth],
    queryFn: () => getSaleTrend({ month: currentMonth })
  });

  const trendQueryPreviousMonth = useQuery({
    queryKey: ["saleTrend", previousMonth],
    queryFn: () => getSaleTrend({ month: previousMonth })
  });
  const theme = useTheme();

  const newUserQuery = useQuery({
    queryKey: ["userByMonths"],
    queryFn: () => getNewUserByMonth({ noMonths: 6 })
  });

  const revenueQuery = useQuery({
    queryKey: ["revenueBymonths"],
    queryFn: () => getRevByMonth({ noMonths: 6 })
  });

  // if (trendQuery.isSuccess) {
  //   console.log(trendQuery.data);
  // }
  // if (revenueQuery.isSuccess) {
  //   console.log(revenueQuery.data);
  // }

  return (
    <Container>
      <Box sx={{ py: "12px" }} />

      <SimpleCard title="Sale Trend (orders/dayofweek)">
        {trendQueryCurrentMonth.isSuccess && trendQueryPreviousMonth.isSuccess && (
          <LineChart
            height="350px"
            color={["#53609D", "aqua"]}
            currMonth={trendQueryCurrentMonth.data.data}
            prevMonth={trendQueryPreviousMonth.data.data}
            type={"trend"}
          />
        )}
      </SimpleCard>

      <Box sx={{ py: "12px" }} />

      <SimpleCard title="Total revenue (VNĐ/month)">
        {revenueQuery.isSuccess && (
          <ComparisonChart
            height="350px"
            color={[theme.palette.primary.dark, theme.palette.primary.light]}
            data={revenueQuery.data.data}
          />
        )}
      </SimpleCard>

      <Box sx={{ py: "12px" }} />

      <SimpleCard title="New users (user)">
        {newUserQuery.isSuccess && (
          <LineChart
            height="350px"
            color={[theme.palette.primary.main, theme.palette.primary.light]}
            currMonth={newUserQuery.data.data}
            type="user"
          />
        )}
      </SimpleCard>
    </Container>
  );
}
