import { Alert,Snackbar} from "@mui/material"
import { createContext, useCallback, useContext, useState } from "react"

const SnackbarContext = createContext(null)

export const  SnackbarProvider = ({children}) =>{
  const [snackbar,setSnackbar] = useState({
    open:false,
    vertical:'top',
    horizontal:'center',
    message:'',
    severity:'info'
  });
  const showSnackbar = useCallback((message,severity='info') => {
    setSnackbar({
      open:'true',
      message,
      severity,
      vertical:'top',
      horizontal:'center'
    });
  },[])

  const handleClose = () => {
    setSnackbar((prev) => ({...prev,open:false}))
  }
    
  return (
    <SnackbarContext.Provider value={{ showSnackbar}}>
      {children}
        <Snackbar
        anchorOrigin={{
          vertical:snackbar.vertical,
          horizontal:snackbar.horizontal }}
        open={snackbar.open}
        onClose={handleClose}
        key={snackbar.vertical + snackbar.horizontal}
        autoHideDuration={10000}
        >
        <Alert onClose={handleClose} severity={snackbar.severity || 'info'} sx={{width:'100%'}} variant="filled">
        {snackbar.message}
        </Alert>
        </Snackbar>
  </SnackbarContext.Provider>
  )
}

export const useSnackbar =() => useContext(SnackbarContext)
