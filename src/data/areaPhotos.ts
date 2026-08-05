export const AREA_PHOTOS = {
  Terrace: [
    "https://res.cloudinary.com/dbp8ozwty/image/upload/v1785913184/1785913125371_2976993659909696112_2976993659909696112_dc9f7e643d7aa8fca2ba8a1990f75bac_tzi6r4.jpg",
  ],
  Roma: [
    "https://res.cloudinary.com/dbp8ozwty/image/upload/v1785913197/1785913125358_2976993659909696112_2976993659909696112_16bb78ae933b37d2a8c62c0bdc79cc1b_r2p3vn.jpg",
    "https://res.cloudinary.com/dbp8ozwty/image/upload/v1785913191/1785913125374_2976993659909696112_2976993659909696112_893548295dbb0c822299d59d5b0569d8_uit7jx.jpg",
  ],
  Verona: [
    "https://res.cloudinary.com/dbp8ozwty/image/upload/v1785913149/1785913125363_2976993659909696112_2976993659909696112_2acf2992b81e92b34446f72cfa00e543_ujjjcp.jpg",
    "https://res.cloudinary.com/dbp8ozwty/image/upload/v1785913176/1785913125367_2976993659909696112_2976993659909696112_61906ec42eff345efd93a6f688cce447_tygl04.jpg",
  ],
  Sorrento: [
    "https://res.cloudinary.com/dbp8ozwty/image/upload/v1785913168/1785913125352_2976993659909696112_2976993659909696112_12b220b0bfb51f9efe29db6bdc2234ae_hkacaz.jpg",
    "https://res.cloudinary.com/dbp8ozwty/image/upload/v1785913163/1785913125336_2976993659909696112_2976993659909696112_c4c39213aa088ed11c0d60a76b9f2e2a_malft1.jpg",
  ],
} satisfies Record<"Terrace" | "Roma" | "Verona" | "Sorrento", string[]>;

export type AreaPhotoName = keyof typeof AREA_PHOTOS;
