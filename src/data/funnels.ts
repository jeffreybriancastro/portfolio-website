export type FunnelTag = 'Website' | 'Booking' | 'Funnel' | 'CRM'

export type Funnel = {
  /** Stable key. Also the basename of the screenshots in public/img/. */
  id: string
  label: string
  tag: FunnelTag
  desc: string
  /** Small image for the 3D barrel texture. */
  thumb: string
  /** Full-size screenshot shown in the preview dialog. */
  full: string
  /** Intrinsic size of `full`, so the dialog reserves the right box. */
  w: number
  h: number
  /** Live URL, when the build is public. Omitted when it is not. */
  href?: string
}

/**
 * Shipped work, as screenshots.
 *
 * The template shipped this as local HTML pages it could iframe. Jeffrey's
 * builds are either a client's live site or a screen inside someone's
 * GoHighLevel account, so neither can be served from this origin: the first
 * is not ours to re-host, the second is behind a login. Screenshots are the
 * honest form, and the preview dialog shows them full size the same way the
 * old site's lightbox did.
 *
 * Every description below is either observable in the screenshot or was given
 * by Jeffrey. Nothing here is inferred from a filename.
 */

const SUSHI = 'https://thesushiboxcdo.com/the-sushi-box-cdo'

export const sushiBox: Funnel[] = [
  {
    id: 'sushi-01-home',
    label: 'The Sushi Box CDO',
    tag: 'Website',
    desc: 'A maki shop in Cagayan de Oro. The homepage carries the menu bento, Book Now and Message to Order in the header, and the opening hours strip.',
    thumb: '/img/sushi-01-home-thumb.webp',
    full: '/img/sushi-01-home.webp',
    w: 1600,
    h: 835,
    href: SUSHI,
  },
  {
    id: 'sushi-02-reviews',
    label: 'Delivery-app reviews',
    tag: 'Website',
    desc: 'Their real Grab, Foodpanda and Facebook reviews pulled onto the page as a nine-card wall, each one carrying the customer name and the app it came from.',
    thumb: '/img/sushi-02-reviews-thumb.webp',
    full: '/img/sushi-02-reviews.webp',
    w: 1600,
    h: 833,
    href: SUSHI,
  },
  {
    id: 'sushi-03-catering',
    label: 'The Sushi Corner',
    tag: 'Website',
    desc: 'The catering section: sushi boat spreads laid out for weddings and parties, shot by the client and set as a gallery.',
    thumb: '/img/sushi-03-catering-thumb.webp',
    full: '/img/sushi-03-catering.webp',
    w: 1600,
    h: 770,
    href: SUSHI,
  },
  {
    id: 'sushi-04-booking',
    label: 'Pickup booking',
    tag: 'Booking',
    desc: 'A GoHighLevel calendar taking pickup bookings from inside the site. One-hour slots, Asia/Manila, no third-party booking tool in the middle.',
    thumb: '/img/sushi-04-booking-thumb.webp',
    full: '/img/sushi-04-booking.webp',
    w: 1600,
    h: 835,
    href: SUSHI,
  },
]

/**
 * TODO (Jeffrey): these three are yours, but the old site shipped them with
 * empty alt text and the clients anonymised, so there is no written record of
 * what each one was. Give me the client, the industry and what the build had
 * to do and these descriptions get replaced. Until then they say only what
 * the screenshot shows.
 */
export const clientSites: Funnel[] = [
  {
    id: 'work-teameasycrane',
    label: 'Team Easy Crane',
    tag: 'Funnel',
    desc: 'A funnel build shipped and handed over to the client.',
    thumb: '/img/work-teameasycrane.webp',
    full: '/img/work-teameasycrane.webp',
    w: 640,
    h: 360,
  },
  {
    id: 'work-findthepulse',
    label: 'Find The Pulse',
    tag: 'Website',
    desc: 'A website build shipped and handed over to the client.',
    thumb: '/img/work-findthepulse.webp',
    full: '/img/work-findthepulse.webp',
    w: 640,
    h: 360,
  },
  {
    id: 'work-easycrane',
    label: 'Easy Crane',
    tag: 'Website',
    desc: 'A website build shipped and handed over to the client.',
    thumb: '/img/work-easycrane.webp',
    full: '/img/work-easycrane.webp',
    w: 640,
    h: 360,
  },
]

/** Everything the barrel spins, newest and best-documented first. */
export const allWork: Funnel[] = [...sushiBox, ...clientSites]

/** Tag -> colour. Brand-external identifiers, passed to CSS as --tag-color. */
export const tagColors: Record<FunnelTag, string> = {
  Website: '#FF7A1A',
  Booking: '#ec4899',
  Funnel: '#8b5cf6',
  CRM: '#0EA5E9',
}
