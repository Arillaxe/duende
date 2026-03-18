import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import styles from './styles.module.css';

import InstagramIcon from '../../assets/instagram.svg';
import BehanceLogo from '../../assets/behance-logo.svg';

import { getDuendeData } from '@/server/data/duende';

export const metadata: Metadata = {
  title: 'Contact | Duende',
};

export const dynamic = 'force-dynamic';

export default async function Contact() {
  const { data } = await getDuendeData();
  const email = data.contact.email;
  const instagramUrl = data.contact.instagram;
  const behanceUrl = data.contact.behance;
  const hasEmail = Boolean(email);
  const hasInstagram = Boolean(instagramUrl);
  const hasBehance = Boolean(behanceUrl);

  return (
    <div className={styles.container}>
      {hasEmail || hasInstagram || hasBehance ? (
        <>
          {hasEmail && (
            <Link href={`mailto:${email}`}>
              <p className={styles.text}>{email}</p>
            </Link>
          )}

          <div className={styles.socialWrapper}>
            {instagramUrl && (
              <Link href={instagramUrl} target="_blank">
                <Image
                  src={InstagramIcon}
                  alt="instagram"
                  className={styles.socialLink}
                  width={50}
                  height={50}
                  priority
                />
              </Link>
            )}

            {behanceUrl && (
              <Link href={behanceUrl} target="_blank">
                <Image
                  src={BehanceLogo}
                  alt="behance"
                  className={styles.socialLink}
                  width={50}
                  height={50}
                  priority
                />
              </Link>
            )}
          </div>
        </>
      ) : (
        <p>нет данных</p>
      )}
    </div>
  );
}
