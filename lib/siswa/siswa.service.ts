import prisma from '@/../lib/prisma';
import { saveFoto, parseMediaSosial } from './siswa.helper';

export async function createSiswa(formData: FormData) {
  const name = (formData.get('name') as string).toLowerCase();
  const tanggal_lahir = formData.get('tanggal_lahir') as string;
  const hobi = formData.get('hobi') as string;
  const quotes = formData.get('quotes') as string;
  const foto = formData.get('foto') as File | null;

  if (!name || !tanggal_lahir) {
    throw new Error('Nama dan tanggal lahir harus diisi');
  }

  const media_sosial = parseMediaSosial(formData);
  const filePath = foto ? await saveFoto(foto, name, tanggal_lahir) : null;

  return prisma.siswa.create({
    data: {
      name,
      tanggal_lahir,
      hobi,
      quotes,
      foto: `${filePath}`,
      mediaSosial: { create: media_sosial },
    },
    include: { mediaSosial: true },
  });
}

export async function getAllSiswa() {
  return prisma.siswa.findMany({ include: { mediaSosial: true } });
}

export async function getSiswaByNamaTanggalLahir(name: string, tanggal_lahir: string) {
  return prisma.siswa.findFirst({ where: { name, tanggal_lahir }});
}