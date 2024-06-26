import { useTheme } from "@mui/material/styles";
import ReactEcharts from "echarts-for-react";

export default function ComparisonChart({ height, color = [], data, chartType }) {
  const theme = useTheme();
  // console.log({ data, chartType });
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

  if (chartType === 0) {
    data.sort((a, b) => {
      if ((b.month % 12) + 1 === a.month) {
        return 1;
      } else {
        return -1;
      }
    });
  }
  let option = {
    grid: { top: "10%", bottom: "10%", right: "5%" },
    legend: { show: false },
    color: ["#223388", "rgba(34, 51, 136, 0.8)"],
    barGap: 0,
    barMaxWidth: "64px",
    dataset: {
      source: [
        ["Month", "Revenue"],
        ...data.map((item) => [getMonthName(item.month), item.revenue])
      ]
    },
    xAxis: {
      type: "category",
      axisLine: { show: false },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 13, fontFamily: "roboto", color: theme.palette.text.secondary }
    },
    yAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: theme.palette.text.secondary, opacity: 0.15 } },
      axisLabel: {
        fontSize: 13,
        fontFamily: "roboto",
        color: theme.palette.text.secondary
      },
      minInterval: 1000
    },

    series: [{ type: "bar" }]
  };

  return <ReactEcharts style={{ height: height }} option={{ ...option }} />;
}
