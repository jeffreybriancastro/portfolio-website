/**
 * The GoHighLevel build: six published workflows and the pipeline they move
 * records through.
 *
 * Every screenshot here is from Jeffrey's own account. The stage names, the
 * workflow numbers (001-006) and the 359 opportunity count are what the board
 * actually says - they are not illustrative. Contact names are blurred in the
 * pipeline shot; the workflow screens carry no personal data.
 */

export type Shot = {
  id: string
  /** Small image for the marquee frame. */
  thumb: string
  /** Full-size screenshot for the dialog. */
  full: string
  label: string
  /** Workflow number in the build, where it has one. */
  num?: string
  /** Describes the screenshot for anyone who cannot see it. */
  alt: string
}

/** The seven workflow screens, in the order the build runs. */
export const workflowShots: Shot[] = [
  {
    id: 'wf-00-list',
    thumb: '/img/wf-00-list-thumb.webp',
    full: '/img/wf-00-list.webp',
    label: 'All six, in GoHighLevel',
    alt: 'The GoHighLevel workflows list: six workflows, 001 New Enquiry Intake through 006 Closed Lost, every one published.',
  },
  {
    id: 'wf-01-enquiry',
    thumb: '/img/wf-01-enquiry-thumb.webp',
    full: '/img/wf-01-enquiry.webp',
    label: 'New enquiry intake',
    num: '001',
    alt: 'The 001 workflow: a Messenger reply or form submission tags the contact, finds or creates the opportunity, assigns an owner, then checks an hour later whether a booking happened.',
  },
  {
    id: 'wf-02-booked',
    thumb: '/img/wf-02-booked-thumb.webp',
    full: '/img/wf-02-booked.webp',
    label: 'Appointment booked',
    num: '002',
    alt: 'The 002 workflow: a booking fires a confirmation email, then a reminder, then a final reminder.',
  },
  {
    id: 'wf-03-attended',
    thumb: '/img/wf-03-attended-thumb.webp',
    full: '/img/wf-03-attended.webp',
    label: 'Attended',
    num: '003',
    alt: 'The 003 workflow: an attended appointment notifies the team, sends a thank-you, and moves the deal to Closed / Repeat.',
  },
  {
    id: 'wf-04-noshow',
    thumb: '/img/wf-04-noshow-thumb.webp',
    full: '/img/wf-04-noshow.webp',
    label: 'No show',
    num: '004',
    alt: 'The 004 workflow: a no-show email, then two rebooking checks, then the deal moves to Closed Lost.',
  },
  {
    id: 'wf-05-repeat',
    thumb: '/img/wf-05-repeat-thumb.webp',
    full: '/img/wf-05-repeat.webp',
    label: 'Closed / repeat',
    num: '005',
    alt: 'The 005 workflow: the contact is tagged a repeat client and gets a promo email seven days later.',
  },
  {
    id: 'wf-06-lost',
    thumb: '/img/wf-06-lost-thumb.webp',
    full: '/img/wf-06-lost.webp',
    label: 'Closed lost',
    num: '006',
    alt: 'The 006 workflow: the no-show tag is removed and three re-engagement emails go out over two months.',
  },
]

/** The pipeline board itself. */
export const pipelineShot: Shot = {
  id: 'crm-pipeline',
  thumb: '/img/crm-pipeline-thumb.webp',
  full: '/img/crm-pipeline.webp',
  label: 'The live board, names blurred',
  alt: 'The GoHighLevel opportunities board for the booking pipeline: six stages from 001 New Inquiry to 006 Closed Lost, 359 opportunities in total, every card a real record with the contact name blurred.',
}

/** What each workflow does, in plain words. */
export type BuildStep = { num: string; name: string; desc: string }

export const buildSteps: BuildStep[] = [
  {
    num: '001',
    name: 'New enquiry intake',
    desc: 'A Messenger reply or a form submission tags the contact, finds or creates the opportunity, assigns an owner and notifies the team. An hour later it checks whether a booking happened and flags the ones that did not.',
  },
  {
    num: '002',
    name: 'Appointment booked',
    desc: 'Confirmation email the moment the slot is taken, a reminder an hour later, and a final one after that.',
  },
  {
    num: '003',
    name: 'Attended',
    desc: 'The team gets the notification, the client gets a thank-you, and the deal moves itself to Closed / Repeat.',
  },
  {
    num: '004',
    name: 'No show',
    desc: 'A no-show email goes out, then the workflow checks for a rebooking after an hour and again two days later. Two days after that with still no booking, a last email goes out and the deal moves to Closed Lost.',
  },
  {
    num: '005',
    name: 'Closed / repeat',
    desc: 'Tagged as a repeat client, then a promo email seven days later.',
  },
  {
    num: '006',
    name: 'Closed lost',
    desc: 'The no-show tag comes off and three re-engagement emails go out at two weeks, then twenty days later, then thirty after that.',
  },
]

/** The six stages a record passes through on the board. */
export const pipelineStages = [
  '001 New Inquiry',
  '002 Appointment Booked',
  '003 Attended',
  '004 No Show',
  '005 Closed / Repeat Client',
  '006 Closed Lost',
] as const
