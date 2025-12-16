import { Metadata } from "next";
import  PlanDetailClient  from "./plan-detail-client";


interface PageProps {
  params: Promise<{ slug: string}>
}

export async function generateMetadta({ params}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const title = slug.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')

  return {
    title: `title - Reading Plan | EOTC Bible`, 
    description: `Explore the ${title} reading plan. A curated spritual journey through the Ethiopian Orthodox Tewahedo Church scriptures.`
  }
}

export default async function PlanDetailPage({
  params
}: PageProps) {
  const { slug } = await params
  return <PlanDetailClient slug={slug}/>
}