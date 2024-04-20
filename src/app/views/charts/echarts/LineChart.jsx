import { useTheme } from "@mui/material/styles";
import ReactEcharts from "echarts-for-react";

export default function LineChart({ height, color = [], currMonth, prevMonth, type }) {
  const theme = useTheme();
  console.log({ currMonth, prevMonth });
  let option = {
    grid: { top: "10%", bottom: "10%", left: "5%", right: "5%" },
    legend: {
      itemGap: 20,
      icon: "circle",
      textStyle: {
        fontSize: 13,
        color: theme.palette.text.secondary,
        fontFamily: theme.typography.fontFamily
      }
    },
    label: {
      fontSize: 13,
      color: theme.palette.text.secondary,
      fontFamily: theme.typography.fontFamily
    },
    xAxis: {
      type: "category",
      data: [],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontSize: 14,
        fontFamily: "roboto",
        color: theme.palette.text.secondary
      }
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: { color: theme.palette.text.secondary, opacity: 0.15 }
      },
      axisLabel: { color: theme.palette.text.secondary, fontSize: 13, fontFamily: "roboto" }
    },
    series: []
  };
  if (type === "trend") {
    option.xAxis.data = currMonth.map((item) => item.date);
    option.yAxis = {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: { color: theme.palette.text.secondary, opacity: 0.15 }
      },
      axisLabel: { color: theme.palette.text.secondary, fontSize: 13, fontFamily: "roboto" },
      minInterval: 1
    };
    option.series = [
      ...option.series,
      {
        data: currMonth.map((item) => item.totalOrder),
        type: "line",
        stack: "This month",
        name: "This month",
        smooth: true,
        symbolSize: 4,
        lineStyle: { width: 4 }
      },
      {
        data: prevMonth.map((item) => item.totalRevenue),
        type: "line",
        stack: "Last month",
        name: "Last month",
        smooth: true,
        symbolSize: 4,
        lineStyle: { width: 4 }
      }
    ];
  }
  function getMonthName(monthNumber) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    return monthNames[monthNumber - 1]; // subtract 1 because array indices start at 0
  }
  if (type === "user") {
    currMonth.sort((a, b) => {
      if ((b.month % 12) + 1 === a.month) {
        return 1;
      } else {
        return -1;
      }
    });
    option.xAxis.data = currMonth.map((item) => getMonthName(item.month));
    option.series = [
      ...option.series,
      {
        data: currMonth.map((item) => item.totalNewUser),
        type: "line",
        stack: "This month",
        name: "This month",
        smooth: true,
        symbolSize: 4,
        lineStyle: { width: 4 }
      }
    ];
  }
  return <ReactEcharts style={{ height: height }} option={{ ...option, color: [...color] }} />;
}
