import { Button, Box, Grid2 } from '@mui/material';
import { Link } from 'react-router-dom';

function ViewAll() {
  return (
    <Box sx={{ padding: 2 , backgroundColor:'#F5F5F5'}}>
      <Grid2 container justifyContent="center" spacing={2}>
        <Grid2 item >
          <Button
            component={Link}
            to="/posts"
            variant="contained"
            color="primary"
            sx={{ width:'250px', backgroundColor:'black' , '&:hover':{fontSize:'15px'}}}
          >
            View All Post
          </Button>
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default ViewAll;
