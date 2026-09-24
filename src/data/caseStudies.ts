/**
 * The four service walkthroughs, carried over from the old static site's
 * work/*.html pages word for word.
 *
 * They are walkthroughs of how each build gets made, not accounts of a single
 * engagement - which is what the `frame` line on each one says out loud. That
 * honesty note travelled with the copy; do not drop it when client names
 * eventually go in.
 *
 * `sysmap` is real geometry: js/sysmap.js measured the node positions and drew
 * the edges between them, and SysMap.tsx does the same here. The columns and
 * rows below are the ones the original pages used.
 */
import {
  ArrowsClockwise,
  ArrowsSplit,
  BellRinging,
  Browser,
  CalendarCheck,
  ChartLineUp,
  ChatCircleDots,
  CheckCircle,
  Clock,
  EnvelopeSimple,
  FlowArrow,
  FunnelSimple,
  Lightning,
  ListChecks,
  PhoneCall,
  Table,
  UsersThree,
} from '@/components/slab'
import type { Icon } from '@/components/slab'

export type SysNode = {
  id: string
  name: string
  meta: string
  col: number
  row: number
  /** On the live path the route stroke walks. */
  live: boolean
  Icon: Icon
}

export type SysEdge = { from: string; to: string; feedback?: boolean }

export type CaseStudy = {
  slug: string
  /** Short name, used in the "other work" list and on the service cards. */
  short: string
  blurb: string
  title: string
  outcome: string
  frame: string
  facts: { label: string; value: string }[]
  sysmap: { cols: number; gap?: number; nodes: SysNode[]; edges: SysEdge[]; route: string[] }
  problem: string
  built: string[]
  wired: { name: string; desc: string }[]
  get: string[]
  tools: string[]
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "automation-workflow",
    short: "Automation workflows",
    blurb: "Triggered, validated, routed, retried",
    title: "How I build an automation workflow",
    outcome: "A job that used to be somebody’s morning now runs on a trigger, validates its own input, and reports when it fails.",
    frame: "A walkthrough of the build itself, not a single engagement. Client names and numbers go up here as clients sign off on them.",
    facts: [
      { label: "Service", value: "Automation workflow build" },
      { label: "What it covers", value: "Triggers, validation, routing, retries" },
      { label: "Runs on", value: "n8n" },
    ],
    sysmap: {
      cols: 3,
      nodes: [
        { id: "webhook", name: "Webhook", meta: "Called by the upstream system", col: 1, row: 1, live: true, Icon: FlowArrow },
        { id: "schedule", name: "Scheduled run", meta: "Fires on its own interval", col: 1, row: 2, live: false, Icon: Clock },
        { id: "ghlnew", name: "New GoHighLevel contact", meta: "Triggers on contact create", col: 1, row: 3, live: false, Icon: UsersThree },
        { id: "validate", name: "Validate and enrich", meta: "Bad input stops here, loudly", col: 2, row: 2, live: true, Icon: CheckCircle },
        { id: "retry", name: "Retry on failure", meta: "Backoff, then hand it to a human", col: 2, row: 4, live: false, Icon: ArrowsClockwise },
        { id: "router", name: "Route by condition", meta: "One branch per case", col: 3, row: 2, live: true, Icon: ArrowsSplit },
        { id: "ghl", name: "GoHighLevel", meta: "Contact, tag, or pipeline update", col: 3, row: 3, live: true, Icon: UsersThree },
        { id: "sheet", name: "Google Sheets", meta: "Appends the run’s row", col: 3, row: 4, live: false, Icon: Table },
        { id: "slack", name: "Slack alert", meta: "Only when a human is needed", col: 3, row: 5, live: false, Icon: ChatCircleDots },
      ],
      edges: [
        { from: "webhook", to: "validate" },
        { from: "schedule", to: "validate" },
        { from: "ghlnew", to: "validate" },
        { from: "validate", to: "router" },
        { from: "router", to: "ghl" },
        { from: "router", to: "sheet" },
        { from: "router", to: "slack" },
        { from: "router", to: "retry" },
        { from: "retry", to: "validate", feedback: true },
      ],
      route: ["webhook", "validate", "router", "ghl"],
    },
    problem: "Someone opens a laptop every morning and moves the same data between the same three tools. It takes an hour, it gets skipped whenever they are away, and when it goes wrong nobody finds out until a customer does.",
    built: [
      "An n8n workflow with one branch per real case",
      "A webhook, a schedule, or a new contact as the entry point",
      "Input validation that fails loudly, not silently",
      "Enrichment before anything downstream runs",
      "Conditional routing, so each case does only what it needs",
      "Retry with backoff, then a Slack alert to a human",
      "Writes back to GoHighLevel, Sheets, and Slack",
      "Run logging, so a failed run can be traced",
    ],
    wired: [
      { name: "Trigger", desc: "The run starts from a webhook, a schedule, or a new contact rather than from someone remembering. That is the whole point of the build." },
      { name: "Validate", desc: "Input is checked before anything downstream runs, so bad data fails in one place instead of corrupting three systems." },
      { name: "Route", desc: "Conditions split the run into one branch per case, each doing only what that case needs." },
      { name: "Recover", desc: "Failures loop back through validation with backoff; if they still fail, a Slack alert names the run so a human can pick it up. Silent failure is the thing being designed out." },
    ],
    get: [
      "The workflow lives in your own n8n, not rented from me",
      "Every run logged, and every failure named",
      "A retry path that runs before a human is involved",
    ],
    tools: ["n8n", "Zapier", "GoHighLevel"],
  },
  {
    slug: "ghl-crm-setup",
    short: "CRM setup",
    blurb: "Every lead source on one record",
    title: "How I set up a GoHighLevel CRM",
    outcome: "A form, a missed call or an inbound message all arrive on one contact record, tagged and owned, with follow-up already running.",
    frame: "A walkthrough of the build itself, not a single engagement. Client names and numbers go up here as clients sign off on them.",
    facts: [
      { label: "Service", value: "CRM setup & management" },
      { label: "What it covers", value: "Pipelines, tags, automation, reporting" },
      { label: "Runs on", value: "GoHighLevel" },
    ],
    sysmap: {
      cols: 3, gap: 88,
      nodes: [
        { id: "forms", name: "Web forms", meta: "Site and funnel forms", col: 1, row: 1, live: true, Icon: ListChecks },
        { id: "calls", name: "Missed calls", meta: "Text-back fires automatically", col: 1, row: 2, live: false, Icon: PhoneCall },
        { id: "dms", name: "Inbound messages", meta: "Connected channels land here", col: 1, row: 3, live: false, Icon: ChatCircleDots },
        { id: "owner", name: "Owner and task set", meta: "Assigned on entry, not later", col: 2, row: 1, live: false, Icon: Clock },
        { id: "record", name: "One contact record", meta: "Deduped, tagged by source", col: 2, row: 2, live: true, Icon: UsersThree },
        { id: "stale", name: "Stale-lead reminders", meta: "Fire when a lead goes quiet", col: 2, row: 3, live: false, Icon: BellRinging },
        { id: "stages", name: "Pipeline stages", meta: "Named for what actually happens", col: 3, row: 1, live: true, Icon: FunnelSimple },
        { id: "followup", name: "Follow-up automation", meta: "Per stage, stops on reply", col: 3, row: 2, live: true, Icon: ArrowsClockwise },
        { id: "reporting", name: "Reporting view", meta: "Source, stage, and conversion", col: 3, row: 3, live: false, Icon: ChartLineUp },
      ],
      edges: [
        { from: "forms", to: "record" },
        { from: "calls", to: "record" },
        { from: "dms", to: "record" },
        { from: "record", to: "owner" },
        { from: "record", to: "stale" },
        { from: "record", to: "stages" },
        { from: "record", to: "followup" },
        { from: "record", to: "reporting" },
        { from: "stages", to: "followup" },
      ],
      route: ["forms", "record", "stages", "followup"],
    },
    problem: "Leads live in a spreadsheet, a phone and somebody’s inbox at the same time. No record has an owner, nothing is tagged, and the same person gets called twice or not at all. When the month ends there is no honest answer to which source was worth paying for.",
    built: [
      "Sub-account configured from scratch",
      "Pipelines with named, meaningful stages",
      "Tag taxonomy so every source stays traceable",
      "Missed-call text-back on the main number",
      "Forms and calendars connected to the right pipelines",
      "Follow-up automation per stage, stopping on reply",
      "Users, permissions, and lead assignment rules",
      "A reporting view the client can actually read",
    ],
    wired: [
      { name: "Consolidate", desc: "Forms, calls and messages all write to one deduped contact record instead of living in separate tools." },
      { name: "Classify", desc: "Tags are applied on entry by source and campaign, so reporting later does not depend on anyone remembering to label anything." },
      { name: "Own", desc: "Each new contact gets a pipeline stage, an owner, and a task at the moment it arrives." },
      { name: "Maintain", desc: "Stage automation chases quiet leads and flags stale ones, so the pipeline reflects reality rather than optimism." },
    ],
    get: [
      "One contact record per person, whatever they arrived through",
      "Stages named after your real sales process",
      "A new hire can run it on day one",
    ],
    tools: ["GoHighLevel", "Claude Code"],
  },
  {
    slug: "sales-funnel",
    short: "Sales funnels",
    blurb: "Opt-in to booked call, automated",
    title: "How I build a sales funnel",
    outcome: "A cold click becomes a tagged contact, a nurtured lead, and a booked call without anyone chasing it by hand.",
    frame: "A walkthrough of the build itself, not a single engagement. Client names and numbers go up here as clients sign off on them.",
    facts: [
      { label: "Service", value: "Sales funnel build" },
      { label: "What it covers", value: "Landing page, booking step, nurture" },
      { label: "Runs on", value: "GoHighLevel + n8n" },
    ],
    sysmap: {
      cols: 4,
      nodes: [
        { id: "ad", name: "Paid traffic", meta: "Campaign tagged on arrival", col: 1, row: 1, live: true, Icon: Lightning },
        { id: "bio", name: "Link in bio", meta: "Social profiles and posts", col: 1, row: 2, live: false, Icon: Browser },
        { id: "list", name: "Existing list", meta: "Broadcast into the funnel", col: 1, row: 3, live: false, Icon: EnvelopeSimple },
        { id: "landing", name: "Landing page and opt-in", meta: "One offer, one action", col: 2, row: 2, live: true, Icon: FunnelSimple },
        { id: "booking", name: "Booking step", meta: "Straight after the opt-in, never a dead thank-you", col: 3, row: 2, live: true, Icon: CalendarCheck },
        { id: "booked", name: "Booked call in the pipeline", meta: "Owner and reminders attached", col: 4, row: 2, live: true, Icon: UsersThree },
        { id: "nurture", name: "Nurture sequence", meta: "Email and SMS for everyone who did not book", col: 3, row: 4, live: false, Icon: ArrowsClockwise },
      ],
      edges: [
        { from: "ad", to: "landing" },
        { from: "bio", to: "landing" },
        { from: "list", to: "landing" },
        { from: "landing", to: "booking" },
        { from: "booking", to: "booked" },
        { from: "booking", to: "nurture" },
        { from: "nurture", to: "booking", feedback: true },
      ],
      route: ["ad", "landing", "booking", "booked"],
    },
    problem: "Traffic lands on a page that asks for everything at once, so the people who are not ready today leave and are never heard from again. There is no second touch, no record of which ad brought them, and no way to tell a warm lead from a cold one, which makes the cost of a booked call whatever the last campaign happened to spend.",
    built: [
      "Landing page written and built around a single offer",
      "Opt-in form posting into GoHighLevel with campaign tags",
      "Thank-you step that pushes straight to booking",
      "Calendar and reminder sequence wired end to end",
      "Email and SMS nurture until the lead books or opts out",
      "Pipeline stages mirroring the funnel steps",
      "Every entry point tagged so sources can be compared",
      "One call to action per page, with nothing competing",
    ],
    wired: [
      { name: "Land", desc: "Traffic hits one page with one offer and one action; the entry point is tagged so each source can be judged separately." },
      { name: "Convert", desc: "The opt-in creates the contact in GoHighLevel and moves them straight to the booking step rather than a dead thank-you page." },
      { name: "Loop", desc: "Anyone who opts in but does not book enters the nurture sequence, which feeds them back to the booking step until they take it." },
      { name: "Hand over", desc: "A booked call lands in the pipeline with an owner and a reminder sequence already attached." },
    ],
    get: [
      "Every step wired to the next, with no dead ends",
      "Booking and checkout connected to your calendar",
      "The whole funnel living inside your GoHighLevel",
    ],
    tools: ["GoHighLevel", "n8n", "Claude Code"],
  },
  {
    slug: "website-build",
    short: "Websites",
    blurb: "Site built and wired into the CRM",
    title: "How I build a business website",
    outcome: "Every enquiry from the site lands in GoHighLevel tagged, assigned to an owner, and answered automatically. No inbox triage, no lead sitting unread.",
    frame: "A walkthrough of the build itself, not a single engagement. Client names and numbers go up here as clients sign off on them.",
    facts: [
      { label: "Service", value: "Website design & build" },
      { label: "What it covers", value: "Multi-page site, forms, CRM wiring" },
      { label: "Runs on", value: "GoHighLevel" },
    ],
    sysmap: {
      cols: 4,
      nodes: [
        { id: "form", name: "Site contact form", meta: "Posts straight to the CRM", col: 1, row: 1, live: true, Icon: ListChecks },
        { id: "booking", name: "Booking request", meta: "Calendar embedded on the site", col: 1, row: 2, live: false, Icon: CalendarCheck },
        { id: "call", name: "Click-to-call", meta: "Tracked number in the header", col: 1, row: 3, live: false, Icon: PhoneCall },
        { id: "contact", name: "Contact created and tagged", meta: "Tagged with the page it came from", col: 2, row: 2, live: true, Icon: UsersThree },
        { id: "pipeline", name: "Dropped into the pipeline", meta: "Owner assigned on entry", col: 3, row: 2, live: true, Icon: FunnelSimple },
        { id: "reply", name: "Auto-reply to the enquiry", meta: "Fires on submit", col: 4, row: 1, live: true, Icon: EnvelopeSimple },
        { id: "notify", name: "Owner notified", meta: "SMS and email, same trigger", col: 4, row: 2, live: false, Icon: BellRinging },
        { id: "sequence", name: "Follow-up sequence", meta: "Runs until they reply or book", col: 4, row: 3, live: false, Icon: ArrowsClockwise },
      ],
      edges: [
        { from: "form", to: "contact" },
        { from: "booking", to: "contact" },
        { from: "call", to: "contact" },
        { from: "contact", to: "pipeline" },
        { from: "pipeline", to: "reply" },
        { from: "pipeline", to: "notify" },
        { from: "pipeline", to: "sequence" },
      ],
      route: ["form", "contact", "pipeline", "reply"],
    },
    problem: "A brochure site collects a name and an email and stops there. The enquiry lands in a shared inbox, nobody owns it, nothing records which page it came from, and the reply happens whenever someone next opens the tab. By then the lead has usually booked with whoever answered first.",
    built: [
      "A site designed and built from scratch, not a template theme",
      "Mobile-first layout, tested at phone width first",
      "Every form wired directly into GoHighLevel",
      "Source tagging, so lead origin is never guessed",
      "Calendar booking embedded on the enquiry page",
      "Auto-reply and owner alerts firing on the same trigger",
      "Page speed and on-page SEO pass before launch",
      "Tracking on the actions that matter, not pageviews",
    ],
    wired: [
      { name: "Capture", desc: "Each form and calendar on the site posts straight into GoHighLevel rather than to an inbox, carrying a tag for the page it came from." },
      { name: "Assign", desc: "The new contact lands in the pipeline with an owner already set, so nothing waits to be triaged." },
      { name: "Respond", desc: "An auto-reply goes to the enquiry and an alert goes to the owner on the same trigger, so the client never finds out about a lead late." },
      { name: "Chase", desc: "A follow-up sequence runs until the lead replies or books, then stops itself." },
    ],
    get: [
      "You get the repository, not a rental",
      "Enquiries land in GoHighLevel tagged and owned",
      "Quick on a phone, not just on your laptop",
    ],
    tools: ["GoHighLevel", "Claude Code"],
  },
]

export const bySlug = (slug?: string) => caseStudies.find((c) => c.slug === slug)
