import { fetchGlobal } from "../payload";

interface SeoSettings {
  siteName: string;
  titleTemplate: string;
  defaultDescription: string;
  defaultOgImage?: {
    url: string;
    alt?: string;
  };
}

interface ResolvedSeo {
  title: string;
  description: string;
  ogImage: string;
  siteName: string;
  titleTemplate: string;
}

interface PageSeoOverride {
  title?: string;
  description?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export async function resolveSeo(
  override: PageSeoOverride = {},
): Promise<ResolvedSeo> {
  const cms = await fetchGlobal<SeoSettings>("seo-settings");

  return {
    siteName: cms?.siteName ?? "",
    titleTemplate: cms?.titleTemplate ?? "%s",
    description: override.description ?? cms?.defaultDescription ?? "",
    ogImage: override.ogImage ?? cms?.defaultOgImage?.url ?? "",
    title: override.title ?? "",
  };
}
