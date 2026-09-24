import { NavLink } from 'react-router-dom'
import { House, FolderOpen, EnvelopeSimple, Stack, User } from '@/components/slab'

/**
 * The phone navigation: a bottom tab bar with Contact as the raised action
 * in the middle. Five slots for seven routes - Testimonials and Book a call
 * are reached from Home's explore row and from the pages that cite them.
 *
 * Only rendered below the shell breakpoint (App decides); from 1100px the
 * profile rail is the navigation.
 */
const TABS = [
  { label: 'Home', to: '/', Icon: House },
  { label: 'Work', to: '/projects', Icon: FolderOpen },
  { label: 'Contact', to: '/contact', Icon: EnvelopeSimple, primary: true },
  { label: 'Services', to: '/services', Icon: Stack },
  { label: 'About', to: '/about', Icon: User },
] as const

export default function TabBar() {
  return (
    <nav className="tabbar" aria-label="Primary navigation">
      {TABS.map(({ label, to, Icon, ...rest }) => {
        const primary = 'primary' in rest && rest.primary
        return (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={`tabbar__tab${primary ? ' tabbar__tab--primary' : ''}`}
            aria-label={primary ? label : undefined}
          >
            {primary ? (
              <span className="tabbar__fab">
                <Icon size={24} weight="bold" aria-hidden="true" />
              </span>
            ) : (
              <>
                <Icon size={21} weight="duotone" aria-hidden="true" />
                <span className="tabbar__label">{label}</span>
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
