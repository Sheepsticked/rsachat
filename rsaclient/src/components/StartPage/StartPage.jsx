import {
  TextField,
  Button,
  List,
  ListItem,
  ListSubheader,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StartPage({ usern, setUser, socket }) {
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("hidden");
  const [online, setOnline] = useState();
  const [request, setRequest] = useState(false);
  const [tarUser, setTarUser] = useState("NoName");
  const [errorName, setErrorName] = useState("Name can't be null!");
  const navigate = useNavigate();
  const handleDialogClose = () => {
    socket.emit("requestAccepted", false, tarUser.socketId);
    setRequest(false);
  };
  const handleDialogAgree = () => {
    socket.emit("requestAccepted", true, tarUser.socketId);
    navigate("../app", { state: { tuser: tarUser } });
  };
  const startSession = (tsocket) => {
    socket.emit("startSession", tsocket);
  };
  socket.on("request", (user) => {
    setTarUser(user);
    navigate("../app", { state: { tuser: user } });
  });
  socket.on("requestDeclined", (username) => {
    setErrorName(`${username} declined your request`);
    setError("visible");
  });
  socket.on("receiveRequest", (tUser) => {
    setError("hidden");
    setTarUser(tUser);
    setRequest(true);
  });
  socket.on("online", (data) => {
    if (usern === null) {
      setOnline("Enter name first)");
    } else {
      setOnline(
        data.map((user) => {
          if (user.username === usern) {
          } else {
            if (user.username === null || user.username === "Bad hacker") {
              return (
                <ListItem divider={true}>
                  <div>Unknown</div>
                </ListItem>
              );
            } else {
              let toggle = false;
              if (user.connected === true) {
                toggle = !toggle;
              }
              return (
                <ListItem
                  divider={true}
                  disabled={toggle}
                  onClick={() => {
                    if (toggle !== true) {
                      startSession(user.socketId);
                    }
                  }}
                  sx={{ cursor: "pointer", userSelect: "none" }}
                >
                  <div>{user.username}</div>
                </ListItem>
              );
            }
          }
        })
      );
    }
  });
  const handleClickSave = () => {
    socket.disconnect();
    if (name === "") {
      setErrorName("Name can't be null!");
      setError("visible");
    } else {
      if (name === "Login" || name === "Bot") {
        localStorage.setItem("Username", "Bad hacker");
        setUser("Bad hacker");
        return;
      }
      localStorage.setItem("Username", name);
      setUser(name);
      localStorage.setItem("open", true);
      setOpen(true);
      setError("hidden");
    }
  };

  const handleDisable = () => {
    setOpen(false);
  };
  useEffect(() => {
    if (localStorage.getItem("open") === "true") {
      setOpen(true);
    }
  }, [usern]);

  return (
    <Box sx={{ display: "flex" }} mt={3}>
      <Box>
        <TextField
          id="outlined-basic"
          label="Name"
          variant="outlined"
          name="name"
          type="text"
          value={name}
          disabled={open}
          inputProps={{ maxLength: 200 }}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <Box mt={3} mb={2} sx={{ display: "flex" }} flexDirection="row">
          <Box mr={1}>
            <Button
              variant="contained"
              disabled={open}
              onClick={handleClickSave}
            >
              Save
            </Button>
          </Box>
          <Box>
            <Button variant="contained" onClick={handleDisable}>
              Edit
            </Button>
          </Box>
        </Box>
        <Alert sx={{ visibility: error }} severity="error">
          {errorName}
        </Alert>
      </Box>
      <Box sx={{ flexGrow: 1, display: "flex" }} justifyContent="center">
        <List
          aria-labelledby="users-list"
          component="nav"
          subheader={
            <ListSubheader component="div" id="users-list">
              Users online
            </ListSubheader>
          }
          sx={{
            border: 1,
            textAlign: "center",
          }}
        >
          {online}
        </List>
      </Box>
      <Dialog open={request}>
        <DialogTitle>{"New session"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <b>{tarUser.username}</b> wants to start communication with you
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Disagree</Button>
          <Button onClick={handleDialogAgree}>Agree</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default StartPage;
