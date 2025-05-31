import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Grid2,
  Button,
} from "@mui/material";
import post1 from "../assests/post1.jpg";
import post2 from "../assests/post2.jpg";
import post3 from "../assests/post3.jpg";
import { Link } from "react-router-dom";
import axios from "../Api/axios";
import { useToken } from "../token/useToken";

const fallbackImages = [post1, post2, post3];
function getRandomImage() {
  const index = Math.floor(Math.random() * fallbackImages.length);
  return fallbackImages[index];
}

function PostCard({
  username,
  title,
  content,
  category,
  image,
  id,
  isPublicview,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { token } = useToken();
  const handleToggle = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <Grid2 item xs={12} sm={6} md={4}>
      <Card
        sx={{
          maxWidth: 345,
          boxShadow: 3,
          width: "100%",
          height: "100%",
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          "&:hover": {
            boxShadow: 6,
            transform: "scale(1.05)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          },
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: 345, height: 240, objectFit: "cover", margin: "auto" }}
          image={image}
          alt="Post Image"
        />
        <CardContent sx={{ flexGrow: 1, minHeight: 50 }}>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "gray", mb: 1 }}>
            {username}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "gray", mb: 1 }}>
            {category}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isExpanded
              ? `${content.substring(0, 300)}...`
              : `${content.substring(0, 50)}...`}
            <Button
              size="small"
              onClick={handleToggle}
              sx={{ textTransform: "none", color: "red" }}
            >
              {isExpanded ? "Show Less" : "Show More"}
            </Button>
          </Typography>
        </CardContent>
        <Grid2 sx={{ padding: 2, display: "flex", justifyContent: "center" }}>
          <Button
            component={Link}
            to={
              isPublicview ? `/singlepost/${id}?mode=view` : `/singlepost/${id}`
            }
            size="small"
            sx={{
              marginLeft: "4px",
              color: "white",
              backgroundColor: "blue",
              padding: "2px 10px",
            }}
          >
            Read More
          </Button>
        </Grid2>
      </Card>
    </Grid2>
  );
}

function PostListings({ limit = 10, ignoreAuth }) {
  const [posts, setPosts] = useState([]);

  const { token } = useToken();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const isLoggedIn = !!token && !ignoreAuth;
        const url = isLoggedIn ? "/post/all" : `/posts?limit=${limit}`;

        const response = await axios.get(url, {
          headers: isLoggedIn ? { Authorization: `Bearer ${token}` } : {},
        });

        const postsArray = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setPosts(postsArray);
        if (!postsArray || postsArray.length === 0) {
          return <Typography>There is no posts.</Typography>;
        }
      } catch (error) {
        console.error("failed to load posts:", error);
      }
    };
    fetchPosts();
  }, [limit, ignoreAuth]);
  if (posts.length === 0) {
    return (
      <Grid2 container justifyContent="center" spacing={2}>
        <Typography variant="h5" sx={{ padding: "100px" }}>
          {" "}
          No posts.
        </Typography>
      </Grid2>
    );
  }
  return (
    <Box sx={{ padding: "50px" }}>
      <Grid2
        item
        xs={12}
        sm={6}
        md={4}
        container
        spacing={10}
        justifyContent="center"
      >
        {posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            image={getRandomImage()}
            title={post.title}
            username={post.username}
            category={post.category}
            content={post.content}
            isPublicview={ignoreAuth}
          />
        ))}
      </Grid2>
    </Box>
  );
}

export default PostListings;
