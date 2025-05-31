import { AppBar, Toolbar, Box, Typography, Button } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../Api/axios";
import { useToken } from "../token/useToken";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, removeToken, getUsername } = useToken();
  const [navItems, setNavItems] = useState([]);
  const location = useLocation();
  const [blogname, setBlogname] = useState([]);

  const publicroute = ["/", "/posts", "/login", "/signup"];
  const isPublic = publicroute.includes(location.pathname);
  const queryParams = new URLSearchParams(location.search);
  const isViewMode = queryParams.get("mode") === "view";
  const isLogged = !!token && !isPublic && !isViewMode;

  const handleLogout = async () => {
    try {
      if (token) {
        await axios.post(
          "/user/signout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      removeToken();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const items = isLogged
      ? []
      : [
          { label: "Home", href: "/" },
          { label: "Posts", href: "/posts" },
        ];
    setNavItems(items);
  }, [isLogged]);
  useEffect(() => {
    if (token) {
      axios
        .get("/userDetails", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setBlogname(response.data.data.blogname);
        })
        .catch((error) => {
          console.log("Error fetching the blogname", error);
        });
    }
  });

  return (
    <>
      <AppBar
        sx={{
          backgroundColor: "white",
          top: 0,
          left: 0,
          zIndex: "100",
          width: "100%",
          position: "sticky",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ flex: "1", display: "flex" }}>
            <Typography
              variant="h6"
              sx={{
                textDecoration: "none",
                padding: "10px",
                color: "black",
                fontWeight: "bold",
                alignContent: "center",
              }}
            >
              {isLogged ? (
                <>
                  {blogname} {" - "}
                  <Box
                    component="span"
                    sx={{ color: "black", fontWeight: "100" }}
                  >
                    {getUsername()}
                  </Box>
                </>
              ) : (
                "Bloggers"
              )}
            </Typography>
          </Box>

          {navItems.map((items) => (
            <Link
              to={items.href}
              key={items.label}
              style={{ textDecoration: "none", paddingRight: "5px" }}
            >
              <Button
                sx={{
                  color: "black",
                  "&:hover": { backgroundColor: "blue", color: "white" },
                }}
              >
                {items.label}
              </Button>
            </Link>
          ))}
          <Box
            sx={{
              paddingLeft: "10px",
              paddingRight: "10px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {isLogged ? (
              <Button
                sx={{
                  color: "white",
                  backgroundColor: "blue",
                  textDecoration: "none",
                  paddingRight: "5px",
                  "&:hover": {
                    border: "2px solid",
                    backgroundColor: "white",
                    color: "black",
                  },
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button
                  sx={{
                    color: "white",
                    backgroundColor: "blue",
                    textDecoration: "none",
                    paddingRight: "5px",
                    "&:hover": {
                      border: "2px solid",
                      backgroundColor: "white",
                      color: "black",
                    },
                  }}
                >
                  Login
                </Button>
              </Link>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};
export default Navbar;
