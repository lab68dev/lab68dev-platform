export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: November 10, 2025</p>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site. Cookies allow us to recognize you, remember your preferences, and improve your experience on Lab68 Dev Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We use cookies for several purposes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>To enable certain functions of the Service</li>
              <li>To provide analytics and track usage patterns</li>
              <li>To store your preferences and settings</li>
              <li>To enhance security and prevent fraud</li>
              <li>To deliver relevant content and advertising</li>
              <li>To improve our Service and user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-medium mb-3 mt-4">3.1 Essential Cookies</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              These cookies are necessary for the website to function properly and cannot be disabled in our systems. They are usually only set in response to actions made by you which amount to a request for services.
            </p>
            <div className="bg-card border border-border p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Examples:</p>
              <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4">
                <li>Authentication cookies (keeping you logged in)</li>
                <li>Security cookies (protecting against attacks)</li>
                <li>Session management cookies</li>
              </ul>
            </div>

            <h3 className="text-xl font-medium mb-3 mt-4">3.2 Functional Cookies</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              These cookies enable enhanced functionality and personalization. They may be set by us or by third-party providers whose services we use on our pages.
            </p>
            <div className="bg-card border border-border p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Examples:</p>
              <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4">
                <li>Language preferences</li>
                <li>Theme preferences (dark/light mode)</li>
                <li>User interface customizations</li>
                <li>Video player preferences</li>
              </ul>
            </div>

            <h3 className="text-xl font-medium mb-3 mt-4">3.3 Analytics and Performance Cookies</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our Service.
            </p>
            <div className="bg-card border border-border p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Examples:</p>
              <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4">
                <li>Google Analytics (page views, session duration)</li>
                <li>Performance monitoring tools</li>
                <li>Error tracking and reporting</li>
                <li>A/B testing cookies</li>
              </ul>
            </div>

            <h3 className="text-xl font-medium mb-3 mt-4">3.4 Advertising and Targeting Cookies</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant ads on other sites.
            </p>
            <div className="bg-card border border-border p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Examples:</p>
              <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4">
                <li>Remarketing cookies</li>
                <li>Social media advertising pixels</li>
                <li>Ad conversion tracking</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We may use third-party service providers to help us analyze how our Service is used. These third parties may use cookies to collect information about your activities on our Service and other websites.
            </p>
            <div className="bg-card border border-border p-4 rounded-lg space-y-3">
              <div>
                <p className="font-medium mb-1">Google Analytics</p>
                <p className="text-sm text-muted-foreground">For website analytics and insights</p>
                <a href="https://policies.google.com/privacy" className="text-sm text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </div>
              <div>
                <p className="font-medium mb-1">Social Media Platforms</p>
                <p className="text-sm text-muted-foreground">For social sharing and login functionality</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Cookie Duration</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Cookies can be either "session" or "persistent" cookies:
            </p>
            <div className="space-y-4">
              <div className="bg-card border border-border p-4 rounded-lg">
                <p className="font-medium mb-2">Session Cookies</p>
                <p className="text-sm text-muted-foreground">
                  Temporary cookies that expire when you close your browser. They help us track your movements from page to page so you don't get asked for information you've already provided.
                </p>
              </div>
              <div className="bg-card border border-border p-4 rounded-lg">
                <p className="font-medium mb-2">Persistent Cookies</p>
                <p className="text-sm text-muted-foreground">
                  Remain on your device for a set period or until you delete them. They help us recognize you as a returning visitor and remember your preferences.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. How to Manage Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You have several options to manage or disable cookies:
            </p>

            <h3 className="text-xl font-medium mb-3 mt-4">6.1 Browser Settings</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Most web browsers allow you to control cookies through their settings. You can set your browser to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-3">
              <li>Block all cookies</li>
              <li>Block third-party cookies only</li>
              <li>Delete cookies when you close your browser</li>
              <li>Notify you when a cookie is set</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              Please note that if you disable cookies, some features of our Service may not function properly.
            </p>

            <h3 className="text-xl font-medium mb-3 mt-4">6.2 Opt-Out Tools</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You can opt out of certain cookies using these tools:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Google Analytics Opt-out Browser Add-on: <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Download here</a></li>
              <li>Network Advertising Initiative Opt-out Page: <a href="https://optout.networkadvertising.org/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Visit here</a></li>
              <li>Digital Advertising Alliance Opt-out Page: <a href="https://optout.aboutads.info/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Visit here</a></li>
            </ul>

            <h3 className="text-xl font-medium mb-3 mt-4">6.3 Mobile Device Settings</h3>
            <p className="text-muted-foreground leading-relaxed">
              On mobile devices, you can typically manage cookies and tracking through your device settings or through the app settings if you're using our mobile application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Do Not Track Signals</h2>
            <p className="text-muted-foreground leading-relaxed">
              Some browsers include a "Do Not Track" (DNT) feature that signals to websites you visit that you do not want to have your online activity tracked. Currently, there is no industry standard for how to respond to DNT signals. At this time, our Service does not respond to DNT signals.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Updates to This Cookie Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website with a new "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. More Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              If you have questions about our use of cookies or other tracking technologies, please contact us:
            </p>
            <ul className="list-none text-muted-foreground space-y-2 ml-4">
              <li>Email: lab68dev@gmail.com</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              For more information about cookies in general, you can visit <a href="https://www.allaboutcookies.org/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
