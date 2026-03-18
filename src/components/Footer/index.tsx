import Link from 'next/link';
import Image from 'next/image';
import styles from './styles.module.css';

import InstagramIcon from '../../assets/instagram.svg';
import BehanceLogo from '../../assets/behance-logo.svg';

import { getDuendeData } from '@/server/data/duende';

export default async function Footer() {
  const { data } = await getDuendeData();
  const instagramUrl = data.contact.instagram;
  const behanceUrl = data.contact.behance;
  const hasInstagram = Boolean(instagramUrl);
  const hasBehance = Boolean(behanceUrl);

  return (
    <footer className={styles.footer}>
      <div className={styles.border}></div>
      <div className={styles.container}>
        <div className={styles.rightWrapper}>
          <Link href="/">
            <Image
              src="/images/white-second-logo.png"
              alt="footer-logo"
              className={styles.logo}
              width={50}
              height={36}
              priority
            />
          </Link>
          <p className={styles.right}>
            ALL&nbsp;RIGHTS RESERVED&nbsp;/ DUENDE / {data.footer.since}
            &nbsp;&copy;
          </p>
        </div>
        <div className={styles.socialWrapper}>
          {(hasInstagram || hasBehance) && (
            <>
              {instagramUrl && (
                <Link href={instagramUrl} target="_blank">
                  <Image
                    src={InstagramIcon}
                    alt="instagram-logo"
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
                    alt="behance-logo"
                    className={styles.socialLink}
                    width={50}
                    height={50}
                    priority
                  />
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
