'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

// Meta (Facebook) Pixel for @truerateliberia. ID is public by design (it ships
// in the client bundle), but reading from env lets us swap or disable it per
// environment without a code change. Falls back to the production pixel.
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '2093911624671196';

// Only load in production — keeps preview/localhost traffic out of Meta analytics.
const ENABLED = process.env.NODE_ENV === 'production' && !!PIXEL_ID;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function MetaPixel() {
  const pathname = usePathname();
  const onAdmin = pathname?.startsWith('/admin') ?? false;

  // The inline Script fires the first PageView. Track subsequent client-side
  // navigations too, but skip the initial render so it isn't double-counted.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (!ENABLED || onAdmin) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.fbq?.('track', 'PageView');
  }, [pathname, onAdmin]);

  // Never fire on the standalone /admin CMS.
  if (!ENABLED || onAdmin) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
