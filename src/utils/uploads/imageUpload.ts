import { createClient } from "../supabase/client";

export async function handleImageFileUpload(event, showToast, folder = 'Images') {
    const supabase = createClient();
// FOLDERS
// 1.Images
// 2. Docuements
// 3. Profiles

    const file = event.target.files[0];
    if (!file) return;
    if ((file.size / (1024 * 1024)) > 20) {
        showToast('Image file (PNG, WEBP, JPEG) must be 20MB or below!', 'error');
        return;
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
        showToast('Please select a valid image file (PNG, WEBP, JPEG)!', 'error');
        return;
    }

    try {
        // 1. Upload file to Supabase bucket (replace 'your-bucket-name' with yours)
        const fileExt = file.name.split('.').pop();
        const fileName = `${folder}/${Math.random()}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('fleetmaster_files')
            .upload(fileName, file);
        if (error) throw error;

        // 2. Get the public URL
        const { data: { publicUrl } } = supabase.storage
            .from('fleetmaster_files')
            .getPublicUrl(fileName);


        // return a string with the file path 
        return (publicUrl);
    } catch (error) {
        showToast(error.message, 'error')
        console.error('Error uploading image:', error.message);
    }
};
