import { Link } from "react-router-dom";
import background from "../assests/background.jpg";
import { Box, Typography, Button } from "@mui/material";

function Hero() {
  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100vh",
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: "black",
            fontWeight: "bold",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "2rem",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {" "}
          Unlock new opportunities and insights through our connection.
        </Typography>
        <Typography
          variant="h3"
          sx={{
            color: "black",
            position: "absolute",
            top: "60%",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "1.2rem",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          Your journey to new discoveries begins here—connect with us.
        </Typography>
        <Link
          to="/signup"
          style={{ textDecoration: "none", paddingRight: "5px" }}
        >
          <Button
            variant="contained"
            sx={{
              position: "absolute",
              top: "70%",
              left: "50%",
              background: "transparent",
              transform: "translateX(-50%)",
              color: "black",
              border: "2px solid black",
              "&:hover": { backgroundColor: "black", color: "white" },
            }}
          >
            Get Started
          </Button>
        </Link>
      </Box>
    </>
  );
}

export default Hero;
