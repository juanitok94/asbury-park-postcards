import { ImageResponse } from 'next/og'
import shopsData from '@/data/shops.json'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const shops = shopsData as any[]
  const shop = shops.find(s => s.id === slug)
  return [
    {
      id: 'og',
      alt: shop ? `Postmark ${shop.passportStop ?? ''} - ${shop.name}` : 'Asbury Park Postmarks',
    },
  ]
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const shops = shopsData as any[]
  const shop = shops.find(s => s.id === slug)

  const stopNumber = shop?.passportStop ?? ''
  const stopName = shop?.name ?? 'Asbury Park Postmarks'
  const stopAddress = shop?.address ?? ''
  const stopZone = shop?.zone ?? ''
  const selloColor = shop?.selloColor ?? '#E8543F'
  const headline = shop?.story?.headline ?? ''

  const zoneLabel: Record<string, string> = {
    downtown: 'PLACEHOLDER_DOWNTOWN_LABEL',
    boardwalk: 'Boardwalk',
    'springwood-west-side': 'Springwood / West Side',
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#10222F',
          padding: '0',
        }}
      >
        <div style={{ height: '6px', backgroundColor: '#E8543F', display: 'flex' }} />

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            padding: '60px 72px',
            gap: '60px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              backgroundColor: selloColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: '72px',
                fontWeight: 900,
                color: '#ffffff',
                fontFamily: 'monospace',
              }}
            >
              {stopNumber}
            </span>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '18px',
                letterSpacing: '0.25em',
                color: '#E8543F',
                textTransform: 'uppercase',
                marginBottom: '16px',
                opacity: 0.8,
                display: 'flex',
              }}
            >
              {zoneLabel[stopZone] ?? stopZone} · Postmark {stopNumber || 'PLACEHOLDER'}
            </div>

            <div
              style={{
                fontSize: stopName.length > 20 ? '56px' : '72px',
                fontWeight: 900,
                color: '#F4EBDA',
                lineHeight: 1.05,
                marginBottom: '20px',
                display: 'flex',
              }}
            >
              {stopName}
            </div>

            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '22px',
                color: '#4FA89B',
                opacity: 0.8,
                marginBottom: '20px',
                display: 'flex',
              }}
            >
              {stopAddress}
            </div>

            {headline ? (
              <div
                style={{
                  fontFamily: 'serif',
                  fontSize: '26px',
                  fontStyle: 'italic',
                  color: '#F4EBDA',
                  opacity: 0.65,
                  display: 'flex',
                }}
              >
                {headline}
              </div>
            ) : null}
          </div>
        </div>

        <div
          style={{
            height: '72px',
            backgroundColor: '#0A1620',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '72px',
            paddingRight: '72px',
            borderTopWidth: '2px',
            borderTopStyle: 'solid',
            borderTopColor: '#E8543F',
          }}
        >
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '16px',
              color: '#E8543F',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              opacity: 0.8,
              display: 'flex',
            }}
          >
            Asbury Park Postmarks
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '14px',
              color: '#4FA89B',
              opacity: 0.7,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            PLACEHOLDER_OG_FOOTER
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
