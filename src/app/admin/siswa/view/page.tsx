import Image from "next/image";
import { getAllSiswa } from '@/../lib/siswa/siswa.service';

export default async function ViewSiswa() {
  const siswa = await getAllSiswa();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-2">View Siswa</h1>
        <p className="text-blue-600 mb-6">Ini halaman view siswa</p>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-blue-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Nama</th>
                <th className="px-4 py-3 text-left">Tanggal Lahir</th>
                <th className="px-4 py-3 text-left">Media Sosial</th>
                <th className="px-4 py-3 text-left">Hobi</th>
                <th className="px-4 py-3 text-left">Quotes</th>
                <th className="px-4 py-3 text-left">Foto</th>
              </tr>
            </thead>
            <tbody>
              {siswa.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-blue-700 font-medium">
                    Tidak ada data
                  </td>
                </tr>
              )}
              {siswa.map((s, idx) => (
                <tr
                  key={s.id}
                  className={`border-b border-blue-100 hover:bg-blue-100 transition ${
                    idx % 2 === 0 ? 'bg-blue-50' : 'bg-white'
                  }`}
                >
                  <td className="px-4 py-2">{s.id}</td>
                  <td className="px-4 py-2 font-semibold text-blue-700">{s.name}</td>
                  <td className="px-4 py-2 text-black">{s.tanggal_lahir}</td>
                  <td className="px-4 py-2">
                    <ul className="list-disc list-inside space-y-1 text-blue-600">
                      {s.mediaSosial.map((ms) => (
                        <li key={ms.id}>
                          {ms.app}: {ms.username}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-2 text-black">{s.hobi}</td>
                  <td className="px-4 py-2 italic text-gray-700">{s.quotes}</td>
                  <td className="px-4 py-2">
                    <Image
                      src={`/uploads/${s.foto}`}
                      alt={s.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-full border-2 border-blue-300 shadow"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
