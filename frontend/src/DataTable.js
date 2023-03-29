import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
function DataTable({ data }) {
  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Название', width: 200 },
    { field: 'info', headerName: 'Описание'},
    { field: 'btn', headerName: 'Смотреть', 
    cell: row => (
      <div className='user-info text-truncate ms-1 cell-table'>
      <span className='d-block fw-bold text-truncate'> 
          {row.url}
      </span>
    </div>
    ) },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
        <Box sx={{ height: 400, width: '100%', marginTop: 2, color: 'white'}}>
        <h2>Список обработанных видеофайлов</h2>
        <DataGrid rows={data} columns={columns} pageSize={5} sx={{color: 'white'}} />
        </Box>
    </ThemeProvider>
  );
}

export default DataTable;