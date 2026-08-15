import React from 'react';
import familyImage from '../assets/chitnova-family.png';

import {
  ArrowRight,
  ShieldCheck,
  Gavel,
  Receipt,
  Headphones,
  CheckCircle2,
  CalendarDays,
  LockKeyhole,
} from 'lucide-react';

import { Link } from 'react-router-dom';

const stats = [
  ['15+', 'Years Experience'],
  ['25,000+', 'Active Members'],
  ['₹1500 Cr+', 'Amount Managed'],
  ['99.9%', 'On-time Payments'],
];

const plans = [
  ['₹1 Lakh Chit', '₹2,500', '40 Months'],
  ['₹2 Lakh Chit', '₹5,000', '40 Months'],
  ['₹5 Lakh Chit', '₹12,500', '40 Months'],
  ['₹10 Lakh Chit', '₹25,000', '40 Months'],
];

export default function Landing() {
  return (
    <>
      {/* ================= HERO ================= */}

      <section className="hero">

        {/* LEFT SIDE */}
        <div className="hero-copy">

          <span className="eyebrow">
            TRUSTED DIGITAL CHIT MANAGEMENT
          </span>

          <h1>
            Save Smart.
            <br />
            Grow Secure.
            <br />
            <em>Achieve Your Goals.</em>
          </h1>

          <p>
            Simple, transparent chit plans designed to help you save
            consistently and access meaningful funds when you need them.
          </p>

          <div className="hero-actions">

            <Link
              className="btn primary big"
              to="/plans"
            >
              Explore Chit Plans
              <ArrowRight size={18} />
            </Link>

            <Link
              className="btn outline big"
              to="/register"
            >
              Become a Member
            </Link>

          </div>

          <div className="trust-row">

            <span>
              <ShieldCheck />
              Secure Payments
            </span>

            <span>
              <Gavel />
              Transparent Auctions
            </span>

            <span>
              <Receipt />
              Digital Receipts
            </span>

            <span>
              <Headphones />
              24/7 Support
            </span>

          </div>

        </div>

        {/* RIGHT SIDE — LARGE IMAGE */}

        <div className="hero-art">

          <img
            src={familyImage}
            alt="Chitnova family financial planning"
            className="hero-family-image"
          />

        </div>

      </section>


      {/* ================= STATS ================= */}

      <section className="stats">

        {stats.map(([number, title]) => (
          <div key={title}>

            <strong>{number}</strong>

            <span>{title}</span>

          </div>
        ))}

      </section>


      {/* ================= CHIT PLANS ================= */}

      <section
        className="section"
        id="plans"
      >

        <div className="section-heading">

          <span>Flexible choices</span>

          <h2>Our Chit Plans</h2>

          <p>
            Choose a plan that fits your monthly budget
            and financial goals.
          </p>

        </div>

        <div className="plan-grid">

          {plans.map(([name, monthly, duration]) => (

            <article
              className="plan-card"
              key={name}
            >

              <div className="plan-icon">
                ₹
              </div>

              <h3>{name}</h3>

              <div className="plan-meta">

                <span>
                  Monthly installment
                </span>

                <b>{monthly}</b>

              </div>

              <div className="plan-meta">

                <span>
                  Duration
                </span>

                <b>{duration}</b>

              </div>

              <div className="plan-meta">

                <span>
                  Members
                </span>

                <b>40</b>

              </div>

              <Link
                className="btn primary full"
                to="/register"
              >
                View Details
                <ArrowRight size={16} />
              </Link>

            </article>

          ))}

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section
        className="split-section"
        id="how-it-works"
      >

        <div>

          <span className="eyebrow">
            Simple from day one
          </span>

          <h2>
            How Chit Works
          </h2>

          <div className="steps">

            {[
              ['1', 'Join Chit'],
              ['2', 'Pay Monthly Installment'],
              ['3', 'Monthly Auction'],
              ['4', 'Receive Chit Amount'],
              ['5', 'Continue Payments'],
            ].map(([number, title]) => (

              <div
                className="step"
                key={number}
              >

                <b>{number}</b>

                <span>{title}</span>

              </div>

            ))}

          </div>

        </div>


        <div id="benefits">

          <span className="eyebrow">
            Built for confidence
          </span>

          <h2>
            Why Choose Us?
          </h2>

          <div className="checks">

            {[
              'Transparent auctions',
              'Secure payments',
              'Easy online payment',
              'Digital receipts',
              'Real-time account tracking',
              'Dedicated customer support',
              'Notifications & reminders',
              'Privacy-first account access',
            ].map((item) => (

              <div key={item}>

                <CheckCircle2 />

                {item}

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* ================= DASHBOARD PREVIEW ================= */}

      <section className="dashboard-preview">

        <div>

          <span className="eyebrow">
            Your account, anytime
          </span>

          <h2>
            Everything important in one dashboard.
          </h2>

          <p>
            See what you owe, what you have paid,
            your next due date, auction updates,
            messages and receipts without searching
            through paperwork.
          </p>

          <ul>

            {[
              'Active chit summary',
              'Total paid & outstanding',
              'Upcoming installment',
              'Payment history & receipts',
              'Auction and notification center',
            ].map((item) => (

              <li key={item}>

                <CheckCircle2 />

                {item}

              </li>

            ))}

          </ul>

        </div>


        <div className="mock-dashboard">

          <div className="mock-top">

            <b>Dashboard Overview</b>

            <span>Customer</span>

          </div>


          <div className="mini-cards">

            <span>
              <small>Active Chits</small>
              <b>2</b>
            </span>

            <span>
              <small>Total Paid</small>
              <b>₹30,000</b>
            </span>

            <span>
              <small>Outstanding</small>
              <b>₹20,000</b>
            </span>

            <span>
              <small>Next Due</small>
              <b>25 Aug</b>
            </span>

          </div>


          <div className="payment-table">

            <b>Payment Schedule</b>

            {[
              'Month 01 — ₹2,500',
              'Month 02 — ₹2,500',
              'Month 03 — ₹2,500',
              'Month 04 — ₹2,500',
            ].map((item, index) => (

              <div key={item}>

                <span>{item}</span>

                <i className={index < 2 ? 'paid' : ''}>
                  {index < 2 ? 'Paid' : 'Pending'}
                </i>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* ================= AUCTION ================= */}

      <section className="section light">

        <div className="section-heading">

          <span>Stay informed</span>

          <h2>
            Upcoming Auction
          </h2>

        </div>


        <div className="auction-card">

          <div>

            <CalendarDays />

            <div>

              <b>
                ₹5,00,000 Chit
              </b>

              <span>
                Auction Date • 25 Aug 2026
              </span>

            </div>

          </div>


          <div>

            <b>40</b>

            <span>
              Members
            </span>

          </div>


          <span className="status">
            Upcoming
          </span>


          <Link
            className="btn outline"
            to="/login"
          >
            View Auction
          </Link>

        </div>

      </section>


      {/* ================= TESTIMONIALS ================= */}

      <section className="section testimonials">

        <div className="section-heading">

          <span>
            Member voices
          </span>

          <h2>
            What Our Members Say
          </h2>

        </div>


        <div className="quote-grid">

          {[
            [
              'Suresh Babu',
              '“Transparent, reliable and very easy to track my payments.”',
            ],
            [
              'Lakshmi Priya',
              '“I can see every installment and receipt from my phone.”',
            ],
            [
              'Karthik Reddy',
              '“The reminders help me never miss a payment.”',
            ],
          ].map(([name, quote]) => (

            <article key={name}>

              <div className="avatar">
                {name[0]}
              </div>

              <p>
                {quote}
              </p>

              <b>
                {name}
              </b>

              <span>
                ★★★★★
              </span>

            </article>

          ))}

        </div>

      </section>


      {/* ================= FAQ ================= */}

      <section
        className="section"
        id="faqs"
      >

        <div className="section-heading">

          <span>
            Need clarity?
          </span>

          <h2>
            Frequently Asked Questions
          </h2>

        </div>


        <div className="faq-grid">

          {[
            'What is a chit fund?',
            'How does the auction work?',
            'How can I join a chit?',
            'How do I pay installments?',
            'How is dividend calculated?',
            'What happens if I miss a payment?',
          ].map((question) => (

            <details key={question}>

              <summary>

                {question}

                <ArrowRight size={16} />

              </summary>

              <p>
                Chitnova members can view the exact terms,
                schedule, charges and payment information
                for their selected plan inside the member portal.
              </p>

            </details>

          ))}

        </div>

      </section>


      {/* ================= FINAL CTA ================= */}

      <section className="cta">

        <div>

          <span className="eyebrow">
            Ready when you are
          </span>

          <h2>
            Start Your Financial Journey Today
          </h2>

          <p>
            Join Chitnova and take the smart step
            towards a more organized financial future.
          </p>

        </div>


        <div>

          <Link
            className="btn primary big"
            to="/plans"
          >
            Explore Plans
          </Link>

          <Link
            className="btn white big"
            to="/register"
          >
            Join Now
          </Link>

        </div>


        <LockKeyhole className="cta-icon" />

      </section>
    </>
  );
}