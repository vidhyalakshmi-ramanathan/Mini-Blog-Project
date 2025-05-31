import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Paper,
} from "@mui/material";
import Back from "../Components/Back";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "../Api/axios";
import { useSnackbar } from "../Components/SnackbarContext";
import { useToken } from "../token/useToken";

const Login = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { setToken } = useToken();

  // Validation schema using Yup
  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters"),
    password: Yup.string().required("Password is required"),
  });

  const handleCheckboxChange = (e) => setRememberMe(e.target.checked);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post("/login", {
        username: values.username,
        password: values.password,
      });
      if (response.data.token) {
        setToken(response.data.token, response.data.data.username);
      }
      showSnackbar("Login successful!", "success");
      navigate("/homepage");
    } catch (error) {
      showSnackbar(error.response?.message || "Login failed", "error");
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
            Login
          </Typography>

          <Formik
            initialValues={{
              username: "",
              password: "",
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
                  helperText={touched.username && errors.username}
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
                  helperText={touched.password && errors.password}
                  onChange={handleChange}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={handleCheckboxChange}
                      color="primary"
                    />
                  }
                  label="Remember Me"
                  sx={{ fontSize: "0.875rem" }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    width: "100%",
                    marginTop: 2,
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  }}
                >
                  Login
                </Button>
              </Form>
            )}
          </Formik>

          <Typography
            variant="body2"
            sx={{ marginTop: 3, fontSize: "0.875rem", color: "text.secondary" }}
          >
            Don't have an account?{" "}
            <Button
              component={Link}
              to="/signup"
              sx={{ padding: 0, fontSize: "0.875rem" }}
            >
              Sign Up
            </Button>
          </Typography>
        </Paper>
      </Container>
    </>
  );
};

export default Login;
