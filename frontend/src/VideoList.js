import React from "react"
import {
  List,
  Modal,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Box
} from "@mui/material"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  color: "black",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4
}
function VideoList({ videos }) {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <List sx={{ padding: "0px", margin: "0px" }}>
        <p style={{ paddingTop: "0px", marginTop: "0px" }}>
          Для демонстрации возможностей нашего сервиса вы можете добавить свое
          видео в формате HLS
        </p>
        <Button variant="contained" onClick={() => handleOpen()}>Добавить видео</Button>
      </List>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <input
            accept="image/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            />
            <label htmlFor="raised-button-file">
            <Button variant="contained" component="span" >
                Upload
            </Button>
            </label> 
        </Box>
      </Modal>
    </>
  )
}

export default VideoList
