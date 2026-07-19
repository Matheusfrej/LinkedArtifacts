import React from 'react'

export default function PrivacyPage() {
  const effectiveDate = '2026-07-19'

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Privacy Policy — LinkedArtifacts
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        <strong>Effective date:</strong> {effectiveDate}
      </p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Overview
        </h2>
        <p className="text-base text-gray-800 dark:text-gray-200">
          The LinkedArtifacts extension helps Google Scholar users find and
          access artifacts related to academic papers, such as source code,
          datasets, and project pages.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Data Collected
        </h3>
        <p className="text-base text-gray-800 dark:text-gray-200">
          The extension reads paper titles displayed on Google Scholar pages
          where it is active. This includes:
        </p>
        <ul className="list-disc ml-6 mt-2 text-gray-800 dark:text-gray-200">
          <li>paper titles shown in Google Scholar search results;</li>
          <li>paper titles shown on Google Scholar author profile pages.</li>
        </ul>
        <p className="mt-2 text-base text-gray-800 dark:text-gray-200">
          These titles are used only to look up matches in our API and determine
          whether artifacts are associated with the paper.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Use of Data
        </h3>
        <p className="text-base text-gray-800 dark:text-gray-200">
          The titles captured by the extension are sent to the LinkedArtifacts
          backend at{' '}
          <a
            className="text-blue-600"
            href="https://linkedartifacts.onrender.com"
          >
            https://linkedartifacts.onrender.com
          </a>{' '}
          so we can:
        </p>
        <ul className="list-disc ml-6 mt-2 text-gray-800 dark:text-gray-200">
          <li>identify whether an artifact is associated with the paper;</li>
          <li>retrieve the internal paper identifier;</li>
          <li>allow the user to open the corresponding artifacts page.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Transmission and Security
        </h3>
        <p className="text-base text-gray-800 dark:text-gray-200">
          All communication between the extension and the backend is performed
          over HTTPS. This ensures that data is transmitted securely.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Storage and Retention
        </h3>
        <p className="text-base text-gray-800 dark:text-gray-200">
          Data is used only at the time of the request and is not retained
          permanently by the extension on the user&apos;s device.
        </p>
        <p className="text-base text-gray-800 dark:text-gray-200">
          The backend may keep access logs securely for operational and service
          improvement purposes, but these logs are not used to personally
          identify users.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Data Sharing
        </h3>
        <p className="text-base text-gray-800 dark:text-gray-200">
          LinkedArtifacts does not share collected data with advertisers or
          third parties for monetization purposes.
        </p>
        <p className="text-base text-gray-800 dark:text-gray-200">
          Data may be processed by third-party service providers that support
          the operation of the service (for example, hosting providers), but
          only to provide extension functionality and maintain service security.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Transparency and Expected Usage
        </h3>
        <p className="text-base text-gray-800 dark:text-gray-200">
          The extension’s functionality is intended for users who want to access
          artifacts related to academic papers on Google Scholar.
        </p>
        <p className="text-base text-gray-800 dark:text-gray-200">
          Collection is limited to the minimum necessary to provide this
          functionality and occurs only on supported Google Scholar pages.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Support Contact
        </h3>
        <p className="text-base text-gray-800 dark:text-gray-200">
          For questions or support, please contact:{' '}
          <a className="text-blue-600" href="mailto:linkedartifacts@gmail.com">
            linkedartifacts@gmail.com
          </a>
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Policy Updates
        </h3>
        <p className="text-base text-gray-800 dark:text-gray-200">
          This policy may be updated at any time. The current version of the
          document should be available whenever the extension is published or
          updated.
        </p>
      </section>

      <footer className="mt-8 text-sm text-gray-600">
        © 2026 LinkedArtifacts. Not affiliated with Google Scholar.
      </footer>
    </main>
  )
}
