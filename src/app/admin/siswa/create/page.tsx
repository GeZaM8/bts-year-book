"use client";

import { useState, useCallback } from "react";
import { SiswaType, MediaSosialType } from "@/types";
import { 
  User, Calendar, MessageCircle, Heart, Book, Camera,
  Plus, Trash2, ArrowUpCircle, AlertCircle, Link,
  CheckCircle, XCircle, Loader
} from '@deemlol/next-icons';
import Image from "next/image";

export default function SiswaCreate() {
  const [notif, setNotif] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });
  const [preview, setPreview] = useState<string | null>(null);
  const [fileFoto, setFileFoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const [formData, setFormData] = useState<Omit<SiswaType, "foto">>({
    id: "",
    name: "",
    tanggal_lahir: "",
    media_sosial: [],
    hobi: "",
    quotes: ""
  });

  const resetForm = useCallback(() => {
    setFormData({ id: "", name: "", tanggal_lahir: "", media_sosial: [], hobi: "", quotes: "" });
    setFileFoto(null);
    setPreview(null);
    setSubmitStatus('idle');
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileFoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleInputChange = useCallback((field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleMediaSosialChange = useCallback((index: number, field: keyof MediaSosialType, value: string) => {
    setFormData(prev => {
      const newMedia = [...prev.media_sosial];
      newMedia[index][field] = value;
      return { ...prev, media_sosial: newMedia };
    });
  }, []);

  const addMediaSosial = useCallback(() => {
    setFormData(prev => {
      if (prev.media_sosial.length >= 5) return prev;
      return {
        ...prev,
        media_sosial: [...prev.media_sosial, { id: Date.now().toString(), app: "", username: "" }]
      };
    });
  }, []);

  const removeMediaSosial = useCallback((index: number) => {
    setFormData(prev => {
      const newMedia = [...prev.media_sosial];
      newMedia.splice(index, 1);
      return { ...prev, media_sosial: newMedia };
    });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fileFoto) {
      setNotif({ type: "error", message: "Harap pilih foto terlebih dahulu!" });
      setTimeout(() => setNotif({ message: "", type: null }), 3000);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    const data = new FormData();
    data.append("name", formData.name);
    data.append("tanggal_lahir", formData.tanggal_lahir);
    data.append("hobi", formData.hobi);
    data.append("quotes", formData.quotes);
    data.append("foto", fileFoto);

    formData.media_sosial.forEach((m, i) => {
      data.append(`media_sosial[${i}][app]`, m.app);
      data.append(`media_sosial[${i}][username]`, m.username);
    });

    try {
      const res = await fetch("/api/siswa", { method: "POST", body: data });

      let result: any;
      try {
        result = await res.clone().json();
      } catch {
        const text = await res.text();
        if (res.status === 413 || text.includes("Request Entity Too Large")) {
          throw new Error("Ukuran file terlalu besar. Maksimal 3MB");
        }
        throw new Error(text || "Server tidak merespons dengan JSON");
      }

      if (!res.ok) {
        throw new Error(result?.message || result?.error || "Gagal simpan data");
      }
      
      setSubmitStatus('success');
      setNotif({ message: "Data berhasil disimpan!", type: "success" });
      resetForm();
    } catch (err) {
      setSubmitStatus('error');
      setNotif({ message: err instanceof Error ? err.message : "Terjadi kesalahan", type: "error" });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setNotif({ message: "", type: null });
        setSubmitStatus('idle');
      }, 3000);
    }
  }, [formData, fileFoto, resetForm]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/image1.jpg')"
        }}
      ></div>

      <div className="fixed min-h-screen w-full inset-0 bg-black/40"></div>
      
      <div className="flex items-center justify-center min-h-screen py-12 px-2 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-2xl mx-auto bg-white rounded-xl overflow-hidden">
          <div className="bg-blue-600 p-5 text-white text-center">
            <div className="flex items-center justify-center gap-2">
              <Book className="w-6 h-6 text-blue-100" />
              <h1 className="text-xl font-semibold">Form Data Siswa</h1>
            </div>
            <p className="text-sm text-blue-100 mt-1">Isi data diri dengan lengkap</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {notif.type && (
              <div
                className={`fixed top-8 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-md text-white transition-all duration-500 ${
                  notif.type === "success" ? "bg-green-500" : "bg-red-500"
                } ${notif.type ? "opacity-100" : "opacity-0"}`}
              >
                {notif.message}
              </div>
            )}

            {/* Upload Foto */}
            <div className="flex flex-col items-center">
              <input type="file" id="foto" className="hidden" accept="image/*" onChange={handleFileChange} required/>
              <label htmlFor="foto" className="w-28 h-28 border border-gray-300 rounded-full flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-400">
                {preview ? (
                  <Image 
                    src={preview}
                    alt="preview"
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-gray-400"/>
                )}
              </label>
              <span className="text-xs text-gray-500 mt-2">Upload Foto Formal <span className="text-red-500">*</span></span>
            </div>

            {/* Nama */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 text-blue-500" /> Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input type="text" value={formData.name} onChange={(e)=>handleInputChange("name",e.target.value)} required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-300" placeholder="Nama Lengkap"/>
            </div>

            {/* Tanggal Lahir */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 text-blue-500"/> Tanggal Lahir <span className="text-red-500">*</span>
              </label>
              <input type="date" value={formData.tanggal_lahir}
                onChange={(e)=>handleInputChange("tanggal_lahir", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800" required/>
            </div>

            {/* Media Sosial */}
            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Link className="w-4 h-4 text-blue-500"/> Media Sosial
                </span>
                <button type="button" onClick={addMediaSosial}
                  disabled={formData.media_sosial.length>=5}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md ${formData.media_sosial.length>=5?'bg-gray-200 text-gray-400':'bg-blue-500 text-white hover:bg-blue-600'}`}>
                  <Plus className="w-3 h-3"/> Tambah
                </button>
              </div>

              {formData.media_sosial.length===0 && (
                <p className="text-center text-xs text-gray-400 italic">Belum ada media sosial</p>
              )}

              {formData.media_sosial.map((m,i)=>(
                <div key={m.id} className="flex gap-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Link className="w-4 h-4 text-blue-500"/> {i+1}
                  </label>
                  <div className="flex-1">
                    <input type="text" placeholder="Aplikasi" value={m.app}
                      onChange={(e)=>handleMediaSosialChange(i,'app',e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 text-gray-800 placeholder-gray-300 rounded-md focus:ring-blue-500"/>
                  </div>
                  <div className="flex-1">
                    <input type="text" placeholder="Username" value={m.username}
                      onChange={(e)=>handleMediaSosialChange(i,'username',e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 text-gray-800 placeholder-gray-300 rounded-md focus:ring-blue-500"/>
                  </div>
                  <button type="button" onClick={()=>removeMediaSosial(i)}
                    className="text-red-500 hover:text-red-600">
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </div>
              ))}
              {formData.media_sosial.length>=5 && (
                <p className="text-xs text-gray-400 italic">Mau tambah? Jangan maruk, maksimal 5 media sosial ya!</p>
              )}
            </div>

            {/* Hobi */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Heart className="w-4 h-4 text-blue-500"/> Hobi <span className="text-red-500">*</span>
              </label>
              <input type="text" value={formData.hobi} onChange={(e)=>handleInputChange("hobi",e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-gray-800 placeholder-gray-300 rounded-md focus:ring-blue-500" required
                placeholder="Contoh: Membaca buku sambil terbang"/>
            </div>

            {/* Quotes Favorit */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <MessageCircle className="w-4 h-4 text-blue-500"/> Quotes Favorit <span className="text-red-500">*</span>
              </label>
              <textarea value={formData.quotes} onChange={(e)=>handleInputChange("quotes",e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 text-gray-800 placeholder-gray-300" required
                placeholder="Contoh: Tetap menyerah, jangan semangat - Sapiderman"/>
            </div>

            {/* Peringatan */}
            <div className="flex items-center gap-2 text-sm text-red-500">
              <AlertCircle className="w-4 h-4"/> Hayo, jangan asal nulis ya! Data yang udah tersimpan susah diubah, jadi pastikan kamu tetiti dan isi data yang benar!
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-2 rounded-md flex items-center justify-center gap-2 transition-all duration-300 ${
                isSubmitting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : submitStatus === 'success' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : submitStatus === 'error' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : submitStatus === 'success' ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Berhasil Disimpan!</span>
                </>
              ) : submitStatus === 'error' ? (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>Gagal Disimpan</span>
                </>
              ) : (
                <>
                  <ArrowUpCircle className="w-4 h-4" />
                  <span>Simpan Data</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}