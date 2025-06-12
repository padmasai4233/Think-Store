import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/product.js';

export const addProduct = async (req, res) => {
  try {
    console.log('addProduct started');

    if (!req.body.productData) {
      console.log('Missing productData, sending 400');
      return res.status(400).json({ success: false, message: 'Product data is required' });
    }

    const productData = JSON.parse(req.body.productData);

    productData.offerprice = Number(productData.offerprice);
    if (isNaN(productData.offerprice)) {
      console.log('Invalid offerprice, sending 400');
      return res.status(400).json({
        success: false,
        message: 'Offer price must be a valid number',
      });
    }

    const images = req.files || [];
    if (images.length === 0) {
      console.log('No images, sending 400');
      return res.status(400).json({
        success: false,
        message: 'At least one image is required',
      });
    }

    console.log('Uploading images...');
    const imageURLs = await Promise.all(
      images.map(async (file) => {
        const uploaded = await cloudinary.uploader.upload(file.path, {
          resource_type: 'image',
        });
        return uploaded.secure_url;
      })
    );

    console.log('Creating product...');
    const newProduct = await Product.create({
      ...productData,
      image: imageURLs,
    });

    console.log('Sending success response');
    return res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product: newProduct,
    });

  } catch (error) {
    console.error('❌ Add Product Error:', error);

    if (!res.headersSent) {
      console.log('Sending 500 server error');
      return res.status(500).json({
        success: false,
        message: 'Server error while adding product',
        error: error.message,
      });
    }
  }
};



//Get product list   /api/product/list
export const productList = async(req,res)=>{
    try {
        const products = await Product.find({})
        res.json({success:true, products})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message});
    }
}


//Get single product   /api/product/id
export const productById = async(req,res)=>{
    try {
        const {id} =req.body;
        const product = await Product.findById(id)
        res.json({success:true, product})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message});
    }
}


//Change product inStock   /api/product/stock
export const changeStock = async(req,res)=>{
    try {
        const {id, inStock} = req.body;
        await Product.findByIdAndUpdate(id, {inStock})
        res.json({success:true, message: 'Stock updated successfully'})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message});
    }
}