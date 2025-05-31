import axios from 'axios'

const instance = axios.create() ;
instance.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req
})

export default instance
