import { Box, Card, MenuItem, Select, styled, useTheme } from "@mui/material";
import SimpleCard from "app/components/SimpleCard";
import LineChart from "./LineChart";

import ComparisonChart from "./ComparisonChart";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNewUserByMonth, getRevByMonth, getRevByYear, getSaleTrend } from "api/dashboardApi";
import { useState } from "react";

// STYLED COMPONENT
const Container = styled("div")(({ theme }) => ({
  margin: 30,
  [theme.breakpoints.down("sm")]: { margin: 16 },
  "& .breadcrumb": { marginBottom: 30, [theme.breakpoints.down("sm")]: { marginBottom: 16 } }
}));

// STYLED COMPONENTS
const CardHeader = styled(Box)(() => ({
  display: "flex",
  paddingLeft: "24px",
  paddingRight: "24px",
  marginBottom: "12px",
  alignItems: "center",
  justifyContent: "space-between"
}));

const Title = styled("span")(() => ({
  fontSize: "1rem",
  fontWeight: "500",
  textTransform: "capitalize"
}));

export default function AppEchart() {
  // const queryClient = useQueryClient();
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
  function getRecentYears() {
    const currentYear = new Date().getFullYear();
    return [currentYear, currentYear - 1, currentYear - 2];
  }

  const years = getRecentYears();
  const [chartType, setChartType] = useState(0);
  const [selectedValue, setSelectedValue] = useState(-1);
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

  const revenueQueryByYear = useQuery({
    // Include selectedValue in queryKey for re-fetching based on selection
    queryKey: ["revenueByYear", selectedValue],
    queryFn: () => getRevByYear(selectedValue === -1 ? years[0] : years[selectedValue])
  });

  const handleSelectChange = (value) => {
    // queryClient.invalidateQueries("revenueByYear");
    setSelectedValue(value);
    if (value === -1) {
      setChartType(0);
    } else {
      setChartType(1);
    }
  };

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

      <Card elevation={3} sx={{ pt: "20px", mb: 3 }}>
        <CardHeader>
          <Title>Total revenue (VNĐ/month)</Title>
          <Select
            size="small"
            value={selectedValue}
            onChange={(event) => handleSelectChange(event.target.value)}
          >
            <MenuItem value={-1}>Last 6 months</MenuItem>
            {years.map((item, index) => (
              <MenuItem key={index} value={index}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </CardHeader>

        {revenueQuery.isSuccess && chartType === 0 && (
          <ComparisonChart
            height="350px"
            color={[theme.palette.primary.dark, theme.palette.primary.light]}
            data={revenueQuery.data?.data}
            chartType={chartType}
          />
        )}
        {revenueQueryByYear.isSuccess && chartType === 1 && (
          <ComparisonChart
            height="350px"
            color={[theme.palette.primary.dark, theme.palette.primary.light]}
            data={revenueQueryByYear.data?.data}
            chartType={chartType}
          />
        )}
      </Card>

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
