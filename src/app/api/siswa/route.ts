import prisma from '@/../lib/prisma';
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const MAX_FILE_SIZE = 3 * 1024 * 1024;
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get('name') as string;
    const tanggal_lahir = formData.get('tanggal_lahir') as string;
    const hobi = formData.get('hobi') as string;
    const quotes = formData.get('quotes') as string;
    const foto = formData.get('foto') as File | null;

    if (!name || !tanggal_lahir) {
      return NextResponse.json({ error: 'Name dan tanggal_lahir wajib diisi' }, { status: 400 });
    }

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

    const filePath = foto ? await saveFoto(foto, name, tanggal_lahir) : null;

    const siswa = await prisma.siswa.create({
      data: {
        name,
        tanggal_lahir,
        hobi,
        quotes,
        foto: `uploads/${filePath}`,
        mediaSosial: {
          create: media_sosial,
        },
      },
      include: { mediaSosial: true },
    });

    return NextResponse.json({ message: 'Data berhasil disimpan', data: siswa }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Gagal simpan data' }, { status: 500 });
  }
}

export async function GET() {
  const siswa = await prisma.siswa.findMany({ include: { mediaSosial: true } });
  return NextResponse.json(siswa);
}

// Helper
async function saveFoto(foto: File, name: string, tanggal_lahir: string): Promise<string> {
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
