import { Edit } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  Chip,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  styled
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getProdBestSelling } from "api/dashboardApi";
import { Paragraph } from "app/components/Typography";

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

const ProductTable = styled(Table)(() => ({
  minWidth: 400,
  whiteSpace: "pre",
  "& small": {
    width: 50,
    height: 15,
    borderRadius: 500,
    boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"
  },
  "& td": { borderBottom: "none" },
  "& td:first-of-type": { paddingLeft: "16px !important" }
}));

export default function TopSellingTable() {
  const { data: prodBestSelling, isSuccess } = useQuery({
    queryKey: ["best-selling"],
    queryFn: getProdBestSelling
  });

  return (
    <Card elevation={3} sx={{ pt: "20px", mb: 3 }}>
      <CardHeader>
        <Title>top selling products</Title>
        {/* <Select size="small" defaultValue="this_month">
          <MenuItem value="this_month">This Month</MenuItem>
          <MenuItem value="last_month">Last Month</MenuItem>
        </Select> */}
      </CardHeader>

      <Box overflow="auto">
        {isSuccess && (
          <ProductTable>
            <TableHead>
              <TableRow>
                <TableCell colSpan={4} sx={{ px: 3 }}>
                  Name
                </TableCell>

                <TableCell colSpan={2} sx={{ px: 0 }}>
                  Revenue
                </TableCell>

                <TableCell colSpan={2} sx={{ px: 0 }}>
                  Total Sold
                </TableCell>

                {/* <TableCell colSpan={1} sx={{ px: 0 }}>
                  Action
                </TableCell> */}
              </TableRow>
            </TableHead>

            <TableBody>
              {prodBestSelling?.data?.map((product, index) => (
                <TableRow key={index} hover>
                  <TableCell
                    colSpan={4}
                    align="left"
                    sx={{
                      px: 0,
                      textTransform: "capitalize",
                      fontFamily: "Poppins",
                      fontWeight: 500
                    }}
                  >
                    <Box display="flex" marginRight={20} alignItems="center" gap={4}>
                      <Avatar src={product.defaultImage} />
                      <Paragraph style={{ flex: 2 }}>{product.productName}</Paragraph>
                      <Typography style={{ flex: 1 }}>Size: {product.size}</Typography>
                      <div
                        style={{
                          backgroundColor: product.color,
                          width: "30px",
                          height: "30px",
                          borderRadius: "50px"
                        }}
                      ></div>
                    </Box>
                  </TableCell>

                  <TableCell
                    align="left"
                    colSpan={2}
                    sx={{
                      px: 0,
                      textTransform: "capitalize",
                      fontFamily: "Poppins",
                      fontWeight: 500
                    }}
                  >
                    {product.revenue > 999
                      ? (product.revenue / 1000).toFixed(1) + "k"
                      : product.revenue}
                  </TableCell>

                  <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                    {product.totalSell ? (
                      product.totalSell > 10 ? (
                        <Chip label={product.totalSell} color="success" />
                      ) : (
                        <Chip label={product.totalSell} color="primary" />
                      )
                    ) : null}
                  </TableCell>

                  {/* <TableCell sx={{ px: 0 }} colSpan={1}>
                    <IconButton>
                      <Edit color="primary" />
                    </IconButton>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </ProductTable>
        )}
      </Box>
    </Card>
  );
}
