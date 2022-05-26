import { TextField, Button, Alert, InputAdornment } from "@mui/material";
import React, { useState } from "react";
import { Box } from "@mui/system";
const BigInt = require("big-integer");

function Numbers({ target, socket, sendList, setSendList }) {
  const [p, setP] = useState("");
  const [q, setQ] = useState("");
  const [gen, setGen] = useState(true);
  const [errorText, setErrorTest] = useState("");
  const [error, setError] = useState("hidden");
  const [open, setOpen] = useState(false);
  const data = {
    socketId: target.socketId,
    type: 1,
    mes: {},
  };
  const re = /^[0-9\b]+$/;
  const handleClickSave = () => {
    if (p * q < 1111) {
      setErrorTest("N value is too low");
      setError("visible");
      return;
    }
    if (p === "" || q === "") {
      setError("visible");
      setErrorTest("Number can't be null!");
    } else {
      if (isPrime(BigInt(p)) && isPrime(BigInt(q))) {
        setOpen(true);
        setGen(false);
      } else {
        setErrorTest("Number is not prime");
        setError("visible");
        return;
      }
      setError("hidden");
    }
  };
  const handleClickGen = () => {
    data.type = 1;
    data.mes = {
      p: p,
      q: q,
    };
    socket.emit("req", data);
    const lr = [...sendList, { head: "Keys", message: `send p=${p}, q=${q}` }];
    setSendList(lr);
    setGen(true);
  };
  const handleDisable = () => {
    setOpen(false);
    setGen(true);
    data.type = 10;
    data.mes = {
      open: false,
    };
    socket.emit("req", data);
  };
  const isPrime = (num) => {
    return BigInt(num).isProbablePrime();
  };
  return (
    <div>
      <Box sx={{ display: "flex" }} flexDirection="row">
        <TextField
          id="outlined-basic"
          variant="outlined"
          name="p"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">P =</InputAdornment>
            ),
          }}
          type="text"
          value={p}
          disabled={open}
          onChange={(e) => {
            if (e.target.value === "" || re.test(e.target.value)) {
              setP(e.target.value);
            }
          }}
        />
        <Box ml={2} mt={1}>
          <Button variant="contained" disabled={open} onClick={handleClickSave}>
            Save
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: "flex" }} flexDirection="row" mt={2}>
        <TextField
          id="outlined-basic"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">Q =</InputAdornment>
            ),
          }}
          variant="outlined"
          name="q"
          type="text"
          value={q}
          disabled={open}
          onChange={(e) => {
            if (e.target.value === "" || re.test(e.target.value)) {
              setQ(e.target.value);
            }
          }}
        />
        <Box ml={2} mt={1}>
          <Button variant="contained" onClick={handleDisable}>
            Edit
          </Button>
        </Box>
      </Box>
      <Box mt={2} mb={1}>
        <Button variant="contained" disabled={gen} onClick={handleClickGen}>
          Generate keys
        </Button>
      </Box>
      <Box mt={2} mb={3}>
        <Alert sx={{ visibility: error }} severity="error">
          {errorText}
        </Alert>
      </Box>
    </div>
  );
}

export default Numbers;
