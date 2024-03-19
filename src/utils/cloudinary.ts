import { v2 as cloudinary } from 'cloudinary';

function configCloudinary(){
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });      
}


export const uploadFile = async (file: string, folder:string):Promise<any> => {
    try {
        
        const response = await cloudinary.uploader.upload(file, {
            folder: `Mediheal/${folder}`
        });
        return response.public_id
        
    } catch (error) {
        console.log("Error in UploadFile:", error);
    }
};

export default configCloudinary;
