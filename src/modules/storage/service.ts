import { supabase } from '../../plugins/supabase'
import type { UploadResult } from './model'
import { AppError } from '../../shared/errors'

export class StorageService {
    private bucketName: string

    constructor() {
        this.bucketName = process.env.SUPABASE_BUCKET_NAME || 'images'
    }

    /**
     * Uploads a file to Supabase Storage.
     * Generates a unique filename using a timestamp and original name.
     */
    async uploadFile(file: File): Promise<UploadResult> {
        const timestamp = Date.now()
        const fileExt = file.type.split('/')[1] || 'bin'
        const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${fileName}`

        // Convert File to ArrayBuffer for Supabase Upload
        const fileBuffer = await file.arrayBuffer()

        const { data, error } = await supabase.storage
            .from(this.bucketName)
            .upload(filePath, fileBuffer, {
                contentType: file.type,
                upsert: false
            })

        if (error) {
            console.error('Supabase Storage Error:', error.message)
            throw new AppError('Failed to upload file to storage')
        }

        // Get the public URL of the uploaded file
        const { data: { publicUrl } } = supabase.storage
            .from(this.bucketName)
            .getPublicUrl(data.path)

        return {
            url: publicUrl,
            path: data.path
        }
    }
}
