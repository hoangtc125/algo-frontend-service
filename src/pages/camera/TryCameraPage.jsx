import { Box } from "@mui/material";
import Camera from "../../components/camera";
import ImagesReview from "../../components/camera/imagesReview";

export default function TryCameraPage() {

  return (
    <Box className="m-4 bg-white rounded-md shadow-md">
        <Box className="m-4">
        <Camera />
        <ImagesReview />
        </Box>
    </Box>
  );
}
