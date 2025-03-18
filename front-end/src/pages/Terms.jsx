import React from "react";

const TermsOfUse = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Terms of Use</h1>
      <p className="text-gray-700 mb-4">Last Updated: [Date]</p>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
        <p className="text-gray-600">By registering for and using the Platform, you confirm that you have read, understood, and agreed to these Terms of Use and our Privacy Policy.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold">2. Eligibility</h2>
        <p className="text-gray-600">You must be at least 18 years old to use this Platform.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold">3. Account Registration</h2>
        <ul className="list-disc list-inside text-gray-600">
          <li>You must create an account using a valid email and password.</li>
          <li>You agree to provide accurate and updated information.</li>
          <li>You are responsible for maintaining account security.</li>
        </ul>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold">4. User Data & Uploads</h2>
        <p className="text-gray-600">Users retain ownership of their data but grant the Platform a license to process it.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold">5. Use of AI Predictions</h2>
        <p className="text-gray-600">The AI model’s results are informational and not medical advice.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold">6. Privacy and Security</h2>
        <p className="text-gray-600">We implement security measures to protect your data but cannot guarantee absolute security.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold">7. Contact Information</h2>
        <p className="text-gray-600">For questions, contact us at [Your Contact Email].</p>
      </section>
    </div>
  );
};

export default TermsOfUse;
