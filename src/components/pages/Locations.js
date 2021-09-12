import {
  Paper,
  TableCell,
  TableRow,
  Typography,
  TableHead,
  Table,
  makeStyles,
  TableContainer,
  TablePagination,
  Toolbar,
  TextField,
  InputAdornment,
  Button,
  IconButton,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import TableBody from "@material-ui/core/TableBody";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import AddLocationIcon from "@material-ui/icons/AddLocation";
import EditLocationIcon from "@material-ui/icons/EditLocation";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import CheckIcon from "@material-ui/icons/Check";
import $ from "jquery";
import { db } from "../firebase/firebase";

import AddLocation from "../Modals/Location/AddLocation";
import EditUser from "../Modals/Users/EditUser";
import ViewUser from "../Modals/Users/ViewUser";

const Width = $(window).width() - 300;

const useStyles = makeStyles((theme) => ({
  table: {
    marginTop: theme.spacing(3),
    "& thead th": {
      fontWeight: "600",
      color: theme.palette.primary.main,
      backgroundColor: "#3c44b126",
    },
    "& tbody td": {
      fontWeight: "300",
    },
    "& tbody tr:hover": {
      backgroundColor: "#fffbf2",
      cursor: "pointer",
    },
  },
  searchInput: {
    width: "75%",
  },
  actionbtn: {
    minWidth: 0,
    margin: theme.spacing(0.5),
    backgroundColor: "#f8324526",
    "& .MuiButton-label": {
      color: "#f83245",
    },
  },
}));

function Locations({ locations, apiKey }) {
  const classes = useStyles();

  const [currentUsername, setcurrentUsername] = useState();
  const [currentemail, setcurrentemail] = useState();
  const [currentpassword, setcurrentpassword] = useState();
  const [currentID, setcurrentID] = useState();
  const [currentphone, setcurrentphone] = useState();
  const [currentImage, setcurrentImage] = useState();
  const [error, setError] = useState();

  const pages = [5, 10, 25];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  //const [opensnack, setOpensnack] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpen2 = () => {
    setOpen2(true);
  };
  const handleClickOpen3 = () => {
    setOpen3(true);
  };
  //   const handleSnackbar = () => {
  //     setOpensnack(true);
  //   };
  const handleClose = () => {
    setOpen(false);
    setError(undefined);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };
  const handleClose3 = () => {
    setOpen3(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleSearch = (e) => {
    let target = e.target;

    setFilterFn({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((x) =>
            x.address.toLowerCase().includes(target.value)
          );
      },
    });
  };
  const recordsAfterpaging = () => {
    return filterFn
      .fn(locations)
      .slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  };
  return (
    <>
      <Typography variant="h4">Locations</Typography>

      <Toolbar
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            marginTop: 10,
          }}
        >
          <TextField
            variant="outlined"
            label="Search Locations"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={handleSearch}
          />
        </div>
        {/* <Button
            variant="outlined"
            startIcon={<AddLocationIcon />}
            color="primary"
            onClick={handleClickOpen}
          >
            Add Location
          </Button> */}
      </Toolbar>
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell>Story Building</TableCell>
              <TableCell>Latitude</TableCell>
              <TableCell>Longitude</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recordsAfterpaging().map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.address}</TableCell>
                <TableCell>{item.is_story_building}</TableCell>
                <TableCell>{item.latitude}</TableCell>
                <TableCell>{item.longitude}</TableCell>
                <TableCell>
                  {/* <IconButton
                      color="primary"
                      onClick={() => {
                        setcurrentUsername(item.username);
                        setcurrentemail(item.email_address);
                        setcurrentpassword(item.password);
                        setcurrentID(item.id);
                        setcurrentphone(item.phone_number);
                        handleClickOpen2();
                      }}
                    >
                      <EditLocationIcon />
                    </IconButton> */}

                  <IconButton
                    color="secondary"
                    onClick={async (e) => {
                      e.preventDefault();
                      const user = await db
                        .collection("Location")
                        .doc(item.id)
                        .delete();
                    }}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        page={page}
        rowsPerPageOptions={pages}
        rowsPerPage={rowsPerPage}
        count={locations.length}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />

      <Typography variant="h4" style={{ marginTop: "20px" }}>
        Add Location
      </Typography>
      <AddLocation open={open} handleClose={handleClose} apiKey={apiKey} />
    </>
  );
}

export default Locations;
