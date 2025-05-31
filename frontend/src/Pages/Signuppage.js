import { Link, useNavigate } from "react-router-dom";
import { Container, Button, TextField, Typography, Paper } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Back from "../Components/Back";
import axios from "../Api/axios";
import { useSnackbar } from "../Components/SnackbarContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  // Validation schema using Yup
  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    blogname: Yup.string().required("Blogname is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(values);
    try {
      const response = await axios.post("/signup", {
        username: values.username,
        password: values.password,
        blogname: values.blogname,
      });
      showSnackbar(response.data?.message || "SignUp successful!", "success");
      navigate("/login");
    } catch (error) {
      showSnackbar(error.response?.data?.message || "Signup failed", "error");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <Back />
      <Container maxWidth="xs" sx={{ padding: "3%" }}>
        <Paper
          sx={{
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
            maxWidth: 400,
            margin: "auto",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{ marginBottom: 2, color: "primary.main" }}
          >
            Sign Up
          </Typography>

          <Formik
            initialValues={{
              username: "",
              password: "",
              confirmPassword: "",
              blogname: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors, handleChange }) => (
              <Form>
                <Field
                  name="username"
                  as={TextField}
                  label="Username"
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  error={touched.username && Boolean(errors.username)}
                  helperText={
                    touched.username && errors.username ? errors.username : ""
                  }
                  onChange={handleChange}
                />

                <Field
                  name="password"
                  as={TextField}
                  label="Password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  error={touched.password && Boolean(errors.password)}
                  helperText={
                    touched.password && errors.password ? errors.password : ""
                  }
                  onChange={handleChange}
                />

                <Field
                  name="confirmPassword"
                  as={TextField}
                  label="Confirm Password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  error={
                    touched.confirmPassword && Boolean(errors.confirmPassword)
                  }
                  helperText={
                    touched.confirmPassword && errors.confirmPassword
                      ? errors.confirmPassword
                      : ""
                  }
                  onChange={handleChange}
                />

                <Field
                  name="blogname"
                  as={TextField}
                  label="Blogname"
                  variant="outlined"
                  type="text"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  error={touched.blogname && Boolean(errors.blogname)}
                  helperText={
                    touched.blogname && errors.blogname ? errors.blogname : ""
                  }
                  onChange={handleChange}
                />

                <Button
                  variant="contained"
                  sx={{
                    width: "100%",
                    marginTop: 2,
                  }}
                  type="submit"
                  disabled={isSubmitting}
                >
                  Sign Up
                </Button>
              </Form>
            )}
          </Formik>

          <Typography
            variant="body2"
            sx={{
              marginTop: 3,
              fontSize: "0.875rem",
              color: "text.secondary",
            }}
          >
            Already have an account?
            <Button
              component={Link}
              to="/login"
              sx={{ padding: 0, fontSize: "0.875rem" }}
            >
              Login
            </Button>
          </Typography>
        </Paper>
      </Container>
    </>
  );
};
export default SignUp;
