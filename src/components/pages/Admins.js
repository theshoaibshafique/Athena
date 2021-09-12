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
  Card,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import TableBody from "@material-ui/core/TableBody";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import $ from "jquery";
import { db } from "../firebase/firebase";

import AdminModal from "../Modals/Admin/AdminModal";
import EditAdmin from "../Modals/Admin/EditAdmin";

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

function Admins() {
  const classes = useStyles();

  const [currentUsername, setcurrentUsername] = useState();
  const [currentemail, setcurrentemail] = useState();
  const [currentpassword, setcurrentpassword] = useState();
  const [currentID, setcurrentID] = useState();

  const pages = [5, 10, 25];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  //const [opensnack, setOpensnack] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpen2 = () => {
    setOpen2(true);
  };
  //   const handleSnackbar = () => {
  //     setOpensnack(true);
  //   };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };

  useEffect(() => {
    async function fetchData() {
      db.collection("Admins")
        .orderBy("created_on", "desc")
        .onSnapshot((snapshot) => {
          setUsers(
            snapshot.docs.map((doc) => {
              return { ...doc.data(), id: doc.id };
            })
          );
        });
    }

    fetchData();
  }, []);
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
            x.username.toLowerCase().includes(target.value)
          );
      },
    });
  };
  const recordsAfterpaging = () => {
    //users.shift();
    return filterFn
      .fn(users)
      .slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  };
  return (
    <>
      <AdminModal open={open} handleClose={handleClose} />

      <Typography variant="h4">Admins</Typography>

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
            label="Search Users"
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
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          color="primary"
          onClick={handleClickOpen}
        >
          Add Admin
        </Button>
      </Toolbar>
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>Email Address</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Password</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recordsAfterpaging().map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.username}</TableCell>
                <TableCell>{item.email_address}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.password}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setcurrentUsername(item.username);
                      setcurrentemail(item.email_address);
                      setcurrentpassword(item.password);
                      setcurrentID(item.id);
                      handleClickOpen2();
                    }}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="secondary"
                    onClick={async (e) => {
                      e.preventDefault();
                      const user = await db
                        .collection("Admins")
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
        count={users.length}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />

      {open2 ? (
        <EditAdmin
          open={open2}
          currentUsername={currentUsername}
          currentemail={currentemail}
          currentpassword={currentpassword}
          currentID={currentID}
          handleClose={handleClose2}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default Admins;
