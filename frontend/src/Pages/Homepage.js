import { useEffect, useState } from "react";
import { Box, Grid2, Typography, Button } from "@mui/material";
import Postlistings from "../Components/Postlistings";
import { Link } from "react-router-dom";
import axios from "../Api/axios";
import { useToken } from "../token/useToken";

const Homepage = () => {
  const { token } = useToken();
  const [userData, setUserData] = useState({
    username: "",
    postsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios
        .get("/userDetails", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUserData(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
    }
  }, []);
  if (loading) {
    return <div> loading...</div>;
  }

  return (
    <>
      <Grid2
        container
        spacing={3}
        maxwidth="345"
        sx={{ padding: "40px", justifyContent: "space-between" }}
      >
        <Grid2 item xs={12} md={9} sx={{ padding: "30px" }}>
          <Box
            sx={{
              color: "black",
              borderRadius: "5px",
              backgroundColor: "#F7F7F7",
              padding: "20px",
            }}
          >
            <Typography
              variant="h5"
              sx={{ paddingRight: "94px", paddingBottom: "15px" }}
            >
              Username : {userData.username}
            </Typography>
            <Typography variant="body1" sx={{ color: "gray" }}>
              Number of Posts: {userData.postsCount}
            </Typography>
          </Box>
        </Grid2>
        <Grid2
          item
          xs={12}
          md={4}
          sx={{ padding: "30px", justifyContent: "center" }}
        >
          <Button
            component={Link}
            to="/createpage"
            sx={{
              fontSize: "15px",
              margin: "30px",
              backgroundColor: "blue",
              color: "white",
              "&:hover": { fontSize: "16px" },
            }}
          >
            Create New Post
          </Button>
        </Grid2>
      </Grid2>

      <Box sx={{ padding: 1, backgroundColor: "#854836" }}>
        <Grid2 container justifyContent="center" spacing={2}>
          <Grid2 item>
            <Typography variant="h6" sx={{ color: "white" }}>
              Your Posts
            </Typography>
          </Grid2>
        </Grid2>
      </Box>

      <Grid2>
        <Postlistings ignoreAuth={false} />
      </Grid2>
    </>
  );
};

export default Homepage;
