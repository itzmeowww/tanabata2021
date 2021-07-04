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
  const [openWishForm, setOpenWishForm] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);

  const [card, setCard] = React.useState();
  const [wish, setWish] = React.useState("");
  const [name, setName] = React.useState("");

  const handleWishChange = (event) => {
    setWish(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleCardChange = (event) => {
    setCard(event.target.value);
  };

  const handleWishFormClickOpen = () => {
    setOpenWishForm(true);
  };
  const handleWishFormClickClose = () => {
    setOpenWishForm(false);
  };

  const handleInfoClickOpen = () => {
    setOpenInfo(true);
  };
  const handleInfoClickClose = () => {
    setOpenInfo(false);
  };

  const FormControlStyle = {
    minWidth: 200,
    marginY: 1,
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
        <Button
          variant="outlined"
          color="primary"
          onClick={handleWishFormClickOpen}
        >
          Make a Wish
        </Button>
        <Dialog
          open={openWishForm}
          onClose={handleWishFormClickClose}
          maxWidth="lg"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Box sx={{ paddingX: 2, backgroundColor: cardColors[card] }}>
            <DialogTitle id="alert-dialog-title">Make a wish</DialogTitle>
            <DialogContent>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
              >
                <FormControl sx={FormControlStyle} variant="standard">
                  <InputLabel id="demo-simple-select-label">Card</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={card}
                    onChange={handleCardChange}
                  >
                    <MenuItem value={1}>Strawberry</MenuItem>
                    <MenuItem value={2}>Avocado</MenuItem>
                    <MenuItem value={3}>Coconut</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={FormControlStyle} variant="standard">
                  <InputLabel id="wish">Wish</InputLabel>
                  <Select
                    labelId="wish"
                    id="select-wish"
                    value={wish}
                    onChange={handleWishChange}
                  >
                    <MenuItem value={1}>Meow!</MenuItem>
                    <MenuItem value={2}>Grrhh!</MenuItem>
                    <MenuItem value={3}>Woof!</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={FormControlStyle} variant="standard">
                  <TextField
                    size="small"
                    id="name"
                    label="Name"
                    variant="standard"
                    value={name}
                    onChange={handleNameChange}
                  />
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleWishFormClickClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleWishFormClickClose} color="primary">
                Make a Wish
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center" pt="10px">
        <Button
          variant="outlined"
          color="primary"
          onClick={handleInfoClickOpen}
        >
          What is Tanabata?
        </Button>
        <Dialog
          open={openInfo}
          onClose={handleInfoClickClose}
          maxWidth="lg"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>What is Tanabata?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              PLEASE ADD SOMETHING HERE PLEASE ADD SOMETHING HERE PLEASE ADD
              SOMETHING HERE PLEASE ADD SOMETHING HERE
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleInfoClickClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box></Box>
    </Box>
  );
}
