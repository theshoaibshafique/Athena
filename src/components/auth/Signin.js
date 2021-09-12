import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Alert from "@material-ui/lab/Alert";
import { useHistory } from "react-router-dom";
import { db } from "../firebase/firebase";
import { Card } from "@material-ui/core";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="">
        Athena
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow:
      "rgba(0,0,0,0.1) 0px 2px 4px 0px, rgba(0,0,0,0.1) 0px 8px 16px 0px",
    padding: "20px",
    marginTop: theme.spacing(8),
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Signin({ setcurrentUser }) {
  const classes = useStyles();
  const history = useHistory();

  const [userName, setuserName] = useState();
  const [password, setpassword] = useState();
  const [error, setError] = useState();

  const Login = async (e) => {
    e.preventDefault();
    let checkpassword = "";
    let checkType = "";
    try {
      const user = await db
        .collection("Admins")
        .where("username", "==", userName)
        .get();

      user.forEach((doc) => {
        checkpassword = doc.data().password;
        checkType = doc.data().type;
        setcurrentUser({ ...doc.data(), id: doc.id });
      });
      if (user.empty) {
        setError("No Such user Exists");
      } else {
        if (checkpassword === password) {
          if (checkType === "admin") {
            history.push("/admin/manageadmins");
          } else {
            history.push("/users");
          }
        } else {
          setError("Invalid Password");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Card className={classes.root}>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={Login}>
            {error && (
              <Alert
                severity="error"
                onClose={() => {
                  setError(undefined);
                }}
                style={{
                  marginBottom: "20px",
                }}
              >
                {error}
              </Alert>
            )}
            <TextField
              autoComplete="uname"
              name="userName"
              variant="outlined"
              required
              fullWidth
              id="userName"
              label="User Name"
              autoFocus
              onChange={(e) => setuserName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setpassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Card>
    </Container>
  );
}
