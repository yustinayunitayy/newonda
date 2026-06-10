import { getOne } from "../payload";

export interface SiteSettings {
  title: string;
  logo?: {
    url: string;
    alt?: string;
  };
  headOffice: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone?: string;
    csPhone?: string;
    email?: string;
  };
  socialMedia: {
    platform: string;
    icon: string;
    link: string;
  }[];
  onlineShop: {
    platform: string;
    icon: string;
    link: string;
  }[];
  copyright?: string;
}

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  return getOne("site-settings", { title: { equals: "Site Settings" } }, 1);
}
