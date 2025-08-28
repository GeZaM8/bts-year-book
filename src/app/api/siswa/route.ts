import { NextResponse } from 'next/server';
import { createSiswa, getAllSiswa, getSiswaByNamaTanggalLahir } from '@/../lib/siswa/siswa.service';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = (formData.get('name') as string).toLowerCase();
    const tanggal_lahir = formData.get('tanggal_lahir') as string;
    const existingSiswa = await getSiswaByNamaTanggalLahir(name, tanggal_lahir);
    if (existingSiswa) {
      return NextResponse.json({ message: `Data dengan nama "${name}" dan tanggal lahir "${tanggal_lahir}" sudah ada` }, { status: 409 });
    }

    const result = await createSiswa(formData);
    return NextResponse.json({ message: 'Data berhasil disimpan', data: result, type: 'success' }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Gagal simpan data' }, { status: 500 });
  }
}

export async function GET() {
  const siswa = await getAllSiswa();
  return NextResponse.json(siswa);
}
