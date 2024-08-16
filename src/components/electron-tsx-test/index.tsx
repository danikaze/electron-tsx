import { FC } from 'react';
import { useTranslation } from '@/utils/i18n';

// import regular css
import '@/styles/reset-v2.css';

// import css modules
import styles from './styles.module.scss';

// different image types
import gif from '@/assets/test/images/image.gif';
import jpg from '@/assets/test/images/image.jpg';
import png from '@/assets/test/images/image.png';
import svg from '@/assets/test/images/image.svg';

// I wouldn't import the icon from here but, it's possible :)
import etsxIcon from 'config/icons/icon-512.png';

export const ElectronTsxTestApp: FC = () => {
  const { t } = useTranslation('etsx-test-app');
  const { versions } = window;
  const openGithub = () =>
    window.app.openExternal('https://github.com/danikaze/electron-tsx');

  return (
    <div className={styles.root}>
      <h1>
        <img src={etsxIcon} />
        Electron TSX
      </h1>

      <section>
        <p>{t('intro')}</p>
        <p>
          <a href="#" onClick={openGithub}>
            {t('openInGithub')}
          </a>
        </p>
      </section>

      <section>
        <h3>{t('versions')}</h3>
        <ul>
          <li>
            <b>Node.js</b>: <code>{versions.node}</code>
          </li>
          <li>
            <b>Chromium</b>: <code>{versions.chrome}</code>
          </li>
          <li>
            <b>Electron</b>: <code>{versions.electron}</code>
          </li>
        </ul>
      </section>

      <section>
        <h3>{t('supportedFonts')}</h3>
        <div className={styles.flex}>
          <p className={styles.woff}>.woff</p>
          <p className={styles.woff2}>.woff2</p>
          <p className={styles.ttf}>.ttf</p>
          <p className={styles.otf}>.otf</p>
          <p className={styles.eot}>.eot</p>
        </div>
      </section>

      <section>
        <h3>{t('supportedImages')}</h3>
        <div className={styles.flex}>
          <p>
            <img src={svg} />
          </p>
          <p>
            <img src={png} />
          </p>
          <p>
            <img src={gif} />
          </p>
          <p>
            <img src={jpg} />
          </p>
        </div>
      </section>
    </div>
  );
};
