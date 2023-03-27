/** React */
import React, { useState, useRef  } from 'react';

import ReactPlayer from 'react-player';

/** mui components */
import { Button, Modal, Slider, Typography, Box, IconButton } from '@mui/material/';
import styled from '@emotion/styled'
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';

/** assets */
import exampleImg2 from './assets/img/wheel2.png'
const imgStyle = (props) => ({
  filter: `
  brightness(${props.filter.bright}%) 
  contrast(${props.filter.contrast}%) 
  saturate(${props.filter.saturate}%) 
  sepia(${props.filter.sepia}%) 
  hue-rotate(${props.filter.hue}deg);`,
  transition: 'filter 0.3s ease-out',
});

const Img = styled.img`
  ${props => imgStyle(props)}
`;
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  color: 'black',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const VideoPlayer = ({ url }) => {
  const [filter, setFilter] = useState('none');
  const [menu, setMenu] = useState(null);
  const [open, setOpen] = React.useState(false);

  const [filterMain, setFilterMain] = React.useState({
    bright: 100,
    contrast: 100,
    saturate: 100,
    sepia: 0,
    hue: 0
  })

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);



  const handleFilterClick = (item) => {
    console.log(item.bright)
    setFilterMain({...filterMain, bright: item.bright, contrast: item.contrast, saturate: item.saturate, sepia: item.sepia, hue: item.hue })
    console.log(filterMain)
  }
  const playerRef = useRef(null);
  

  const handlePlayerContextMenu = (event) => {
    event.preventDefault();

    // Если меню уже открыто, удаляем его
    if (menu) {
      document.body.removeChild(menu);
      setMenu(null);
      return;
    }


    // Создаем div-элемент для нашего меню
    const newMenu = document.createElement('div');
    newMenu.style.position = 'absolute';
    newMenu.style.top = `${event.clientY}px`;
    newMenu.style.left = `${event.clientX}px`;
    newMenu.style.backgroundColor = 'white';
    newMenu.style.border = '1px solid black';
    newMenu.style.padding = '5px';
    newMenu.classList.add('filter-menu');
  
    // Добавляем в меню пункты
    const menuItem0 = document.createElement('div');
    menuItem0.innerHTML = 'Без фильтра';
    menuItem0.onclick = () => handleFilterClick({bright: 100, contrast: 100, saturate: 100, sepia: 0, hue: 0});
    newMenu.appendChild(menuItem0);

    const menuItem1 = document.createElement('div');
    menuItem1.innerHTML = 'Протанопия';
    menuItem1.onclick = () => handleFilterClick({bright: 70, contrast: 100, saturate: 0, sepia: 60, hue: -45});
    newMenu.appendChild(menuItem1);
  
    const menuItem2 = document.createElement('div');
    menuItem2.innerHTML = 'Дейтеранопия';
    menuItem2.onclick = () =>  handleFilterClick({bright: 80, contrast: 120, saturate: 0, sepia: 60, hue: 35});
    newMenu.appendChild(menuItem2);

    const menuItem3 = document.createElement('div');
    menuItem3.innerHTML = 'Тританопия';
    menuItem3.onclick = () =>  handleFilterClick({bright: 110, contrast: 90, saturate: 200, sepia: 30, hue: -20});
    newMenu.appendChild(menuItem3);

    const menuItem4 = document.createElement('div');
    menuItem4.innerHTML = 'Свой настройки';
    menuItem4.onclick = () => handleOpen();
    newMenu.appendChild(menuItem4);
  
    // Добавляем меню на страницу
    document.body.appendChild(newMenu);

    // Сохраняем ссылку на новый элемент меню
    setMenu(newMenu);
  
    // Обработчик клика на любом месте страницы, чтобы скрыть меню
    const hideMenu = () => {
      document.removeEventListener('click', hideMenu);
      document.body.removeChild(newMenu);
      setMenu(null);
    };
    document.addEventListener('click', hideMenu);
  };
  const StyledPlayer = styled(ReactPlayer)`

    video {
      filter: brightness(${filterMain.bright}%) contrast(${filterMain.contrast}%) saturate(${filterMain.saturate}%) sepia(${filterMain.sepia}%) hue-rotate(${filterMain.hue}deg)
    }
  `;
  const handleModalOpen = () => {
    setOpen(true);
  };
  return (
   
    <div>
      <div onContextMenu={handlePlayerContextMenu}>
      <StyledPlayer 
        url={url}
        ref={playerRef}
        controls
        width={'100%'}
        height={'100%'}
        playsinline={true}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload' // Убрать кнопку скачивания видео
            }
          }
        }}
        key={filter}
        
      /> 
      <Button variant="contained" onClick={handleModalOpen} sx={{color: 'white'}}> <SettingsIcon /> Настройки доступности</Button>
    </div>
       <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Задайте собственные настройки фильтрации изображения
          </Typography>
          <Box sx={{ width: 300 }}>
            <Typography id="input-slider" gutterBottom>
              Яркость
            </Typography>
            <Slider
              aria-label="Яркость"
              onChange ={(e) => setFilterMain({...filterMain, bright: e.target.value})}
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
              onChange ={(e) => setFilterMain({...filterMain, contrast: e.target.value})}
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
              onChange ={(e) => setFilterMain({...filterMain, sepia: e.target.value})}
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
              onChange ={(e) => setFilterMain({...filterMain, saturate: e.target.value})}
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
              onChange ={(e) => setFilterMain({...filterMain, hue: e.target.value})}
              defaultValue={filterMain.hue}
              // getAriaValueText={valuetext}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={360}
            />
          </Box>
       
          <Img src={exampleImg2} filter={filterMain} width="200px"/>
    
        </Box>
        
      </Modal>
    </div>
   
    
  );
};

export default VideoPlayer;