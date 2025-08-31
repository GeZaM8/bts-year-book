import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { supabase } from '@/../lib/supabase';

const MAX_FILE_SIZE = 3 * 1024 * 1024;
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

export async function saveFoto(foto: File, name: string, tanggal_lahir: string): Promise<string> {
  if (foto.size > MAX_FILE_SIZE) {
    throw new Error(`Ukuran file terlalu besar. Maksimal ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }
  if (!ALLOWED_MIME.includes(foto.type)) {
    throw new Error(`Tipe file tidak didukung. Hanya: ${ALLOWED_MIME.join(', ')}`);
  }

  const buffer = Buffer.from(await foto.arrayBuffer());
  const ext = foto.type.split('/')[1];
  const safeName = name.replace(/\s+/g, '_').toLowerCase();
  const safeTgl = tanggal_lahir.replace(/-/g, '');
  const uniqueId = randomUUID().slice(0, 8);
  const fileName = `${safeName}_${safeTgl}_${uniqueId}.${ext}`;

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), buffer);

  const { error } = await supabase.storage
    .from('yearbook-photos')
    .upload(fileName, buffer, {
      contentType: foto.type,
      upsert: true,
    });

  if (error) {
    console.error(error);
    throw new Error('Gagal upload ke Supabase');
  }

  const { data } = supabase.storage.from('yearbook-photos').getPublicUrl(fileName);

  return data.publicUrl;
}

export function parseMediaSosial(formData: FormData) {
  type MediaSosial = { app: string; username: string };
  const media_sosial: MediaSosial[] = [];

  for (const [key, value] of formData.entries()) {
    const match = key.match(/media_sosial\[(\d+)]\[(\w+)]/);
    if (match) {
      const index = Number(match[1]);
      const field = match[2] as keyof MediaSosial;

      if (!media_sosial[index]) {
        media_sosial[index] = { app: '', username: '' };
      }

      if (typeof value === 'string') {
        media_sosial[index][field] = value;
      }
    }
  }

  return media_sosial;
}
