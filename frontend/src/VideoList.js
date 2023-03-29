import React, { useState } from "react"
import {
  List,
  Modal,
  TextField,
  Typography,
  LinearProgress,
  Button,
  Box,
  Stack
} from "@mui/material"
import axios from "axios"
import styled from "@emotion/styled"

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
  const [selectedFile, setSelectedFile] = useState(null)
  const [title, setTitle] = useState()
  const [progress, setProgress] = useState(0)

  const handleChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!selectedFile) {
      alert("Выберите видеофайл для загрузки")
      return
    }

    const formData = new FormData()
    formData.append("file", selectedFile)
    formData.append("name", title)
    console.log(selectedFile)
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}, ${pair[1]}`);
    }
    // try {
    //   const response = await axios.post("/api/videos", formData, {
    //     headers: { "Content-Type": "multipart/form-data" },
    //     onUploadProgress: (progressEvent) => {
    //       const percentCompleted = Math.round(
    //         (progressEvent.loaded * 100) / progressEvent.total
    //       )
    //       setProgress(percentCompleted)
    //     }
    //   })

    //   alert("Видео успешно загружено")
    //   setSelectedFile(null)
    //   setProgress(0)
    // } catch (error) {
    //   alert("Ошибка загрузки видео")
    //   console.error(error)
    // }
  }
  const inputFile = React.useRef(null)

  const handleClick = () => {
    inputFile.current.click()
  }

  return (
    <>
      <List sx={{ padding: "0px", margin: "0px" }}>
        <p style={{ paddingTop: "0px", marginTop: "0px" }}>
          Для демонстрации возможностей нашего сервиса мы предобработали два известных видео
        </p>
        {/* <Button variant="contained" onClick={() => handleOpen()}>
          Добавить видео
        </Button> */}
      </List>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <Typography variant="h5">Загрузка видео</Typography>
            <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
              <Box sx={{ display: "none" }}>
                <input type="file" ref={inputFile} onChange={handleChange} />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Stack
                  component="form"
                  sx={{
                    width: "100%",
                    marginTop: "20px"
                  }}
                  spacing={2}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="outlined-basic"
                    label="Название видео"
                    variant="outlined"
                    style={{width: '100%'}}
                    onChange={(e) => setTitle(e.target.value)}
                  />{" "}
                  <StyledButton onClick={handleClick} variant="outlined">
                    Выберите файл
                  </StyledButton>
                  {selectedFile && (
                    <Typography sx={{ marginLeft: "16px" }} variant="body1">
                      {selectedFile.name}
                    </Typography>
                  )}
                </Stack>
              </Box>
              <StyledButton type="submit" variant="contained">
                Загрузить
              </StyledButton>
            </form>

            {progress > 0 && (
              <LinearProgress variant="determinate" value={progress} />
            )}
          </div>
        </Box>
      </Modal>
    </>
  )
}
const StyledButton = styled(Button)`
  margin-top: 16px;
`

export default VideoList
