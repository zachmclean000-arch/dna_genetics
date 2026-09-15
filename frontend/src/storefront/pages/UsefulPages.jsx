import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { termsReference } from "../../data/termsReference";
import "./UsefulPages.css";

const faqGroups = [
  {
    title: "Common FAQ’s",
    items: [
      [
        "Can I track my order once shipped?",
        "Yes, you can track your order after we ship it. Check your email for a confirmation message containing a tracking link. Click it to stay updated on the status of your package. You may also email us your order number to check on it if you didn’t receive an email.",
      ],
      [
        "How long does it take to process my order?",
        "We aim to process all orders within 1–3 business days. The time to dispatch products depends on the chosen payment method and verification. We also conduct rigorous checks on credit card authorizations for security. Bank Transfers may take 3–5 days to process.",
      ],
      [
        "Which cities do you ship to?",
        "We ship to all cities and states across the U.S., except for Kentucky, Kansas, and areas where it’s illegal. Please visit www.dnagenetics.eu if you’re a European customer. We ship to several areas in the European Union and the U.K. from there.",
      ],
      [
        "Do you offer bulk deals?",
        "Yes, we stock various seeds in bulk deals. Join our family and keep track via our Seed Vault Club to stay updated with our specials. We offer exclusive strain deliveries and massive savings on select seeds. Sign up to get unbeatable access to the most famous cultivars.",
      ],
      [
        "What is your return policy?",
        "Our return policy allows for refunds or replacements under specific conditions. Send us an email explaining your reason for sending back your products. Contact us within seven days of your order receipt. Ensure the goods remain unused and in their original packaging. We also allow up to 14 days to return your product if it’s damaged or faulty. Refer to our returns and refunds policy for a complete breakdown of our terms.",
      ],
      [
        "How long should I wait for a response?",
        "Please allow around 24–48 business hours to receive a response to your message or email inquiry. There may be a slight delay due to the large volume of correspondence we receive. We try our best to get back to our beloved customers as soon as possible. ",
      ],
    ],
  },
];

const pages = {
  "/shipping-information": {
    title: "Shipping Information",

    sections: [
      [
        "Shipping Information",
        [
          <p key="shipping-price">
            <strong>$5.99</strong> Standard Shipping{" "}
            <strong>(Updated Shipping Price Reduction)</strong> | Free shipping
            with orders over <strong>$100</strong> | Taxes added at checkout
          </p>,
          <p key="shipping-area">
            We ship to U.S and Canada Customers only. Orders are shipped via
            USPS. Your shipping charge or service may vary depending on the
            weight of your package. For a price estimate and tracking please
            visit{" "}
            <a href="https://www.usps.com/" target="_blank" rel="noreferrer">
              www.usps.com.
            </a>
          </p>,
        ],
      ],
      [
        "Standard shipping",
        [
          <p key="standard-shipping">
            Delivery in 1-5 business days after placing your order. We will send
            you a confirmation email once your order has been shipped. Please
            allow 24-48 hours for your tracking information to update. You can
            track your orders{" "}
            <a
              href="https://tools.usps.com/go/TrackConfirmAction_input"
              target="_blank"
              rel="noreferrer"
            >
              here.
            </a>
          </p>,
        ],
      ],
      [
        "Canada Shipping",
        [
          "Orders placed to Canada will be shipped via USPS. We cannot offer tracking and it is at the buyer’s discretion when placing an order that it may be stopped at customs.",
        ],
      ],
      [
        "P.O. Box",
        ["Post Office Box (P.O. Box) addresses will be shipped with USPS."],
      ],
      [
        "Holiday Schedule",
        [
          "Our warehouse and carriers do not ship packages or deliver them on the following holidays:",
          <ul className="dna-policy-list" key="shipping-holidays">
            {[
              "New Year’s Day",
              "Martin Luther King’s Birthday",
              "Presidents’ Day",
              "Memorial Day",
              "Independence Day",
              "Labor Day",
              "Thanksgiving Day",
              "The Day After Thanksgiving Day",
              "Christmas Day",
            ].map((holiday) => (
              <li key={holiday}>{holiday}</li>
            ))}
          </ul>,
        ],
      ],
      [
        "Legal Disclaimer",
        [
          <p key="shipping-legal">
            <strong>LEGAL DISCLAIMER:</strong> THIS WEBSITE SHOULD NOT BE
            VISITED BY ANYONE UNDER THE AGE OF 21! WARNING! GERMINATION OF
            CANNABIS SEEDS IS ILLEGAL IN MOST COUNTRIES. THESE SEEDS SOLD BY{" "}
            <a href="https://dnagenetics.com/" target="_blank" rel="noreferrer">
              DNAGENETICS.COM
            </a>{" "}
            ARE AS A COLLECTABLE ADULT SOUVENIR TO HELP PRESERVE THE CANNABIS
            GENETICS FOR FUTURE GENERATIONS. PLEASE DO NOT ASK QUESTIONS ON HOW
            TO GROW THESE SEEDS, AS UNDER CURRENT LEGISLATION IT IS ILLEGAL TO
            GROW THEM OR ENCOURAGE THEIR GROWTH THROUGH GIVING ADVICE. ANY
            INFORMATION ON THE PACKAGING OF THE SEEDS, MARKETING MATERIAL OR
            WEBSITES, IS GIVEN FOR INFORMATIONAL PURPOSES OR THE PURPOSE OF
            DIFFERENTIATION. IT IS NOT INTENDED TO CONDONE, PROMOTE OR INCITE
            THE USE OF ILLEGAL OR CONTROLLED SUBSTANCES. AS A DNAGENETICS.COM
            CUSTOMER, YOU ARE PROHIBITED FROM DISTRIBUTING SEEDS WE SUPPLY TO
            COUNTRIES WHERE POSSESSION OF AND/OR TRAFFICKING IN CANNABIS SEEDS
            OR OTHER SEEDS IS ILLEGAL.
          </p>,
          <p key="shipping-fda">
            <strong>FDA DISCLAIMER:</strong> THESE STATEMENTS HAVE NOT BEEN
            EVALUATED BY THE FOOD AND DRUG ADMINISTRATION. THIS PRODUCT IS NOT
            INTENDED TO DIAGNOSE, TREAT, CURE OR PREVENT ANY DISEASE. IF YOU ARE
            PREGNANT, NURSING, TAKING ANY MEDICATIONS OR HAVE ANY MEDICAL
            CONDITIONS, CONSULT YOUR DOCTOR BEFORE USE. LEGAL AGE OF
            USE/CONSUMPTION IS 21 YEARS OF AGE. OUR PRODUCTS DO NOT CONTAIN MORE
            THAN THE HEMP STANDARD OF 0.3% THC.
          </p>,
        ],
      ],
    ],
  },
  "/returns-refund-policy": {
    title: "Returns & Refund Policy",
    intro:
      "A returns policy normally explains the contact period, condition of returned goods, proof of postage, damaged items, exchanges, and cancellation.",
    sections: [
      [
        "Returns Responsibility",
        [
          "All returns are the responsibility of the customer until you reach us; we advise that you use proof of postage or signed for delivery to ensure no problems. Make sure to list your order number and any information to help with processing. The goods should be sent back with a recorded service, as we will not be responsible for returns lost in the post. ",
        ],
      ],

      [
        "Damaged or faulty goods",
        [
          "In the unlikely event that an item is found to be faulty or damaged, you may send it back for a replacement or refund.  Please contact us within 14 days of receipt of your order and return the goods as per our returns policy above. Your replacement goods will be shipped (or your payment will be refunded) within 14 days of receipt of your return.",
        ],
      ],
      [
        "Cancelling an order",
        [
          "If you wish to cancel your order it is only possible if the order has not yet left our warehouse. If you have made a payment and wish to now cancel your order, and it has not left our facility, then we can refund you the payment. If the parcel has already left our facility, then it is no longer possible to cancel the order. In this case the customer must wait for the parcel to be delivered and if you still no longer want the items, you can return the package to us for a refund or exchange. We must receive the package back in our facility within 7 days and as originally packed before we can issue any refund.",
        ],
      ],
    ],
  },
  "/privacy": {
    title: "Privacy Policy",
    sections: [
      [
        "COOKIES",
        [
          "We may obtain information about your general Internet usage by using a cookie file which is stored on your browser or the hard drive of your computer. Cookies contain information that is securely transferred to your computer’s hard drive. They help us improve our site and to deliver a better and more personalized service. Some of the cookies we use are essential for the site to operate and, in particular, to allow you to shop from our sitess.",
        ],
      ],
      [
        "About Cookies",
        [
          "Cookies are small text files stored on your computer when you visit certain web pages. DNA Genetics uses cookies to keep track of what you have in your basket, and to remember you when you return back. To order merchandise at www.dnagenetics.com you need to have cookies enabled. Not allowing the cookies does not prevent you from browsing the website. Most web browsers have cookies enabled by default. Please note that cookies do not harm your computer. They do not store personally identifiable information like credit card details etc. But, we do use encrypted information gathered to help you improve your experience of the website. For example, identifying and resolving errors or determining relevant related products while you’re browsing. We’re giving you this information as part of our initiative to comply with recent legislation and to make sure we’re honest and clear about your privacy when using our website. We know you’d expect nothing less from us, and please be assured that we’re working on a number of other privacy and cookie-related improvements to the website. For more detailed information please visit: http://www.allaboutcookies.org",
        ],
      ],
      [
        "Our Cookie Policy",
        [
          "If ‘share’ our content with friends through social networks – such as Facebook and Twitter – you may be sent cookies from these websites. We have no control over the settings of the cookies from third party websites, so we suggest you check the third-party website for more information about their cookie-policy and how to manage them.",
        ],
      ],
      [
        "Third Party Cookies",
        [
          "When you visit www.DNAGenetics.com you may notice some cookies that are not related to our website. If you go on to a web page that contains embedded content, for example from YouTube, you may be sent cookies from these websites. We do not control the setting of these cookies, so we suggest you check the third-party websites for more information about their cookies and how to manage them.",
        ],
      ],
      [
        "Security",
        [
          "Please be assured that the data contained in the cookie used in these adverts is completely anonymous and doesn’t contain any of your personal details.",
        ],
      ],
    ],
  },
  "/terms-conditions": {
    title: "Terms & Conditions",
    intro: "Original retailer terms — reference policy",

    sections: [["Terms and conditions of use", termsReference]],
  },
  "/loyalty-dna-points": {
    title: "Loyalty DNA Points",
    sections: [
      [
        "Loyalty DNA Points",
        [
          <p key="loyalty-intro">
            You can earn <strong>DNA Points</strong> every time you order – all
            you need is a free <strong>DNA Genetics account</strong> which will
            be created for you upon checking out.
          </p>,
        ],
      ],
      [
        "How Does It Work?",
        [
          <ul className="dna-policy-list" key="loyalty-how">
            <li>
              Every order you place earns <strong>DNA Points</strong>.
            </li>
            <li>
              Every <strong>$1 you spend</strong> on seeds is worth{" "}
              <strong>1 DNA Point</strong>.
            </li>
            <li>
              <strong>10 DNA Points</strong> are <strong>worth $1.00.</strong>
            </li>
            <li>
              Convert your <strong>DNA Points</strong> into{" "}
              <strong>store credit</strong> with ease to get money off your next
              order.
            </li>
            <li>
              You do not need to sign up to action the DNA Points Loyalty
              Scheme; your first order activates rewards and points
              automatically.
            </li>
          </ul>,
        ],
      ],
      [
        "The Benefits",
        [
          <ul className="dna-policy-list" key="loyalty-benefits">
            <li>
              Money off any future purchases, you do like discounts right?
            </li>
            <li>
              The more you spend, the more in DNA Points you can accumulate.
            </li>
          </ul>,
        ],
      ],
      [
        "What Will Earn Me Points?",
        [
          <ul className="dna-policy-list" key="loyalty-earn">
            <li>
              <strong>10 DNA Points</strong> when completing your first order.
            </li>
            <li>
              <strong>1 DNA Point</strong> for every{" "}
              <strong>$1 you spend</strong>.
            </li>
            <li>
              Some promotions increase the value of your{" "}
              <strong>DNA Points</strong>.
            </li>
          </ul>,
        ],
      ],
      [
        "Terms And Conditions",
        [
          <ul className="dna-policy-list" key="loyalty-terms">
            <li>
              You must have an account with us, which is created upon checking
              out for the first time.
            </li>
            <li>
              DNA Points last for 365 days, giving you one year to use what you
              have accumulated.
            </li>
            <li>
              DNA Points cannot be traded or moved to another member’s account.
            </li>
            <li>If you delete your account, you will lose your DNA Points.</li>
            <li>
              Points are based on item costs. Shipping and voucher codes are
              excluded.
            </li>
            <li>
              If you cancel your order, credited DNA Points will be deducted.
            </li>
            <li>
              DNA Points can only be exchanged in this store as money-off
              vouchers.
            </li>
            <li>We may withdraw or amend the DNA Points scheme at any time.</li>
          </ul>,
        ],
      ],
      [
        "Legal Disclaimer",
        [
          <p key="loyalty-legal">
            <strong>LEGAL DISCLAIMER:</strong> THIS WEBSITE SHOULD NOT BE
            VISITED BY ANYONE UNDER THE AGE OF 21! WARNING! GERMINATION OF
            CANNABIS SEEDS IS ILLEGAL IN MOST COUNTRIES. THESE SEEDS SOLD BY
            DNAGENETICS.SHOP ARE AS A COLLECTABLE ADULT SOUVENIR TO HELP
            PRESERVE CANNABIS GENETICS FOR FUTURE GENERATIONS. PLEASE DO NOT ASK
            QUESTIONS ON HOW TO GROW THESE SEEDS, AS UNDER CURRENT LEGISLATION
            IT IS ILLEGAL TO GROW THEM OR ENCOURAGE THEIR GROWTH THROUGH GIVING
            ADVICE. INFORMATION ON PACKAGING, MARKETING MATERIAL, OR WEBSITES IS
            GIVEN FOR INFORMATIONAL PURPOSES OR DIFFERENTIATION. IT IS NOT
            INTENDED TO CONDONE, PROMOTE, OR INCITE THE USE OF ILLEGAL OR
            CONTROLLED SUBSTANCES. AS A DNAGENETICS.SHOP CUSTOMER, YOU ARE
            PROHIBITED FROM DISTRIBUTING SEEDS TO COUNTRIES WHERE POSSESSION OF
            AND/OR TRAFFICKING IN CANNABIS SEEDS OR OTHER SEEDS IS ILLEGAL.
          </p>,
          <p key="loyalty-fda">
            <strong>FDA DISCLAIMER:</strong> THESE STATEMENTS HAVE NOT BEEN
            EVALUATED BY THE FOOD AND DRUG ADMINISTRATION. THIS PRODUCT IS NOT
            INTENDED TO DIAGNOSE, TREAT, CURE OR PREVENT ANY DISEASE. IF YOU ARE
            PREGNANT, NURSING, TAKING ANY MEDICATIONS OR HAVE ANY MEDICAL
            CONDITIONS, CONSULT YOUR DOCTOR BEFORE USE. LEGAL AGE OF
            USE/CONSUMPTION IS 21 YEARS OF AGE. OUR PRODUCTS DO NOT CONTAIN MORE
            THAN THE HEMP STANDARD OF 0.3% THC.
          </p>,
        ],
      ],
    ],
  },
};

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="dna-useful-contact">
      <div>
        <p className="dna-useful-kicker">CONTACT DNA</p>
        <h1>Contact</h1>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSent(true);
          event.currentTarget.reset();
        }}
      >
        <h2>Send us a message</h2>
        <div className="dna-contact-grid">
          <label>
            First name *<input name="firstName" />
          </label>
          <label>
            Last name *<input name="lastName" />
          </label>
        </div>
        <label>
          Email address *<input name="email" type="email" />
        </label>
        <label>
          Subject *<input name="subject" type="text" />
        </label>
        <label>
          Message *<textarea name="message" rows="7" />
        </label>
        <button className="button gold" type="submit">
          SUBMIT MESSAGE
        </button>
        {sent && (
          <p className="dna-contact-success" role="status">
            Thank you for contacting us.
          </p>
        )}
      </form>
    </div>
  );
}

function FAQPage() {
  return (
    <>
      <p className="dna-useful-kicker">FREQUENTLY ASKED QUESTIONS</p>
      <h1>Frequently Asked Questions</h1>
      <p className="dna-useful-intro">
        Answers to common questions about the catalogue, checkout, orders, and
        account features.
      </p>
      {faqGroups.map((group) => (
        <section className="dna-faq-group" key={group.title}>
          <h2>{group.title}</h2>
          {group.items.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </section>
      ))}
    </>
  );
}

function BrochurePage() {
  const brochureUrl =
    "https://dnagenetics.com/wp-content/uploads/2024/10/USA-Brochure-2024-ENG.pdf";
  return (
    <>
      <p className="dna-useful-kicker">DNA GENETICS</p>
      <h1>Cannabis Seed Brochure</h1>
      <div className="dna-brochure-actions">
        <p>
          Browse the original 2024 English seed brochure in the viewer below.
        </p>
      </div>
      <div className="dna-brochure-viewer">
        <iframe
          src={`${brochureUrl}#view=FitH&toolbar=1`}
          title="DNA Genetics cannabis seed brochure"
        />
        <p>
          If the brochure does not appear,{" "}
          <a href={brochureUrl} target="_blank" rel="noreferrer">
            open the PDF in a new tab
          </a>
          .
        </p>
      </div>
    </>
  );
}

export default function UsefulPages() {
  const { pathname } = useLocation();
  if (pathname === "/contact")
    return (
      <section className="dna-useful-page dna-container">
        <ContactPage />
      </section>
    );
  if (pathname === "/faqs")
    return (
      <section className="dna-useful-page dna-container dna-shipping-page dna-reference-faq-page">
        <FAQPage />
      </section>
    );
  if (pathname === "/cannabis-seed-brochure")
    return (
      <section className="dna-useful-page dna-container">
        <BrochurePage />
      </section>
    );
  const page = pages[pathname];
  if (!page) return null;
  const isShippingPage = pathname === "/shipping-information";
  const isLoyaltyPage = pathname === "/loyalty-dna-points";
  const usesReferenceLayout = new Set([
    "/shipping-information",
    "/returns-refund-policy",
    "/privacy",
    "/terms-conditions",
    "/loyalty-dna-points",
  ]).has(pathname);
  return (
    <section
      className={`dna-useful-page dna-container${usesReferenceLayout ? " dna-shipping-page" : ""}${isShippingPage ? " dna-shipping-page--shipping" : ""}${isLoyaltyPage ? " dna-loyalty-page" : ""}`}
    >
      <p className="dna-useful-kicker">{page.title}</p>
      <h1>{page.title}</h1>
      <p className="dna-useful-intro">{page.intro}</p>
      {page.notice && !usesReferenceLayout && (
        <aside className="dna-useful-notice">{page.notice}</aside>
      )}
      <div className="dna-useful-copy">
        {page.sections.map(([heading, paragraphs]) => (
          <section key={heading}>
            <h2>{heading}</h2>
            {paragraphs.map((paragraph, index) =>
              typeof paragraph === "string" ? (
                <p key={index}>{paragraph}</p>
              ) : (
                paragraph
              ),
            )}
          </section>
        ))}
      </div>
      {page.notice && usesReferenceLayout && (
        <aside className="dna-useful-notice">{page.notice}</aside>
      )}
    </section>
  );
}
