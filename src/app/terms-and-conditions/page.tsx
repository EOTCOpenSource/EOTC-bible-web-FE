import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms and Conditions - EOTC Bible',
  description: 'Terms and Conditions for the EOTC Bible application',
}

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 dark:bg-neutral-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link
            href="/register"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Registration
          </Link>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl">
            Terms and Conditions
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            Please read these terms carefully before using the EOTC Bible application
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Last updated: April 2026
          </p>
        </div>

        {/* Content Card */}
        <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-neutral-900 md:p-12">
          <div className="space-y-8 text-gray-700 leading-relaxed dark:text-gray-300">

            {/* Introduction */}
            <section>
              <p className="text-base">
                Welcome to the <strong className="text-gray-900 dark:text-white">Ethiopian Orthodox Tewahedo Church Bible</strong>
                (&quot;EOTC Bible&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) application. These Terms and Conditions
                (&quot;Terms&quot;) govern your access to and use of our Bible application, website, and related services
                (collectively, the &quot;Service&quot;).
              </p>
              <p className="mt-3 text-base">
                By accessing or using the EOTC Bible application, you agree to be bound by these Terms.
                If you do not agree to these Terms, please do not access or use our Service.
              </p>
            </section>

            <hr className="border-gray-200 dark:border-neutral-800" />

            {/* 1. Acceptance of Terms */}
            <section>
              <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  1
                </span>
                <span className="ml-3">Acceptance of Terms</span>
              </h2>
              <p className="ml-14">
                By creating an account, accessing, browsing, or using the EOTC Bible application,
                you acknowledge that you have read, understood, and agree to be bound by these Terms
                and our Privacy Policy. If you are using the Service on behalf of an organization,
                you represent that you have authority to bind that organization to these Terms.
              </p>
            </section>

            {/* 2. Description of Service */}
            <section>
              <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  2
                </span>
                <span className="ml-3">Description of Service</span>
              </h2>
              <p className="ml-14">
                EOTC Bible is a digital Bible platform that provides access to the Holy Scriptures
                in multiple languages including Amharic, Ge&apos;ez, Tigrigna, and Oromiffa. The Service includes:
              </p>
              <ul className="mt-3 ml-14 list-inside list-disc space-y-2">
                <li>Reading and studying the Bible in multiple translations</li>
                <li>Creating personal bookmarks, highlights, and notes</li>
                <li>Daily reading plans and devotionals</li>
                <li>Verse of the day features</li>
                <li>Search functionality across scriptures</li>
                <li>Public and private note sharing</li>
                <li>Cross-device synchronization of personal data</li>
              </ul>
              <p className="mt-3 ml-14">
                We reserve the right to modify, suspend, or discontinue any part of the Service at any time.
              </p>
            </section>

            {/* 3. User Accounts */}
            <section>
              <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  3
                </span>
                <span className="ml-3">User Accounts</span>
              </h2>
              <div className="ml-14 space-y-3">
                <p>
                  <strong className="text-gray-900 dark:text-white">3.1 Account Creation:</strong> To access certain features,
                  you must create an account. You may register using:
                </p>
                <ul className="ml-4 list-inside list-disc space-y-1">
                  <li>Email and password</li>
                  <li>Google account (OAuth)</li>
                  <li>Facebook account (OAuth)</li>

                </ul>
                <p>
                  <strong className="text-gray-900 dark:text-white">3.2 Account Information:</strong> You agree to provide
                  accurate, current, and complete information during registration and to update such information as needed.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">3.3 Account Security:</strong> You are responsible for
                  safeguarding your password and for any activities or actions under your password. You agree not to share
                  your password with third parties.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">3.4 Age Requirement:</strong> You must be at least
                  13 years old (or the minimum age of digital consent in your country) to use this Service.
                </p>
              </div>
            </section>

            {/* 4. User Conduct */}
            <section>
              <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  4
                </span>
                <span className="ml-3">User Conduct</span>
              </h2>
              <p className="ml-14 mb-3">
                You agree not to use the Service to:
              </p>
              <ul className="ml-14 list-inside list-disc space-y-2">
                <li>Upload, post, or transmit any content that is unlawful, harmful, threatening, abusive, defamatory,
                  vulgar, obscene, or otherwise objectionable</li>
                <li>Impersonate any person or entity or falsely state or misrepresent your affiliation with a person or entity</li>
                <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
                <li>Attempt to gain unauthorized access to any portion of the Service or any systems or networks connected to the Service</li>
                <li>Use the Service for any commercial purpose without our prior written consent</li>
                <li>Harvest or collect any information about other users without their consent</li>
                <li>Remove any proprietary notices or labels on the Service</li>
              </ul>
            </section>

            {/* 5. Intellectual Property */}
            <section>
              <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  5
                </span>
                <span className="ml-3">Intellectual Property Rights</span>
              </h2>
              <div className="ml-14 space-y-3">
                <p>
                  <strong className="text-gray-900 dark:text-white">5.1 Our Property:</strong> The EOTC Bible application,
                  including its original content, features, functionality, logos, and branding, is owned by the Ethiopian
                  Orthodox Tewahedo Church and is protected by international copyright, trademark, and other intellectual
                  property laws.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">5.2 Bible Text:</strong> The Bible translations available
                  on this platform are provided under appropriate licenses from their respective copyright holders. Some
                  texts may be in the public domain.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">5.3 User Content:</strong> You retain ownership of any
                  notes, highlights, or other content you create. However, you grant us a license to store, display, and
                  synchronize this content across your devices.
                </p>
              </div>
            </section>

            {/* 6. Privacy */}
            <section>
              <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  6
                </span>
                <span className="ml-3">Privacy</span>
              </h2>
              <p className="ml-14">
                Your privacy is important to us. Please review our{' '}
                <Link href="/privacy-policy" className="text-red-700 underline hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                  Privacy Policy
                </Link>{' '}
                to understand how we collect, use, and protect your personal information. By using the Service,
                you consent to the collection and use of your information as described in the Privacy Policy.
              </p>
            </section>

            {/* 7. Disclaimer of Warranties */}
            <section>
              <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  7
                </span>
                <span className="ml-3">Disclaimer of Warranties</span>
              </h2>
              <p className="ml-14">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
                EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE
                UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE.
              </p>
            </section>

            {/* 8. Limitation of Liability */}
            <section>
              <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  8
                </span>
                <span className="ml-3">Limitation of Liability</span>
              </h2>
              <p className="ml-14">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE ETHIOPIAN ORTHODOX TEWAHEDO CHURCH SHALL NOT BE LIABLE
                FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS
                OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER
                INTANGIBLE LOSSES.
              </p>
            </section>

            {/* 9. Changes to Terms */}
            <section>
              <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  9
                </span>
                <span className="ml-3">Changes to These Terms</span>
              </h2>
              <p className="ml-14">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes
                by posting the new Terms on this page and updating the &quot;Last updated&quot; date. Your continued
                use of the Service after any changes constitutes acceptance of the new Terms.
              </p>
            </section>

            {/* 10. Termination */}
            <section>
              <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  10
                </span>
                <span className="ml-3">Termination</span>
              </h2>
              <p className="ml-14">
                We may terminate or suspend your account and access to the Service immediately, without prior notice
                or liability, for any reason, including if you breach these Terms. Upon termination, your right to
                use the Service will immediately cease. All provisions of these Terms that by their nature should
                survive termination shall survive.
              </p>
            </section>

            {/* 11. Governing Law */}
            <section>
              <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  11
                </span>
                <span className="ml-3">Governing Law</span>
              </h2>
              <p className="ml-14">
                These Terms shall be governed by and construed in accordance with the laws of Ethiopia, without regard
                to its conflict of law provisions. Any disputes arising from these Terms or the Service shall be
                resolved in the courts of Addis Ababa, Ethiopia.
              </p>
            </section>

            {/* 12. Contact Information */}
            <section>
              <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  12
                </span>
                <span className="ml-3">Contact Us</span>
              </h2>
              <p className="ml-14">
                If you have any questions about these Terms, please contact us at:{' '}
                <a href="mailto:eotcopensource@gmail.com" className="text-red-700 underline hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                  eotcopensource@gmail.com
                </a>
              </p>
            </section>

          </div>

          {/* Acceptance Section */}
          <div className="mt-12 rounded-xl bg-gray-50 p-6 text-center dark:bg-neutral-800">
            <p className="text-base text-gray-700 dark:text-gray-300">
              By using the EOTC Bible application, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Protected by applicable copyright and trademark laws</span>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/privacy-policy" className="hover:text-gray-900 dark:hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/data-deletion" className="hover:text-gray-900 dark:hover:text-white">
            Data Deletion Policy
          </Link>
          <a href="mailto:eyobgeremew618@gmail.com" className="hover:text-gray-900 dark:hover:text-white">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
