import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  MenuItem,
  Menu,
  IconButton,
  Grid2,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Back from "../Components/Back";
import axios from "../Api/axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "../Components/SnackbarContext";
import { useToken } from "../token/useToken";

function SinglePost() {
  const { token } = useToken();
  const [anchorEl, setAnchorEl] = useState("");
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode");
  const ignoreAuth = mode === "view";

  const handleIcon = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl("");
  };
  const handleEdit = () => {
    handleMenuClose();
    navigate(`/edit/${id}`);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/post/delete/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      showSnackbar("Successfully deleted a post");
      navigate("/homepage");
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const isLoggedIn = !!token && !ignoreAuth;
        const url = isLoggedIn ? `/user/post/${id}` : `/post/${id}`;
        if (!token) {
          navigate("/login", { replace: true });
        }
        const response = await axios.get(url, {
          headers: isLoggedIn ? { Authorization: `Bearer ${token}` } : {},
        });
        setPost(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading post:", error);
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, token, ignoreAuth, navigate]);

  if (loading) return <Typography> loading...</Typography>;
  if (!post) return <Typography> No Post Found</Typography>;
  const isAuthor = post.isAuthor;
  return (
    <>
      <Back />
      <Container
        maxwidth="xs"
        sx={{ backgroundColor: "#670D2F", padding: "5%" }}
      >
        <Paper
          sx={{
            textAlign: "center",
            padding: 4,
            borderRadius: 2,
            boxShadow: "4",
            maxwidth: "400",
            margin: "auto",
          }}
        >
          <Grid2
            container
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Grid2>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {post.title}
              </Typography>
            </Grid2>
            {token && isAuthor && (
              <Grid2 sx={{ display: "flex", justifyContent: "flex-end" }}>
                <IconButton onClick={handleIcon}>
                  <MoreVertIcon color="black" />
                </IconButton>
              </Grid2>
            )}
          </Grid2>
          <Grid2
            container
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Grid2>
              <Typography variant="subtitle1" color="black">
                {!token && !isAuthor ? `Author - ${post.username} ` : ""}
              </Typography>
            </Grid2>
            <Grid2 sx={{ marginBottom: "10px" }}>
              <Typography variant="subtitle1" color="black">
                Category - {post.category}
              </Typography>
            </Grid2>
            <Grid2 variant="h6">
              {post.content.split("\n").map((para, index) => (
                <Typography
                  key={index}
                  variant="body1"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "justify",
                    marginBottom: 2,
                  }}
                >
                  {para}
                </Typography>
              ))}
            </Grid2>
          </Grid2>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEdit}>Edit </MenuItem>
            <MenuItem onClick={handleClickOpen}>Delete </MenuItem>
          </Menu>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle> Confirm delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this post?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                onClick={() => {
                  handleDelete();
                  handleClose();
                }}
                color="error"
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
    </>
  );
}

export default SinglePost;
