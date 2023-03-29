import React,{useEffect, useState} from "react"
import axios from 'axios'
import "./App.css"
import { Box, Grid, Container, Button } from "@mui/material"
import Header from "./Header"
import VideoPlayer from "./Player"
import VideoList from "./VideoList"
import DataTable from 'react-data-table-component'

function App() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [video, setVideo] = useState({
    save: 'http://dev4.tm-mg.ru/london-olympics-safe.mp4',
    original: 'http://dev4.tm-mg.ru/london-olympics-orig.mp4'
  })
  const [save, setSave] = useState('on')
  
  const changeSave = (val) => {
    console.log(val)
    if (val === true){
      console.log('here1')
      setSave('on')
    } else {
      console.log('here2')
      setSave('off')
    }
  }

  const getData = () => {
    //тут должны были быть запросы к API но мы не успели соединить бэк и фронт =(
    //Вы можете убедится что бэк есть в папке backend и посмотреть на красивый сваггер
    setLoading(true)
    const resp = axios.get('http://91.185.84.121/api/v1/videos/')
    setData(resp)
    setLoading(false)
  }
  useEffect(() => {
    getData()
    setVideo({...video, safe: 'http://dev4.tm-mg.ru/london-olympics-safe.mp4'})
  },[])
  const columns = [
    {
        name: 'Название',
        selector: row => row.name,
        width: '150px'
    },
    {
        name: 'Описание',
        selector: row => row.descr,
        cell: row => (
          <div>
              {row.descr}
          </div>
        ),
        style: { 'whiteSpace': 'unset' } 
    },
    {
      name: 'Смотреть',
      selector: row => row.url,
      cell: row => (
        <div className='user-info text-truncate ms-1 cell-table'>
        <span className='d-block fw-bold text-truncate'> 
        <Button
          variant="contained"
          onClick={() =>  setVideo({original: row.url, save: row.url_save})}>
          Смотреть
        </Button>
        </span>
      </div>
      )
  },
];
console.log(video)
const tableList = [
    {
        id: 1,
        name: 'Покемоны',
        descr: 'СМОТРЕТЬ С ОСТОРОЖНОСТЬЮ. Фрагмент оригинальной серии мультсериала Покемон. Серия известна тем, что вызывала приступы эпилепсии.',
        url: 'http://dev4.tm-mg.ru/pokemon-orig.mp4',
        url_save: 'http://dev4.tm-mg.ru/pokemon-safe.mp4'
    },
    {
      id: 2,
      name: 'Олимпиада',
      descr: 'СМОТРЕТЬ С ОСТОРОЖНОСТЬЮ. Фрагмент записи трансляции Олимпийских Игр в Лондоне. Световые и цветовые эффекты в трансляции спровоцировали у некоторых зрителей приступы эпилепсии.',
      url: 'http://dev4.tm-mg.ru/london-olympics-orig.mp4',
      url_save: 'http://dev4.tm-mg.ru/london-olympics-safe.mp4'
    }
]
  return (
      <Container maxWidth="lg">
      <Header />
      <Grid container spacing={2} >
        <Grid item xs={12} md={8} className="mt-2" spacing={2} sx={`padding-top: 50px;`}>
          <VideoPlayer
            changeSave={changeSave}
            url={
              save == 'on' ? video.save : video.original
            }

          />
            <br/>
          <DataTable
            class={{marginBottom: '40px'}}
            columns={columns}
            data={tableList}
          />
        </Grid>
        <Grid item xs={12} md={4} sx={{padding: '0px', margin: '0px'}}>
          <VideoList />
        </Grid>
      </Grid>
      <Grid container spacing={2} >
        <Grid item xs={12} md={8} className="mt-2" spacing={2} style={{marginBottom: '50px'}}></Grid>
      </Grid>
      </Container>
  )
}

export default App
