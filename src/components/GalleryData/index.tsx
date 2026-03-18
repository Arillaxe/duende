import Gallery from '@/components/Gallery';
import { getDuendeData } from '@/server/data/duende';

export default async function GalleryData() {
  const { data } = await getDuendeData();
  return <Gallery photos={data.slides} />;
}
