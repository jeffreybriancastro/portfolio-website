export type QA = { q: string; a: string }

/**
 * The questions people ask before they write. Shown as an accordion on the
 * Contact view.
 *
 * Two of these are commitments only Jeffrey can make - what he charges and
 * how fast he starts - so they are written as the honest version ("ask me")
 * rather than a number invented here. Replace them with the real answer and
 * the TODO goes away. Everything else is grounded in the work on this site.
 */
export const FAQS: QA[] = [
  {
    q: 'What do you actually build?',
    a: 'Four things, and most clients start with one: automation workflows, a GoHighLevel CRM setup, a sales funnel, or a website. They tend to end up connected, because a funnel that does not feed the CRM is just a page.',
  },
  {
    q: 'Do I need to already be on GoHighLevel?',
    a: 'No. If you are, I build inside the account you have. If you are not, I can set it up, or wire what you do use through n8n, Zapier or Make instead. The point is that it runs on your stack, not that you move to mine.',
  },
  {
    q: 'What happens after I send this form?',
    a: 'It lands in my GoHighLevel as an opportunity with an owner on it - the same wiring you can see on the Projects page. You get a reply from me, not an account manager, and a straight answer on whether I am the right fit.',
  },
  {
    q: 'Where are you based?',
    a: 'Cagayan de Oro in the Philippines, GMT+8. That overlaps a full working day with Australia and Asia, and the early morning with Europe. For US clients the overlap is the evening my side, which I do work.',
  },
  {
    // TODO (Jeffrey): replace with your real pricing model.
    q: 'How do you price work?',
    a: 'It depends on the build, so I quote after we talk rather than off a list. Tell me what you are running now and what is still manual and I will come back with the shape of it and what it takes.',
  },
]
