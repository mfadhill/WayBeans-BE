import { ConfigOptions, v2 as cloudinary } from 'cloudinary'

export const CloudinaryProvider = {
    provide: 'Cloudinary',
    useFactory: (): ConfigOptions => {
        return cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        })
    },
}