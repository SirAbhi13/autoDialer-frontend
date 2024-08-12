'use client';

import { useParams } from 'next/navigation';
import SpecificContactList from '../../components/SpecificContactList';

export default function ContactListPage() {
  const params = useParams();
  const id = params.id as string;

  return <SpecificContactList id={id} />;
}