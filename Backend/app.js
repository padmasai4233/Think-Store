import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config'
import userRoute from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoutes.js';
import './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();
const port = process.env.PORT || 5865;

await connectDB()
// await connectCloudinary()

//Allow multiple origins
const allowedOrigins=['http://localhost:5173','https://thinkstore-platform.vercel.app']
//
//middleware config
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins,credentials:true}));


app.get('/',(req,res)=>res.send("API working"));
app.use('/api/user',userRoute)
app.use('/api/seller', sellerRouter)

app.use('/api/product', productRouter)

app.use('/api/cart',cartRouter)

app.use('/api/address', addressRouter)

app.use('/api/order', orderRouter)

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})