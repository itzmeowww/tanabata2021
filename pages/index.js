import * as React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import ProTip from "../src/ProTip";
import Link from "../src/Link";
import Copyright from "../src/Copyright";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";

import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import { useState } from "react";
export default function Index() {
  const cardColors = ["#FEFEFE", "#FAEBE0", "#B5CDA3", "#C1AC95"];
  const [open, setOpen] = useState(false);

  const [value, setValue] = React.useState();

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box width="100vw" height="100vh" maxWidth="100%">
      <Typography variant="h3" align="center" mt="10vh">
        七夕—Tanabata
      </Typography>
      <Typography variant="h6" align="center">
        @KVIS — 7/7/2021
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="center" pt="10vh">
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          Make a wish
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="lg"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Box sx={{ backgroundColor: cardColors[value] }}>
            <DialogTitle id="alert-dialog-title">Make a wish</DialogTitle>
            <DialogContent>
              <FormControl sx={{ minWidth: 120 }} variant="standard">
                <InputLabel id="demo-simple-select-label">Card</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={value}
                  onChange={handleChange}
                >
                  <MenuItem value={1}>Strawberry</MenuItem>
                  <MenuItem value={2}>Avocado</MenuItem>
                  <MenuItem value={3}>Coconut</MenuItem>
                </Select>
                <Box width="100%" height="10px"></Box>
                <TextField
                  size="small"
                  id="name"
                  label="Name"
                  variant="standard"
                />
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleClose} color="primary" autoFocus>
                Make a wish
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
    </Box>
  );
}
