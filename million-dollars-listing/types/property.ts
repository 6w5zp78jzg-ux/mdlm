export interface Infografia {
  label: string;
  titulo: string;
  subtitulo: string;
  texto: string;
  posicion: "izquierda" | "derecha";
}

export interface Property {
  id: string;
  slug: string;
  titulo: { es: string; en: string; fr: string; ru: string };
  precio: number;
  habitaciones: number;
  banos: number;
  m2_construidos: number;
  m2_parcela: number;
  ubicacion: string;
  descripcion: { es: string; en: string; fr: string; ru: string };
  video_url: string;
  galeria_urls: string[];
  infografias: Infografia[];
  destacada: boolean;
  activa: boolean;
}
