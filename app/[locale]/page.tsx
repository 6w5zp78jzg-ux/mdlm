import { supabase } from "@/lib/supabase";
import { Property } from "@/types/property";
import HomeExperience from "@/components/Home/HomeExperience";
import Navbar from "@/components/Experience/Navbar";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("activa", true)
    .eq("destacada", true)
    .order("created_at", { ascending: false });

  const properties = (data || []) as Property[];

  return (
    <>
      <Navbar />
      <HomeExperience properties={properties} locale={locale} />
    </>
  );
}
