import { supabase } from "@/lib/supabase";
import { Property } from "@/types/property";
import PropertyExperience from "@/components/Experience/PropertyExperience";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function PropertyPage({ params }: Props) {
  const { locale, slug } = await params;

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .eq("activa", true)
    .single();

  if (error || !data) notFound();

  return <PropertyExperience property={data as Property} locale={locale} />;
}

export async function generateStaticParams() {
  const { data } = await supabase
    .from("properties")
    .select("slug")
    .eq("activa", true);

  return (data || []).map((p) => ({ slug: p.slug }));
}
