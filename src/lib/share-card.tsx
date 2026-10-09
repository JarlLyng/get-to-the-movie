import { ImageResponse } from 'next/og';
import type { Persona, PersonaStats } from '@/types/persona';

export const SHARE_CARD_SIZE = { width: 1200, height: 630 };

const RED = '#FF2A2A';
const BG = '#050505';

const STAT_LABELS: Array<{ key: keyof PersonaStats; label: string }> = [
  { key: 'brains', label: 'BRAINS' },
  { key: 'boom', label: 'BOOM' },
  { key: 'heart', label: 'HEART' },
  { key: 'camp', label: 'CAMP' },
  { key: 'oneLiners', label: 'ONE-LINERS' },
];

type FontEntry = { name: string; data: ArrayBuffer; weight: 700 | 900; style: 'normal' };

/**
 * Satori needs TTF/OTF data, not woff2. Google Fonts serves TTF when the
 * request has no browser user agent, which is the case for server fetch.
 */
async function loadGoogleFont(family: string, weight: 700 | 900): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`;
  const css = await (await fetch(cssUrl)).text();
  const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!match) throw new Error(`No TTF source found for ${family} ${weight}`);
  const res = await fetch(match[1]);
  if (!res.ok) throw new Error(`Font download failed: ${res.status}`);
  return res.arrayBuffer();
}

async function loadFonts(): Promise<FontEntry[]> {
  try {
    const [bold, black] = await Promise.all([
      loadGoogleFont('Outfit', 700),
      loadGoogleFont('Outfit', 900),
    ]);
    return [
      { name: 'Outfit', data: bold, weight: 700, style: 'normal' },
      { name: 'Outfit', data: black, weight: 900, style: 'normal' },
    ];
  } catch {
    // Fall back to the font bundled with next/og rather than failing the build.
    return [];
  }
}

/** Shrink long persona names so they stay on two lines at most. */
function nameFontSize(name: string): number {
  if (name.length > 20) return 64;
  if (name.length > 16) return 76;
  return 88;
}

export async function renderShareCard(persona: Persona): Promise<ImageResponse> {
  const fonts = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: BG,
          backgroundImage: `radial-gradient(ellipse at 30% 0%, rgba(255,42,42,0.35) 0%, rgba(5,5,5,0) 60%)`,
          padding: '48px 64px',
          fontFamily: fonts.length > 0 ? 'Outfit' : undefined,
          color: 'white',
          position: 'relative',
        }}
      >
        {/* HUD frame corners */}
        <div style={{ position: 'absolute', top: 20, left: 20, width: 48, height: 48, borderTop: `4px solid ${RED}`, borderLeft: `4px solid ${RED}` }} />
        <div style={{ position: 'absolute', top: 20, right: 20, width: 48, height: 48, borderTop: `4px solid ${RED}`, borderRight: `4px solid ${RED}` }} />
        <div style={{ position: 'absolute', bottom: 20, left: 20, width: 48, height: 48, borderBottom: `4px solid ${RED}`, borderLeft: `4px solid ${RED}` }} />
        <div style={{ position: 'absolute', bottom: 20, right: 20, width: 48, height: 48, borderBottom: `4px solid ${RED}`, borderRight: `4px solid ${RED}` }} />

        {/* Top HUD bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 4,
            color: RED,
          }}
        >
          <span>{'// ARNOLD.AI IDENTITY REVEAL'}</span>
          <span>GET TO THE MOVIE!</span>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flex: 1, marginTop: 36, gap: 56 }}>
          {/* Left: identity */}
          <div style={{ display: 'flex', flexDirection: 'column', width: 620 }}>
            <div style={{ display: 'flex', fontSize: 26, fontWeight: 700, letterSpacing: 6, color: 'rgba(255,255,255,0.6)' }}>
              I AM
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: nameFontSize(persona.name),
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: -2,
                textTransform: 'uppercase',
                marginTop: 8,
                textShadow: `0 0 24px rgba(255,42,42,0.55)`,
              }}
            >
              {persona.name}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: 4,
                color: RED,
                textTransform: 'uppercase',
                marginTop: 18,
              }}
            >
              {persona.tagline}
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 'auto',
                padding: '18px 24px',
                borderLeft: `5px solid ${RED}`,
                backgroundImage: 'linear-gradient(90deg, rgba(255,42,42,0.18), rgba(255,42,42,0))',
                fontSize: 34,
                fontWeight: 700,
              }}
            >
              {`“${persona.catchphrase}”`}
            </div>
          </div>

          {/* Right: HUD stat panel */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              padding: '28px 32px',
              border: '2px solid rgba(255,255,255,0.12)',
              borderRadius: 20,
              backgroundColor: 'rgba(20,20,20,0.7)',
              gap: 20,
            }}
          >
            <div style={{ display: 'flex', fontSize: 18, fontWeight: 700, letterSpacing: 4, color: RED }}>
              SUBJECT ATTRIBUTES
            </div>
            {STAT_LABELS.map(({ key, label }) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700, letterSpacing: 3 }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</span>
                  <span style={{ color: RED }}>{persona.stats[key]}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: 'rgba(255,255,255,0.08)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      width: `${persona.stats[key]}%`,
                      height: '100%',
                      borderRadius: 6,
                      backgroundImage: `linear-gradient(90deg, rgba(255,42,42,0.55), ${RED})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 32,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 3,
          }}
        >
          <span style={{ color: 'white' }}>WHICH ARNOLD ARE YOU?</span>
          <span style={{ color: RED }}>GETTOTHEMOVIE.IAMJARL.COM</span>
        </div>
      </div>
    ),
    { ...SHARE_CARD_SIZE, fonts }
  );
}
