import { Metadata } from 'next';
import Image from 'next/image';
import styles from './styles.module.css';
import { getDuendeData } from '@/server/data/duende';

export const metadata: Metadata = {
  title: 'About | Duende',
};

export const dynamic = 'force-dynamic';

export default async function About() {
  const result = await getDuendeData();
  const { data } = result;
  const firstImage = data.about.images[0];
  const secondImage = data.about.images[1];

  if (!result.ok && !data.about.title && data.about.description.length === 0) {
    return <div className={styles.container}>нет данных</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.headingWrapper}>
        <h2 className={styles.heading}>{data.about.title}</h2>
      </div>
      <div className={styles.photoWrapper1}>
        {firstImage && (
          <Image
            src={firstImage.src}
            width={300}
            height={300}
            quality={100}
            alt={firstImage.alt}
            className={styles.photo}
            priority
          />
        )}
      </div>
      <div className={styles.aboutWrapper}>
        {data.about.description.map((text, index) => (
          <p key={index} className={styles.text}>
            {text}
          </p>
        ))}
      </div>
      <div className={styles.photoWrapper2}>
        {secondImage && (
          <Image
            src={secondImage.src}
            width={300}
            height={300}
            quality={100}
            alt={secondImage.alt}
            className={styles.photo}
            priority
          />
        )}
      </div>
    </div>
  );
}
