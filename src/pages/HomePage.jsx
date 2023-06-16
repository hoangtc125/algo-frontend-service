import { Box } from "@mui/material";

import User from "../components/club/User";
import Clubs from "../components/club/Clubs";

export default function HomePage() {

  return (
    <Box className="flex flex-col items-center justify-center space-y-8 bg-white p-8">
      <User />
      <Clubs />
    </Box>
  );
}
