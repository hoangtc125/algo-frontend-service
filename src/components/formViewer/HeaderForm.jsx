import { Box, Divider, Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";

import { descriptionSectionSelector, titleSectionSelector } from "../../redux/selectors";
import { Link } from "react-router-dom";

const HeaderForm = ({ sectionId }) => {
  const title = useSelector(titleSectionSelector(sectionId))
  const description = useSelector(descriptionSectionSelector(sectionId))
  const account = JSON.parse(localStorage.getItem("account"))?.account
  console.log("re-render");

  return (
    <Box sx={{ mb: 3 }}>
      <Paper elevation={2} sx={{ p: 3, borderTop: "8px solid #272bb0" }} className="space-y-4">
        <Typography variant="h2" gutterBottom className="w-full">
          {title}
        </Typography>
        <Typography variant="h5" gutterBottom className="w-full">
          {description}
        </Typography>
        <Divider />
        <Box className="w-full flex items-center justify-between">
          <Box className="flex items-center justify-start">
            {account
              ?
              <Typography variant="body1">
                {account?.email} ({account?.name}) <Link to="/algo-frontend-service/login" className="text-base text-blue-500">Chuyển đổi tài khoản</Link>
              </Typography>
              :
              <Typography variant="body1">
                <Link to="/algo-frontend-service/login" className="text-base text-blue-500">Đăng nhập</Link>
              </Typography>
            }
          </Box>
          <Typography>Bản nháp được lưu 3 giây / lần</Typography>
        </Box>
        <Divider />
        <Typography variant="body1" gutterBottom className="w-full text-red-500">
          * Biểu thị câu hỏi bắt buộc
        </Typography>
      </Paper>
    </Box>
  );
};

export default HeaderForm;
