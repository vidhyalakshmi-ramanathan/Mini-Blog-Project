import {
  Container,
  Button,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  TextField,
} from "@mui/material";
import * as Yup from "yup";
import Back from "../Components/Back";
import axios from "../Api/axios";
import { Formik, Form, Field } from "formik";
import { useSnackbar } from "../Components/SnackbarContext";
import { useNavigate } from "react-router-dom";
import { useToken } from "../token/useToken";

const Createpage = () => {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { token } = useToken();
  // Validation schema using Yup
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    content: Yup.string().required("Content is required"),
    category: Yup.string().required("Category is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post("/post/create", values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showSnackbar("Post created successfully!");
      resetForm();
      navigate("/homepage");
    } catch (error) {
      showSnackbar("Failed to create a blog. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <Back />
      <Container sx={{ padding: "50px" }}>
        <Paper
          sx={{
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
            maxWidth: 1000,
            margin: "auto",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" sx={{ marginBottom: "20px" }}>
            Create a New Post
          </Typography>
          <Formik
            initialValues={{
              title: "",
              content: "",
              category: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, values, errors, handleChange }) => (
              <Form>
                <Field
                  label="Write your Title"
                  variant="outlined"
                  fullWidth
                  as={TextField}
                  sx={{ marginBottom: 2 }}
                  name="title"
                  error={touched.title && Boolean(errors.title)}
                  helperText={touched.title && errors.title}
                  onChange={handleChange}
                />

                <Field
                  label="Write Your Post Content"
                  variant="outlined"
                  multiline
                  rows={14}
                  fullWidth
                  as={TextField}
                  sx={{ marginBottom: 2 }}
                  name="content"
                  error={touched.content && Boolean(errors.content)}
                  helperText={touched.content && errors.content}
                  onChange={handleChange}
                />
                <FormControl
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  error={touched.category && Boolean(errors.category)}
                >
                  <InputLabel id="category-label">Category of Post</InputLabel>
                  <Select
                    label="Category of Post"
                    labelId="category-label"
                    name="category"
                    value={values.category}
                    fullWidth
                    onChange={handleChange}
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 200, overflow: "auto" },
                      },
                    }}
                    sx={{ textAlign: "left" }}
                  >
                    <MenuItem value="Personal"> Personal </MenuItem>
                    <MenuItem value="Education"> Education </MenuItem>
                    <MenuItem value="Fashion"> Fashion </MenuItem>
                    <MenuItem value="Travel"> Travel </MenuItem>
                    <MenuItem value="Lifestyle"> Lifestyle </MenuItem>
                    <MenuItem value="Fashion"> Fashion </MenuItem>
                    <MenuItem value="Food"> Food </MenuItem>
                    <MenuItem value="Art"> Art </MenuItem>
                    <MenuItem value="others"> others </MenuItem>
                  </Select>
                  <FormHelperText sx={{ color: "#B82132" }}>
                    {touched.category && errors.category}
                  </FormHelperText>
                </FormControl>

                <Button
                  type="submit"
                  variant="outlined"
                  fullWidth
                  sx={{ marginTop: 2, color: "white", backgroundColor: "blue" }}
                  disabled={isSubmitting}
                >
                  Save
                </Button>
              </Form>
            )}
          </Formik>
        </Paper>
      </Container>
    </>
  );
};

export default Createpage;
