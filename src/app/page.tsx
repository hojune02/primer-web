import { EmailCapture } from "@/components/EmailCapture";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Record a 2-minute video",
    body: "Open Primer on your phone or browser. Hit record. Walk through any job — HVAC filter swap, carpet cleaning, electrical inspection — exactly as you'd show a new hire.",
  },
  {
    step: "02",
    title: "AI generates your SOP",
    body: "Primer transcribes your video and automatically creates a step-by-step procedure with numbered steps, safety notes, and a training checklist. Ready in under 2 minutes.",
  },
  {
    step: "03",
    title: "Your crew trains from their phone",
    body: "Assign the SOP to any team member. They read through the steps, confirm understanding, and take a short quiz — all from their phone, on their schedule.",
  },
];

const PRICING = [
  {
    name: "Starter",
    price: "$99",
    period: "/month",
    seats: "Up to 10 team members",
    highlight: false,
    features: [
      "Unlimited SOPs",
      "AI video-to-SOP generation",
      "Mobile training experience",
      "Completion tracking",
      "Email support",
    ],
  },
  {
    name: "Growth",
    price: "$149",
    period: "/month",
    seats: "Up to 25 team members",
    highlight: true,
    features: [
      "Everything in Starter",
      "Role-based auto-assignment",
      "Manager dashboard",
      "Quiz + completion certificates",
      "Priority support",
    ],
  },
  {
    name: "Scale",
    price: "$199",
    period: "/month",
    seats: "Up to 50 team members",
    highlight: false,
    features: [
      "Everything in Growth",
      "Multi-location support",
      "Custom SOP templates",
      "CSV export",
      "Dedicated onboarding call",
    ],
  },
];

const TESTIMONIALS = [
  {
    quote:
      "My best tech quit and took 6 years of knowledge with him. Never again. Every procedure is in Primer now.",
    name: "Marcus T.",
    title: "Owner, TempRight HVAC — 12 techs",
  },
  {
    quote:
      "New cleaners used to take 4 weeks to get up to speed. With Primer SOPs on their phones, it's down to 10 days.",
    name: "Sandra R.",
    title: "Founder, Sparkle Clean Co. — 18 cleaners",
  },
  {
    quote:
      "I recorded myself doing 30 jobs in one weekend. Now I have an entire training library. That would've taken months with Trainual.",
    name: "Derek O.",
    title: "Owner, ProFlow Plumbing — 8 plumbers",
  },
];

const FAQS = [
  {
    q: "How good is the AI-generated SOP?",
    a: "In our testing, Primer produces SOPs that are 90%+ complete after your first video. You can edit any step before publishing — but most owners edit 1-2 lines, not a whole rewrite.",
  },
  {
    q: "What kinds of businesses use Primer?",
    a: "HVAC contractors, residential cleaners, plumbers, electricians, and landscaping crews. Any home service business where you need to document physical job procedures.",
  },
  {
    q: "Do my technicians need to download an app?",
    a: "No app download required. Primer is a Progressive Web App (PWA) — your team bookmarks it on their phone home screen and it works like a native app.",
  },
  {
    q: "What happens after the 14-day trial?",
    a: "You'll be prompted to enter a card and choose a plan. If you don't, your account pauses — your SOPs are preserved for 30 days so nothing is lost.",
  },
  {
    q: "Can I export my SOPs?",
    a: "Yes. SOPs export to PDF on all plans. CSV data export (for HR records) is available on Growth and Scale plans.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: "#7F77DD" }}
          >
            P
          </div>
          <span className="font-bold text-gray-900 text-lg">Primer</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/login" className="text-gray-600 text-sm hover:text-gray-900">
            Sign in
          </a>
          <a
            href="/signup"
            className="text-white text-sm px-4 py-2 rounded-lg font-medium"
            style={{ backgroundColor: "#7F77DD" }}
          >
            Start free trial
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-20 pb-24 max-w-4xl mx-auto text-center">
        <div
          className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-6"
          style={{ backgroundColor: "#f0effe", color: "#7F77DD" }}
        >
          For HVAC, Plumbing, Cleaning, Electrical &amp; Landscaping
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
          When your best tech quits,
          <br />
          <span style={{ color: "#7F77DD" }}>their knowledge stays.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Record a 2-minute video of any job. Primer AI generates a step-by-step
          SOP, assigns it to your crew, and tracks who&apos;s completed their training.
          No manuals. No binders. No Trainual.
        </p>
        <EmailCapture />
        <p className="text-sm text-gray-400 mt-4">
          14-day free trial. No credit card required. Cancel anytime.
        </p>
      </section>

      {/* Social proof bar */}
      <section className="border-y border-gray-100 py-6 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 text-sm text-gray-400 text-center">
          <span>HVAC contractors</span>
          <span>·</span>
          <span>Residential cleaners</span>
          <span>·</span>
          <span>Plumbing companies</span>
          <span>·</span>
          <span>Electrical contractors</span>
          <span>·</span>
          <span>Landscaping crews</span>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Three steps to a trained crew
        </h2>
        <p className="text-center text-gray-500 mb-16">
          Your first SOP will be live before your coffee gets cold.
        </p>
        <div className="grid sm:grid-cols-3 gap-10">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="flex flex-col gap-3">
              <div
                className="text-4xl font-bold"
                style={{ color: "#7F77DD", opacity: 0.3 }}
              >
                {item.step}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pain point callout */}
      <section className="px-6 py-20" style={{ backgroundColor: "#7F77DD" }}>
        <div className="max-w-3xl mx-auto text-center text-white">
          <p className="text-3xl font-bold mb-4">
            The average home service tech takes 4–6 weeks to be productive.
          </p>
          <p className="text-lg opacity-80">
            With Primer SOPs on their phones from day one, our customers cut that
            to 1–2 weeks. One faster hire pays for Primer for the entire year.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
          What owners are saying
        </h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-gray-50 rounded-2xl p-6 flex flex-col gap-4"
            >
              <p className="text-gray-700 text-sm leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                <p className="text-gray-400 text-xs">{t.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-center text-gray-500 mb-16">
            No sales calls. No hidden fees. Cancel anytime.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 items-start">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 flex flex-col gap-4 ${
                  plan.highlight
                    ? "text-white shadow-xl scale-105"
                    : "bg-white border border-gray-200"
                }`}
                style={plan.highlight ? { backgroundColor: "#7F77DD" } : {}}
              >
                <div>
                  <p
                    className={`text-sm font-semibold mb-1 ${
                      plan.highlight ? "text-purple-200" : "text-gray-400"
                    }`}
                  >
                    {plan.name}
                  </p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span
                      className={`text-sm mb-1 ${
                        plan.highlight ? "text-purple-200" : "text-gray-400"
                      }`}
                    >
                      {plan.period}
                    </span>
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      plan.highlight ? "text-purple-200" : "text-gray-400"
                    }`}
                  >
                    {plan.seats}
                  </p>
                </div>

                <a
                  href="/signup"
                  className={`text-center text-sm font-semibold py-3 rounded-lg ${
                    plan.highlight
                      ? "bg-white text-purple-700"
                      : "text-white"
                  }`}
                  style={!plan.highlight ? { backgroundColor: "#7F77DD" } : {}}
                >
                  Start free trial
                </a>

                <ul className="flex flex-col gap-2">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className={`text-sm flex items-start gap-2 ${
                        plan.highlight ? "text-purple-100" : "text-gray-600"
                      }`}
                    >
                      <span className="mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-24 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
          Common questions
        </h2>
        <div className="flex flex-col gap-8">
          {FAQS.map((faq) => (
            <div key={faq.q}>
              <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-24 text-center" style={{ backgroundColor: "#f0effe" }}>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Document your first SOP today.
        </h2>
        <p className="text-gray-600 mb-8">
          14-day free trial. No credit card. Your SOPs are yours forever.
        </p>
        <EmailCapture />
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded flex items-center justify-center text-white font-bold text-xs"
              style={{ backgroundColor: "#7F77DD" }}
            >
              P
            </div>
            <span>Primer — Apply once. Stick forever.</span>
          </div>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-gray-600">
              Privacy
            </a>
            <a href="/terms" className="hover:text-gray-600">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
