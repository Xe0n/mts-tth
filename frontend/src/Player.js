import React, { useRef, useState, useEffect } from "react"
import ReactPlayer from "react-player"
import PropTypes from "prop-types"
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
/** mui components */
import {
  Button,
  Modal,
  Slider,
  Typography,
  Box,
  IconButton,
  Tab,
  Tabs,
  FormControlLabel,
  Switch 
} from "@mui/material/"
import styled from "@emotion/styled"
import SettingsIcon from "@mui/icons-material/Settings"
import CloseIcon from "@mui/icons-material/Close"

/** assets */
import exampleImg2 from "./assets/img/wheel2.png"

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
function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  }
}
const VideoPlayer = ({url}) => {
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const [open, setOpen] = React.useState(false)
  const playerRef = useRef(null)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)


  const [filterMain, setFilterMain] = React.useState({
    bright: 100,
    contrast: 100,
    saturate: 100,
    sepia: 0,
    hue: 0
  })
  const handleFilterClick = (item) => {
    console.log(item.bright)
    setFilterMain({...filterMain, bright: item.bright, contrast: item.contrast, saturate: item.saturate, sepia: item.sepia, hue: item.hue })
    console.log(filterMain)
  }
  const handleModalOpen = () => {
    setOpen(true)
  }
  useEffect(() => {
    const playerElement = playerRef.current?.wrapper?.querySelector("video")

    if (!playerElement) {
      return
    }

    playerElement.style.filter = `brightness(${filterMain.bright}%) contrast(${filterMain.contrast}%) saturate(${filterMain.saturate}%) sepia(${filterMain.sepia}%) hue-rotate(${filterMain.hue}deg)`
  }, [filterMain])

  const handleReady = () => {
    const playerElement = playerRef.current?.wrapper?.querySelector("video")
    if (playerElement) {
      playerElement.addEventListener("play", () => {})
    }
  }

  const handleBrightnessChange = (e) => {
    setFilterMain({ ...filterMain, bright: e.target.value })
  }
  const onChangeBitrate = (event) => {
    const internalPlayer = playerRef.current?.getInternalPlayer('hls');
    if (internalPlayer) {
        // currentLevel expect to receive an index of the levels array
        internalPlayer.currentLevel = event.target.value;
    }
}
console.log(playerRef.current?.getInternalPlayer('hls').levels)
  return (
    <div>
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        controls
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload' // Убрать кнопку скачивания видео
            }
          }
        }}
        onReady={handleReady}
      />
      <Button
        variant="contained"
        onClick={handleModalOpen}
        sx={{ color: "white", marginTop: '10px' }}
      >
        {" "}
        <SettingsIcon /> Настройки доступности
      </Button>
      {/* <CrisisAlertIcon /> */}
       <FormControlLabel control={<Switch defaultChecked />} label={`Безопасный режим`} style={{marginLeft: '10px', marginTop: '6px'}}/> 
      Quality:
      <select onChange={onChangeBitrate}>
        {playerRef.current?.getInternalPlayer('hls')?.levels.map(
          (level, id) => <option key={id} value={id}>
            {level.bitrate}
          </option>
        )}
      </select>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Свой настройки" {...a11yProps(0)} />
                <Tab label="Сетапы" {...a11yProps(1)} />
                {/* <Tab label="Item Three" {...a11yProps(2)} /> */}
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Задайте свои настройки
              </Typography>
              <Box sx={{ width: 300 }}>
                <Typography id="input-slider" gutterBottom>
                  Яркость
                </Typography>
                <Slider
                  aria-label="Яркость"
                  onChange={(e) =>
                    setFilterMain({ ...filterMain, bright: e.target.value })
                  }
                  defaultValue={filterMain.bright}
                  // getAriaValueText={valuetext}
                  valueLabelDisplay="auto"
                  step={5}
                  marks
                  min={0}
                  max={200}
                />
                <Typography id="input-slider" gutterBottom>
                  Контрастность
                </Typography>
                <Slider
                  aria-label="Контрастность"
                  onChange={(e) =>
                    setFilterMain({ ...filterMain, contrast: e.target.value })
                  }
                  defaultValue={filterMain.contrast}
                  // getAriaValueText={valuetext}
                  valueLabelDisplay="auto"
                  step={5}
                  marks
                  min={0}
                  max={200}
                />
                <Typography id="input-slider" gutterBottom>
                  Сепия
                </Typography>
                <Slider
                  aria-label="Сепия"
                  onChange={(e) =>
                    setFilterMain({ ...filterMain, sepia: e.target.value })
                  }
                  defaultValue={filterMain.sepia}
                  // getAriaValueText={valuetext}
                  valueLabelDisplay="auto"
                  step={5}
                  marks
                  min={0}
                  max={100}
                />
                <Typography id="input-slider" gutterBottom>
                  Сатурация
                </Typography>
                <Slider
                  aria-label="Сатурация"
                  onChange={(e) =>
                    setFilterMain({ ...filterMain, saturate: e.target.value })
                  }
                  defaultValue={filterMain.saturate}
                  // getAriaValueText={valuetext}
                  valueLabelDisplay="auto"
                  step={5}
                  marks
                  min={0}
                  max={200}
                />
                <Typography id="input-slider" gutterBottom>
                  Настройка цветности
                </Typography>
                <Slider
                  aria-label="Настройка цветности"
                  onChange={(e) =>
                    setFilterMain({ ...filterMain, hue: e.target.value })
                  }
                  defaultValue={filterMain.hue}
                  // getAriaValueText={valuetext}
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={0}
                  max={360}
                />
              </Box>

              <img src={exampleImg2} style={{filter: `brightness(${filterMain.bright}%) contrast(${filterMain.contrast}%) saturate(${filterMain.saturate}%) sepia(${filterMain.sepia}%) hue-rotate(${filterMain.hue}deg`}} width="100px" />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Button sx={{marginTop: '20px'}} variant="contained" onClick={() => handleFilterClick({bright: 100, contrast: 100, saturate: 100, sepia: 0, hue: 0})}>
                  Без фильтра
                </Button> <br />
                <Button sx={{marginTop: '20px'}} variant="contained" onClick={() => handleFilterClick({bright: 70, contrast: 100, saturate: 0, sepia: 60, hue: -45})}>
                  Протанопия
                </Button> <br />
                <Button sx={{marginTop: '20px'}} variant="contained" onClick={() => handleFilterClick({bright: 80, contrast: 120, saturate: 0, sepia: 60, hue: 35})}>
                  Дейтеранопия
                </Button> <br />
                <Button sx={{marginTop: '20px'}} variant="contained" onClick={() => handleFilterClick({bright: 110, contrast: 90, saturate: 200, sepia: 30, hue: -20})}>
                  Тританопия
                </Button>
            </TabPanel>
            <TabPanel value={value} index={2}>
              Item Three
            </TabPanel>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{
              position: "absolute",
              right: 28,
              top: 18
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Modal>
    </div>
  )
}
export default VideoPlayer
