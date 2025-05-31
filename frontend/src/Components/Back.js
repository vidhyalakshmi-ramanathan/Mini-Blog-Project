import { Grid2, Box, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

function Back() {
    const navigate = useNavigate();
    const handleBackIncon =() =>{
        navigate(-1)
    }
  return (
    <>
      <Box sx={{ padding:2}}>
        <Grid2 container justifyContent={'left'} >
            <Grid2 item>
                <IconButton sx={{color:'black'}}
                onClick={handleBackIncon}
                >
                <ArrowBackIcon />
                </IconButton>
            </Grid2>
        </Grid2>
      </Box>
    </>
  )
}

export default Back
