import { Box ,Container, Grid2, Typography, Link} from '@mui/material'
import { Facebook, Instagram, Twitter } from '@mui/icons-material'

function Footer() {
  return (
    <>
    <Box component='footer' sx={{bottom:'0',width:'100%', backgroundColor:'white', py:4}}>
        <Container>
            <Grid2 container spacing={3} justifyContent="space-between" alignItems="center">
            <Grid2 item xs={12} sm={4} sx={{ textAlign: 'center', sm: { textAlign: 'left' } }}>
                <Typography variant='h4' component="a" href='#' sx={{textDecoration:'none', fontWeight:'bold', color:'black'}}>
                    Bloggers
                </Typography>
            </Grid2>  

            <Grid2 item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', sm: { alignItems: 'flex-start' } }}>
            <Link href="#" sx={{ color: 'black', textDecoration: 'none', mb: 1 }}>Terms & Agreements</Link>
            <Link href="#" sx={{ color: 'black', textDecoration: 'none' }}>Privacy Policy</Link>
          </Grid2>
            </Grid2>

            <Grid2 item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2, sm: { mt: 0 } }}>
                <Link href="#" target="_blank" sx={{ color: 'black' }}>
                <Facebook />
                </Link>
                <Link href="#" target="_blank" sx={{ color: 'black' }}>
                <Instagram />
                </Link>
                <Link href="#" target="_blank" sx={{ color: 'black' }}>
                <Twitter />
                </Link>
            </Grid2>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'black' }}>
                    &#169; All Rights Reserved By Cafe
                </Typography>
                </Box>
        </Container>
      </Box>
    </>
  )
}

export default Footer
