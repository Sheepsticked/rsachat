import { Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";

function Bar({ user }) {
  return (
    <Toolbar>
      <MenuIcon />
      <Box ml={3} mr={3}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Typography variant="h5">{user}</Typography>
        </Link>
      </Box>
    </Toolbar>
  );
}

export default Bar;
