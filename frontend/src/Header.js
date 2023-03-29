import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

function Header() {
  return (
    <AppBar position="static" sx={{backgroundColor: 'rgb(0, 20, 36)', padding: '30px 0px', marginBottom: '30px'}}>
      <Toolbar>
        <Typography variant="h3" className='logo'>
        SafeStream
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;