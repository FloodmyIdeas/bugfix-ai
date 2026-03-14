// @ts-nocheck
export default function PrivacyPage() {
  const year = new Date().getFullYear()
  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#fafaf9', minHeight: '100vh', color: '#111' }}>
      <nav style={{ borderBottom: '1px solid #e8e8e4', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
        <a href="/" style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.5px', color: '#111' }}>bugfix.ai</a>
        <a href="/" style={{ fontSize: 13, color: '#6f6f6a' }}>Back to home</a>
      </nav>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '64px 24px 96px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-1.5px', marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ fontSize: 14, color: '#a3a39e', marginBottom: 48 }}>Last updated: March 2026</p>

        {[
          {
            title: '1. What we collect',
            body: 'When you create an account, we store your name, email address, and password locally in your browser\'s localStorage. This data never leaves your device and is not sent to or stored on our servers. Usage counts (fixes per day) are also stored locally in your browser.',
          },
          {
            title: '2. Your code',
            body: 'Code you submit is sent to our AI processing endpoint to generate a fix. This code is not logged, stored, or used for any purpose other than generating your fix. We do not retain copies of your code after the response is returned. We do not share your code with any third parties.',
          },
          {
            title: '3. Payments',
            body: 'Payments are handled by Stripe, Inc. We do not collect or store your credit card information. When you click to upgrade, you are redirected to a Stripe-hosted checkout page. Stripe\'s privacy policy governs how your payment information is handled.',
          },
          {
            title: '4. Cookies and tracking',
            body: 'We do not use advertising cookies or third-party tracking. We use browser localStorage to store your session and preferences locally on your device. No data is shared with advertisers.',
          },
          {
            title: '5. Third-party services',
            body: 'bugfix.ai uses Anthropic\'s Claude API to process code. Code you submit is subject to Anthropic\'s usage policies. We use Vercel for hosting. We use Stripe for payment processing.',
          },
          {
            title: '6. Data deletion',
            body: 'Since your account data is stored in your browser, you can delete it at any time by clearing your browser\'s localStorage, or using the "Reset account data" option on the sign-in page. To request deletion of any subscription data held by Stripe, email us at hi@bugfix.ai.',
          },
          {
            title: '7. Contact',
            body: 'If you have any questions about this privacy policy, email us at hi@bugfix.ai. We will respond within 5 business days.',
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, letterSpacing: '-0.3px' }}>{section.title}</h2>
            <p style={{ fontSize: 15, color: '#4a4a45', lineHeight: 1.75 }}>{section.body}</p>
          </div>
        ))}
      </div>

      <footer style={{ borderTop: '1px solid #e8e8e4', padding: '24px', textAlign: 'center', background: '#fff' }}>
        <div style={{ fontSize: 13, color: '#a3a39e' }}>
          <a href="/" style={{ color: '#6f6f6a', marginRight: 20 }}>Home</a>
          <a href="/terms" style={{ color: '#6f6f6a', marginRight: 20 }}>Terms of Service</a>
          <a href="mailto:hi@bugfix.ai" style={{ color: '#6f6f6a' }}>hi@bugfix.ai</a>
        </div>
        <div style={{ fontSize: 12, color: '#a3a39e', marginTop: 10 }}>&copy; {year} bugfix.ai</div>
      </footer>
    </div>
  )
}
