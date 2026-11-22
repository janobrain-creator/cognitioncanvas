// Sends a push notification (ntfy.sh) when the public site is opened.
// Open the site once with ?r=me on a device to stop notifications from it.
const NTFY_TOPIC = 'alexbrain-cv-83540b38';
const PUBLIC_HOST = 'janobrain-creator.github.io';

function deviceLabel(ua) {
  const device = /iPhone/.test(ua) ? 'iPhone'
    : /iPad/.test(ua) ? 'iPad'
    : /Android/.test(ua) ? (/Mobile/.test(ua) ? 'Android phone' : 'Android tablet')
    : /Mac OS X/.test(ua) ? 'Mac'
    : /Windows/.test(ua) ? 'Windows'
    : /Linux/.test(ua) ? 'Linux' : 'Unknown device';
  const browser = /Edg\//.test(ua) ? 'Edge'
    : /LinkedInApp/.test(ua) ? 'LinkedIn app'
    : /CriOS|Chrome\//.test(ua) ? 'Chrome'
    : /FxiOS|Firefox\//.test(ua) ? 'Firefox'
    : /Safari\//.test(ua) ? 'Safari' : 'Other browser';
  return `${device} · ${browser}`;
}

async function lookupLocation() {
  try {
    const res = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(4000) });
    const d = await res.json();
    if (!d.success) return null;
    return {
      where: [d.city, d.region, d.country].filter(Boolean).join(', '),
      network: d.connection?.org || d.connection?.isp,
    };
  } catch {
    return null;
  }
}

async function notifyVisit() {
  if (location.hostname !== PUBLIC_HOST) return;
  const tag = (new URLSearchParams(location.search).get('r') || '').replace(/[^\w-]/g, '').slice(0, 40);
  if (tag === 'me') localStorage.setItem('cvNoTrack', '1');
  if (localStorage.getItem('cvNoTrack')) return;
  if (sessionStorage.getItem('cvVisitSent')) return;
  const ua = navigator.userAgent;
  if (navigator.webdriver || /bot|crawl|spider|preview|headless/i.test(ua)) return;
  sessionStorage.setItem('cvVisitSent', '1');

  const loc = await lookupLocation();
  let from = 'Direct / unknown';
  try {
    if (document.referrer) from = new URL(document.referrer).hostname;
  } catch {}
  const lines = [
    `Link: ${tag || 'untagged'}`,
    `Where: ${loc?.where || 'unknown (lookup blocked)'}`,
    `Network: ${loc?.network || 'unknown'}`,
    `Device: ${deviceLabel(ua)}`,
    `From: ${from}`,
  ];
  fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
    method: 'POST',
    body: lines.join('\n'),
    headers: { Title: `CV site opened${tag ? ` (${tag})` : ''}`, Tags: 'eyes' },
    keepalive: true,
  }).catch(() => {});
}

notifyVisit();
