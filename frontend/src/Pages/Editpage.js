import { useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "../Components/SnackbarContext";
import { useToken } from "../token/useToken";

const Editpage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useToken();
  const [initialValues, setInitialValues] = useState(null);
  const { showSnackbar } = useSnackbar();

  // Validation schema using Yup
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    content: Yup.string().required("Content is required"),
    category: Yup.string().required("Category is required"),
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/post/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = response.data.data;
        setInitialValues({
          title: data.title || "",
          content: data.content || "",
          category: data.category || "",
        });
      } catch (error) {
        console.error("Failed to fetch post: ", error);
      }
    };
    fetchPost();
  }, [id, token]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.put(`/post/edit/${id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showSnackbar("Post edited successfully!");
      resetForm();
      navigate(`/singlepost/${id}`, { replace: true });
    } catch (error) {
      showSnackbar("Failed to edit a blog. Please try again.");
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
            Edit Post
          </Typography>
          {initialValues ? (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {({ isSubmitting, touched, errors, handleChange, values }) => (
                <Form>
                  <Field
                    label="Write your Title"
                    variant="outlined"
                    value={values.title}
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
                    <InputLabel id="category-label">
                      Category of Post
                    </InputLabel>
                    <Select
                      label="Category of Post"
                      labelId="category-label"
                      name="category"
                      fullWidth
                      value={values.category}
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
                    sx={{
                      marginTop: 2,
                      color: "white",
                      backgroundColor: "blue",
                    }}
                    disabled={isSubmitting}
                  >
                    Save
                  </Button>
                </Form>
              )}
            </Formik>
          ) : (
            <Typography>loading...</Typography>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default Editpage;
