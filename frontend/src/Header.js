import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

function Header() {
  return (
    <AppBar position="static" sx={{backgroundColor: 'rgb(0, 20, 36)', padding: '20px 0px', marginBottom: '30px'}}>
      <Toolbar>
        <Typography variant="h5" className='logo'>
        TRUE TECH <br/>HACK (ВЛиД Team)
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;