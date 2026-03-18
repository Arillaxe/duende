import GalleryData from '@/components/GalleryData';
import styles from './styles.module.css';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className={styles.galleryWrapper}>
      <GalleryData />
    </div>
  );
}
