import {
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  Typography,
  ListSubheader,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Mes from "./Components/Mes";
import { useLocation } from "react-router-dom";

function Message({ socket }) {
  const [mopen, setMopen] = useState(true);
  const [sendList, setSendList] = useState([]);
  const [recList, setRecList] = useState([]);
  const location = useLocation();
  const privatekey = {
    e: 0,
    d: 0,
  };
  const publickey = {
    e: 0,
    n: 0,
  };
  useEffect(() => {
    return () => {
      socket.emit("endSession", location.state.tuser.socketId);
    };
  }, []);

  socket.on("end", () => {
    socket.disconnect();
    window.location.reload(false);
  });

  socket.on("res", (data) => {
    switch (data.type) {
      //gen keys
      case 1:
        privatekey.e = data.mes.e;
        privatekey.d = data.mes.d;
        publickey.e = data.mes.e;
        publickey.n = data.mes.n;
        setSendList([
          ...sendList,
          {
            head: "Keys",
            message: `generate privatekey=(${privatekey.e}, ${privatekey.d}) publickey=(${publickey.e}, ${publickey.n})`,
          },
        ]);
        break;
      //encrypt
      case 2:
        if (data.mes.logs === "send") {
          setSendList([
            ...sendList,
            {
              head: "Encrypted message",
              message: `${data.mes.encmessage}`,
            },
          ]);
        } else {
          setRecList((arr) => [
            ...arr,
            {
              head: "Encrypted message",
              message: `${data.mes.encmessage}`,
            },
          ]);
          let tmp = data.mes.encmessage;
          data.type = 3;
          data.mes.d = privatekey.d;
          data.mes.n = publickey.n;
          data.mes.arr = tmp;
          socket.emit("req", data);
        }
        break;
      //decrypt
      case 3:
        let str = "";
        function Decode(item, index) {
          str = str + String.fromCharCode(item);
        }
        console.log(str);
        data.mes.message.forEach(Decode);
        setRecList([
          ...recList,
          {
            head: "Decrypted message",
            message: `${str}`,
          },
        ]);
        break;
      //utility
      case 10:
        if (data.mes.open === true) {
          setMopen(false);
          setRecList([
            ...recList,
            {
              head: "Keys",
              message: `Target made a publickey=(${data.mes.publickey.e}, ${data.mes.publickey.n}). Now you can send a message to him`,
            },
          ]);
        } else {
          setMopen(true);
        }
        break;
      default:
        break;
    }
  });
  const sl = sendList.map((ld) => (
    <ListItem disablePadding>
      <Accordion
        sx={{ overflow: "hidden", width: 400 }}
        pt={0}
        pb={0}
        square={true}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          {ld.head}
        </AccordionSummary>
        <AccordionDetails
          sx={{ width: 368, maxWidth: 368, overflow: "hidden" }}
        >
          <Typography sx={{ wordWrap: "break-word" }}>{ld.message}</Typography>
        </AccordionDetails>
      </Accordion>
    </ListItem>
  ));

  const rl = recList.map((ld) => (
    <ListItem disablePadding>
      <Accordion pt={0} pb={0} square={true} sx={{ overflow: "hidden" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          {ld.head}
        </AccordionSummary>
        <AccordionDetails
          sx={{ width: 368, maxWidth: 368, overflow: "hidden" }}
        >
          <Typography sx={{ wordWrap: "break-word" }}>{ld.message}</Typography>
        </AccordionDetails>
      </Accordion>
    </ListItem>
  ));

  return (
    <Box sx={{ display: "flex" }} mt={3} flexDirection="row">
      <Box>
        <div>{location.state.tuser.username}</div>
        <Box mt={3} mb={12}>
          <Mes
            socket={socket}
            target={location.state.tuser}
            sendList={sendList}
            setSendList={setSendList}
            recList={recList}
            setRecList={setRecList}
            mopen={mopen}
            setMopen={setMopen}
          />
        </Box>
        <Button
          variant="contained"
          onClick={() => {
            socket.emit("endSession", location.state.tuser.socketId);
          }}
        >
          End Session
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1, display: "flex" }} justifyContent="space-evenly">
        <List
          sx={{ maxHeight: 600, width: 400, overflow: "auto" }}
          subheader={
            <ListSubheader component="div" id="users-list" sx={{ border: 1 }}>
              Send logs
            </ListSubheader>
          }
        >
          {sl}
        </List>

        <List
          sx={{ maxHeight: 600, width: 400, overflow: "auto" }}
          subheader={
            <ListSubheader component="div" id="users-list" sx={{ border: 1 }}>
              Recive logs
            </ListSubheader>
          }
        >
          {rl}
        </List>
      </Box>
    </Box>
  );
}

export default Message;
