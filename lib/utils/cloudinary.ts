const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

/**
 * Uploads a single file to Cloudinary and returns the hosted secure URL.
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  const response = await fetch(UPLOAD_URL, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed: ${response.statusText}`)
  }

  const data = await response.json()
  return data.secure_url as string
}

/**
 * Uploads multiple files to Cloudinary in parallel and returns an array of hosted secure URLs.
 * Respects the 4-image limit enforced by the API.
 */
export async function uploadImages(files: File[]): Promise<string[]> {
  const limited = files.slice(0, 4)
  return Promise.all(limited.map(uploadImage))
}
