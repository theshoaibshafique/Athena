import React, { useState } from "react";
import {
  Typography,
  Card,
  TextField,
  Grid,
  MenuItem,
  Button,
} from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { db } from "../firebase/firebase";
import firebase from "firebase";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const PushMessage = ({ users }) => {
  const classes = useStyles();
  const [teamMember, setteamMember] = useState();
  const [message, setMessage] = useState();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      e.target.reset();
      const res = await db.collection("PushMessage").add({
        created_on: firebase.firestore.FieldValue.serverTimestamp(),
        for_member: teamMember,
        message: message,
      });
      handleClick();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Push Message
      </Typography>
      <Card
        style={{
          padding: "20px",
        }}
      >
        <form className={classes.form} method="POST" onSubmit={sendMessage}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                select
                required
                fullWidth
                id="teammember"
                label="Team Member"
                name="teammember"
                onChange={(e) => setteamMember(e.target.value)}
              >
                {users.map((item) => {
                  if (item.is_approved) {
                    return (
                      <MenuItem key={item.id} value={item.id}>
                        {item.username}
                      </MenuItem>
                    );
                  }
                })}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="message"
                label="Message"
                fullWidth
                required
                multiline
                defaultValue=""
                rows={4}
                variant="outlined"
                onChange={(e) => setMessage(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Send Message
          </Button>
        </form>
      </Card>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Message Sent!
        </Alert>
      </Snackbar>
    </>
  );
};

export default PushMessage;
