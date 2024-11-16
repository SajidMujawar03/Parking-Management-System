const upload_preset=import.meta.env.VITE_CLOUDINARY_PRESET
const cloud_name=import.meta.env.VITE_CLOUDINARY_NAME

export const uploadToCloudinary=async (file)=>{
    const uploadData=new FormData();

    uploadData.append('file',file);
    uploadData.append("upload_preset",upload_preset);
    uploadData.append("cloud_name",cloud_name)

    const res=await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,{
        method:"post",
        body:uploadData
    })

    const data=await res.json();

    // console.log(data)

    return data;
}