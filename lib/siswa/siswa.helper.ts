import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

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

  return fileName;
}

export function parseMediaSosial(formData: FormData) {
  const media_sosial: { app: string; username: string }[] = [];
  for (const [key, value] of formData.entries()) {
    const match = key.match(/media_sosial\[(\d+)]\[(\w+)]/);
    if (match) {
      const index = Number(match[1]);
      const field = match[2];
      if (!media_sosial[index]) media_sosial[index] = { app: '', username: '' };
      (media_sosial[index] as any)[field] = value;
    }
  }
  return media_sosial;
}
