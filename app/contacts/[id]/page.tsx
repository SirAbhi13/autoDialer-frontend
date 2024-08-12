'use client';

import { useParams } from 'next/navigation';
import SpecificContact from '../../components/SpecificContact';

export default function ContactPage() {
  const params = useParams();
  const id = params.id as string;

  return <SpecificContact id={id} />;
}