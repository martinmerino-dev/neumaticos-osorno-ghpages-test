# Owner Input Required — Privacy Compliance (Law 21.719)

This is a checklist, not a form to submit anywhere — fill it in (directly in
this file, or tell it to whoever is working on this next) before any privacy
policy text gets written or published. See `INITIAL-AUDIT.md` for why each
item is needed; nothing here was guessed, and nothing will be invented if
left blank — nothing on the live site will state otherwise just because a
box in a policy page needs filling.

None of this blocks the technical work already done (contact form removal,
phone number update). It only blocks: writing the actual privacy policy
text, and deciding whether/when to deploy `redesign/2027`.

---

## 1. Data controller identity

- [ ] Legal business name (exact, as registered):
      `_______________________________________________`
- [ ] RUT:
      `_______________________________________________`
- [ ] Legal form: ☐ Persona natural con giro ☐ EIRL ☐ SpA ☐ Other: `_____`
- [ ] Legal representative's name (if a company):
      `_______________________________________________`
- [ ] Is **Av. Juan Mackenna 1917, Osorno** (the public shop address
      already shown on the site) also the legal/fiscal address for
      data-controller purposes?  ☐ Yes  ☐ No — fiscal address is:
      `_______________________________________________`

## 2. Privacy contact point

- [ ] Which email should people use specifically for privacy/data
      requests (access, rectification, erasure, etc.)?
      ☐ `contacto@neumaticososorno.cl` (the one already on the site)
      ☐ A different address: `_______________________________________________`
- [ ] Is that address actively monitored (not just an inbox nobody
      checks)?  ☐ Yes  ☐ No
- [ ] Who at the business is responsible for handling a privacy request
      if one comes in (even informally — doesn't need a title)?
      `_______________________________________________`

## 3. Data processed outside the website

The website itself was fully audited (see `INITIAL-AUDIT.md` §1–§2).
This section is about everything else the business does with customer
data, which the law also covers but which isn't visible from the code:

- [ ] Does the business keep a WhatsApp Business contact list, saved
      chats, or broadcast lists from customer conversations?
      ☐ Yes  ☐ No  ☐ Not sure
- [ ] Is there an invoicing, POS, or sales system that stores customer
      names/RUT/contact info (e.g. for boletas/facturas)?
      ☐ Yes — which one: `_______` ☐ No
- [ ] Any supplier or customer spreadsheet/database kept outside the
      website (Excel, Google Sheets, a CRM, etc.)?
      ☐ Yes — what: `_______` ☐ No
- [ ] Any employee personal data processed (payroll, contracts, etc.)
      that should be covered by a separate, internal policy rather than
      the public-facing one?  ☐ Yes  ☐ No

## 4. Vendors / access

- [ ] Who has admin access to the GitHub repository and its Pages
      settings? `_______________________________________________`
- [ ] Who controls the domain registrar/DNS for neumaticososorno.cl?
      `_______________________________________________`
- [ ] Which Web3Forms account/plan is the live contact form using (this
      matters only while the legacy form stays live — it's already
      removed on the branch being prepared for deployment)?
      `_______________________________________________`

## 5. Analytics intent

- [ ] Is Google Analytics 4 actually planned to go live at some point?
      (Right now it's built but inactive — see `INITIAL-AUDIT.md` §2.)
      ☐ Yes, planned  ☐ No, remove the scaffolding instead  ☐ Undecided
- [ ] If yes: who owns/has access to the GA4 property?
      `_______________________________________________`

## 6. Retention

- [ ] Is there a current practice (even informal) for how long customer
      WhatsApp conversations, invoices, or inquiry records are kept
      before being deleted?
      `_______________________________________________`
      (If there's no current practice, that's fine to say — a reasonable
      retention criterion can be proposed for approval instead of
      reverse-engineering one from nothing.)

## 7. Deployment decision

- [ ] Timeline to deploy `redesign/2027` to production, relative to the
      law taking effect 2026-12-01. (The live site's active contact form
      is the single most exposed item found in the audit; it's already
      fixed on the branch, but only deploying it fixes the live site.)
      `_______________________________________________`

---

**Next step once this is filled in (even partially):** Phase 3 (draft
privacy policy) can begin using whatever is confirmed here, with every
still-blank item left out rather than guessed — not published live until
you've reviewed the draft.
