import type { WordId, words } from "./words.ts";

type CategoryShape = {
  readonly id: string;
  readonly label: string;
  readonly symbol: string;
  readonly words: readonly WordId[];
};

export const categories = [
  {
    id: "inti",
    label: "Inti",
    symbol: "1F4AC",
    words: ["aku", "kamu", "mau", "tidak", "ya", "lagi", "sudah", "suka", "ini", "makan", "minum", "main", "lihat", "pergi", "tidur"],
  },
  { id: "sapa", label: "Sapa", symbol: "1F44B", words: ["halo", "selamat_pagi", "selamat_malam", "tolong", "terima_kasih", "maaf", "ya", "tidak"] },
  {
    id: "kegiatan",
    label: "Kegiatan",
    symbol: "1F3C3",
    words: ["duduk", "berdiri", "mandi", "cuci_tangan", "buka", "tutup", "ambil", "kasih", "bantu", "tunggu", "berhenti", "selesai", "lari", "nyanyi", "peluk"],
  },
  { id: "tanya", label: "Tanya", symbol: "2753", words: ["apa", "siapa", "di_mana", "kapan", "kenapa", "berapa"] },
  { id: "orang", label: "Orang", symbol: "1F46A", words: ["aku", "kamu", "kita", "ibu", "ayah", "kakak", "adik", "bayi", "nenek", "kakek", "guru", "dokter", "teman"] },
  {
    id: "makan",
    label: "Makan",
    symbol: "1F374",
    words: ["makan", "nasi", "roti", "ayam", "telur", "mi", "sayur", "pisang", "apel", "jeruk", "semangka", "kue", "biskuit", "permen", "es_krim"],
  },
  { id: "minum", label: "Minum", symbol: "1F964", words: ["minum", "air", "susu", "jus", "teh"] },
  {
    id: "main",
    label: "Main",
    symbol: "26BD",
    words: ["main", "bola", "balon", "mobil", "sepeda", "boneka", "balok", "puzzle", "menggambar", "musik", "buku", "hp", "game", "video"],
  },
  {
    id: "perasaan",
    label: "Perasaan",
    symbol: "1F600",
    words: ["senang", "sedih", "marah", "takut", "kaget", "malu", "bingung", "bosan", "sayang", "sakit", "capek", "lapar", "haus", "ngantuk"],
  },
  { id: "warna", label: "Warna", symbol: "1F3A8", words: ["merah", "biru", "kuning", "hijau", "oranye", "ungu", "cokelat", "hitam", "putih"] },
  { id: "tubuh", label: "Tubuh", symbol: "1F4AA", words: ["sakit", "mata", "telinga", "hidung", "mulut", "gigi", "tangan", "kaki"] },
  {
    id: "hewan",
    label: "Hewan",
    symbol: "1F408",
    words: ["kucing", "anjing", "ikan", "burung", "bebek", "kelinci", "katak", "sapi", "kuda", "monyet", "gajah", "kupu_kupu"],
  },
  { id: "pakaian", label: "Pakaian", symbol: "1F455", words: ["baju", "celana", "jaket", "kaus_kaki", "sepatu", "topi", "kacamata", "tas"] },
  { id: "tempat", label: "Tempat", symbol: "1F3E0", words: ["pergi", "rumah", "sekolah", "kamar_mandi", "dapur", "taman", "pantai", "toko", "kolam_renang", "rumah_sakit"] },
] as const satisfies readonly CategoryShape[];

export type Category = (typeof categories)[number];
export type CategoryId = Category["id"];

export const MAX_WORDS_PER_BOARD = 15;

export type SymbolCode = (typeof words)[WordId]["symbol"] | (typeof categories)[number]["symbol"];
