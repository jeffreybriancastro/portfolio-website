/**
 * Jeffrey Brian Castro - identity.
 *
 * Everything that says who he is lives here: name, handle, photo, socials,
 * email and the Home headline. Page copy lives in the other files in
 * src/data/ and at the top of each view component.
 *
 * The numbers in `stats` are real and come from the GoHighLevel build shown
 * on Projects: 359 is the opportunity count on the live board, six is the
 * number of published workflows moving it. If the board moves, move these.
 */

export type SocialLink = {
  label: string
  href: string
  iconPath: string
}

export type Stat = { value: string; label: string }

export type Profile = {
  name: string
  /** First name, used in "Hi, I'm ___." on About. */
  firstName: string
  handle: string
  /** Short role line under the handle on phones. */
  role: string
  /** Square image. */
  avatarSrc: string
  email: string
  location: string
  /** Three short proof facts shown on phones under the Home lede. */
  stats: Stat[]
  displayName: { line1: string; line2: string }
  hero: {
    body: string
    portraitSrc: string
    portraitAlt: string
  }
  socials: SocialLink[]
}

export const profile: Profile = {
  name: 'Jeffrey Brian Castro',
  firstName: 'Jeffrey',
  handle: '@jeffreybrianbuilds',
  role: 'GoHighLevel · CRM · Automation · Funnels',
  avatarSrc: '/img/jeffrey-avatar.webp',
  email: 'jeffreybriancastro@gmail.com',
  location: 'Cagayan de Oro, Philippines',
  stats: [
    { value: '359', label: 'Opportunities tracked' },
    { value: '6', label: 'Workflows running' },
    { value: 'GMT+8', label: 'Cagayan de Oro' },
  ],
  // The intro types this line, then flies it into the Home headline.
  displayName: {
    line1: 'Everything that runs your business.',
    line2: 'Built by one person.',
  },
  hero: {
    body: 'GoHighLevel CRM, the automations that run it, and the funnels and websites that feed it, built on the stack you already have.',
    portraitSrc: '/img/jeffrey-portrait.webp',
    portraitAlt:
      'Jeffrey Brian Castro on a rooftop at night, the city skyline lit behind him.',
  },
  socials: [
    {
      label: 'LinkedIn profile',
      href: 'https://www.linkedin.com/in/jeffreybriancastro/',
      iconPath: '/icons/linkedin.svg',
    },
  ],
}
