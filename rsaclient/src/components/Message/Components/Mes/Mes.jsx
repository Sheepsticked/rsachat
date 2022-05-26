import { TextField, Button } from "@mui/material";
import { useState } from "react";
import { Box } from "@mui/system";
import Numbers from "../Numbers";

function Mes({
  socket,
  target,
  sendList,
  setSendList,
  recList,
  setRecList,
  mopen,
  setMopen,
}) {
  const [message, setMessage] = useState("");
  const handleClickSend = () => {
    const data = {
      socketId: target.socketId,
      type: 2,
      mes: {
        message: message,
      },
    };
    setSendList([
      ...sendList,
      {
        head: "Message",
        message: `${data.mes.message}`,
      },
    ]);
    socket.emit("req", data);
  };
  return (
    <div>
      <Numbers
        mopen={mopen}
        setMopen={setMopen}
        target={target}
        socket={socket}
        sendList={sendList}
        setSendList={setSendList}
        recList={recList}
        setRecList={setRecList}
      />
      <TextField
        id="outlined-basic"
        variant="outlined"
        name="m"
        type="text"
        value={message}
        disabled={mopen}
        label="Message"
        maxRows={8}
        multiline={true}
        fullWidth={true}
        inputProps={{ maxLength: 200 }}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
      <Box mt={2}>
        <Button variant="contained" disabled={mopen} onClick={handleClickSend}>
          Send
        </Button>
      </Box>
    </div>
  );
}

export default Mes;
