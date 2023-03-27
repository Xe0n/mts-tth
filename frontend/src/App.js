import React from "react"

// import Button from "@mui/material/Button"
// import Box from '@mui/material/Box'
// import ButtonGroup from "@mui/material/ButtonGroup"
import "./App.css"
// import Paper from '@mui/material/Paper';
// import { styled } from '@mui/material/styles';
import { Box, Grid, Container } from "@mui/material"
import Header from "./Header"
import VideoPlayer from "./Player"
import DataTable from "./DataTable"
import VideoList from "./VideoList"

function App() {
  // const Item = styled(Paper)(({ theme }) => ({
  //   backgroundColor: '#282c34',
  //   ...theme.typography.body2,
  //   padding: theme.spacing(5),
  //   textAlign: 'center',
  //   color: theme.palette.text.secondary,
  // }));

  const sampleData = [
    { id: 1, name: "Sample 1", info: "Info 1" },
    { id: 2, name: "Sample 2", info: "Info 2" },
    { id: 3, name: "Sample 3", info: "Info 3" }
  ]

  const sampleVideos = [
    {
      id: 1,
      title: "Video 1",
      author: "Author 1",
      thumbnail: "https://via.placeholder.com/64"
    },
    {
      id: 2,
      title: "Video 2",
      author: "Author 2",
      thumbnail: "https://via.placeholder.com/64"
    },
    {
      id: 3,
      title: "Video 3",
      author: "Author 3",
      thumbnail: "https://via.placeholder.com/64"
    }
  ]

  return (
      <Container maxWidth="lg">
      <Header />
      <Grid container spacing={2} >
        <Grid item xs={12} md={8} className="mt-2" spacing={2} sx={`padding-top: 50px;`}>
          <VideoPlayer
            url={
              "https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8"
            }
          />
          <DataTable data={sampleData} />
        </Grid>
        <Grid item xs={12} md={4} sx={{padding: '0px', margin: '0px'}}>
          <VideoList videos={sampleVideos} />
        </Grid>
      </Grid>
      </Container>
  )
}

export default App
