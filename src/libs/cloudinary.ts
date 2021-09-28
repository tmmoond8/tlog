import axios from 'axios';

const Upload2Cloudinary = async (
  file: File | string,
  preset?: string
): Promise<{ id: string; imgUrl: string; format: string }> => {
  const form = new FormData();
  form.append('file', file);
  form.append('api_key', process.env.REACT_APP_CLOUDINARY_API_KEY || '');
  form.append(
    'upload_preset',
    preset || process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || ''
  );

  try {
    const { data } = await axios.post(
      process.env.REACT_APP_CLOUDINARY_UPLOAD_URL || '',
      form
    );
    return {
      id: data.public_id,
      imgUrl: data.secure_url.replace(
        'res.cloudinary.com',
        'noticon-static.tammolo.com'
      ),
      format: data.format,
    };
  } catch (error) {
    throw new Error('UPLOAD ERROR');
  }
};

export default {
  upload: Upload2Cloudinary,
  uploadTemp: (
    file: File | string
  ): Promise<{ id: string; imgUrl: string; format: string }> => {
    return Upload2Cloudinary(file, 'tlog_image');
  },
};
