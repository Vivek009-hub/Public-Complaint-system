import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',    
    credentials: true
}))

app.use(express.json({limit: '10mb'}))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(express.static('public'))
app.use(cookieParser())



import authRoutes from './src/routes/authRoutes.js'
import testRoutes from './src/routes/test.route.js'
import complaintRotes from './src/routes/complaint.routes.js'


app.use('/api/auth', authRoutes)
app.use('/api/test', testRoutes)
app.use('/api/complaints',complaintRotes )


export {app}