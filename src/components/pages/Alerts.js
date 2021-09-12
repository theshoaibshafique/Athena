import React from "react";
import { Typography, IconButton } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { db } from "../firebase/firebase";
const Alerts = ({ alerts }) => {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Alerts
      </Typography>
      {alerts.map((alert) => (
        <Alert
          action={
            <IconButton
              color="secondary"
              onClick={async (e) => {
                e.preventDefault();
                const user = await db
                  .collection("Alerts")
                  .doc(alert.id)
                  .delete();
              }}
            >
              <DeleteForeverIcon />
            </IconButton>
          }
          severity="error"
          style={{
            marginBottom: "10px",
          }}
        >
          <AlertTitle>
            <strong>{alert.member_username}</strong>
          </AlertTitle>
          <div>
            <strong>Location: </strong>
            {alert.member_location.latitude},{alert.member_location.longitude}
          </div>
          {alert.message}
        </Alert>
      ))}
    </>
  );
};

export default Alerts;
