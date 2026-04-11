import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { COMPANIES, getCompanyById } from '@/data/companies';
import CompanyDetailClient from './CompanyDetailClient';

export const revalidate = 86400;

export async function generateStaticParams() {
  return COMPANIES.map(c => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const company = getCompanyById(id);
  if (!company) return { title: 'Company Not Found — TrueRate' };
  return {
    title: `${company.name} — TrueRate Business Directory`,
    description: company.description.slice(0, 160),
  };
}

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = getCompanyById(id);
  if (!company) notFound();
  return <CompanyDetailClient company={company} />;
}
