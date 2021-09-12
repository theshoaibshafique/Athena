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
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import $ from "jquery";
import { db } from "../firebase/firebase";

import AddTask from "../Modals/Tasks/AddTask";
import EditTask from "../Modals/Tasks/EditTask";

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

function Tasks({ tasks, users, locations }) {
  const classes = useStyles();

  const [currentTitle, setcurrentTitle] = useState();
  const [currentID, setcurrentID] = useState();

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
            x.title.toLowerCase().includes(target.value)
          );
      },
    });
  };
  const recordsAfterpaging = () => {
    return filterFn
      .fn(tasks)
      .slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  };
  return (
    <>
      <AddTask
        open={open}
        handleClose={handleClose}
        users={users}
        locations={locations}
      />

      <Typography variant="h4">Tasks</Typography>

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
            label="Search Tasks"
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
          startIcon={<PlaylistAddIcon />}
          color="primary"
          onClick={handleClickOpen}
        >
          Add Task
        </Button>
      </Toolbar>
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Risk Level</TableCell>
              <TableCell>Status</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recordsAfterpaging().map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>{item.risk_level}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setcurrentTitle(item.title);
                      setcurrentID(item.id);
                      handleClickOpen2();
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  {item.status === "Completed" ? (
                    <IconButton
                      style={{
                        color: "#00796b",
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  ) : (
                    ""
                  )}

                  <IconButton
                    color="secondary"
                    onClick={async (e) => {
                      e.preventDefault();
                      const user = await db
                        .collection("Tasks")
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
        count={tasks.length}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />

      {open2 ? (
        <EditTask
          open={open2}
          users={users}
          locations={locations}
          currentID={currentID}
          currentTitle={currentTitle}
          handleClose={handleClose2}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default Tasks;
