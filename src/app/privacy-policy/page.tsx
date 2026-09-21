import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy - EOTC Bible',
  description: 'Privacy Policy for the EOTC Bible application',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header / Navigation */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Last updated: April 2026
          </p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-neutral-900 p-8 shadow-sm md:p-12">
          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              Welcome to the <strong className="text-gray-900 dark:text-white">EOTC Bible</strong> (Ethiopian Orthodox Tewahedo Church Bible) platform.
              Protecting your private information is our highest priority. This Privacy Policy explains how we collect, use, protect, and handle your personal information when you access or use our website and application.
            </p>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">1. Information We Collect</h2>
              <p>
                You can browse and read the Holy Scriptures on the EOTC Bible platform without creating an account or providing personal information.
              </p>
              <p className="mt-3">
                When you choose to create an account or sign in using <strong>Google Sign-In</strong> (or register with an email address and password), we collect basic profile information provided by Google with your explicit permission. This information includes:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 ml-2">
                <li><strong>Name:</strong> Used to personalize your account and display your name within the app.</li>
                <li><strong>Email Address:</strong> Used as your unique account identifier for authentication, account management, and important service communications.</li>
                <li><strong>Profile Picture:</strong> Where applicable, used to display your user avatar within your profile.</li>
              </ul>
              <p className="mt-3">
                Additionally, while using the authenticated features of the app, we store your personal app data, including:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 ml-2">
                <li>Bible reading progress and history</li>
                <li>Personal bookmarks, verse highlights, and study notes</li>
                <li>Active reading plans and daily completion status</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">2. How We Use Your Information</h2>
              <p>
                The information we collect is used <strong>solely</strong> for the following purposes:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 ml-2">
                <li>To authenticate your identity and securely create and manage your user account via Google Sign-In.</li>
                <li>To save and synchronize your Bible reading progress across multiple devices.</li>
                <li>To securely store and synchronize your personalized highlights, bookmarks, and notes.</li>
                <li>To maintain your enrolled reading plans and track reading milestones.</li>
                <li>To provide, maintain, and improve the personalized Bible study experience within the EOTC Bible app.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">3. Google User Data & Limited Use Policy</h2>
              <p>
                EOTC Bible&apos;s use and transfer to any other app of information received from Google APIs adheres to the{' '}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-700 underline hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </p>
              <p className="mt-3">
                We only request access to basic Google profile information (name, email address, profile photo) necessary for authentication and account management. We do not request or access any sensitive Google account data.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">4. Information Sharing & Third Parties</h2>
              <p>
                <strong>We do not sell, rent, lease, or trade your personal data to third parties.</strong>
              </p>
              <p className="mt-2">
                Your personal data is never sold or monetized. We do not share your personal information with advertisers, third-party marketers, or external entities, except where strictly necessary to operate the service (such as hosting infrastructure) or if required by applicable law.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">5. Data Retention & Deletion</h2>
              <p>
                We retain your account data and spiritual study records (reading progress, notes, bookmarks, highlights) for as long as your account remains active.
              </p>
              <p className="mt-3">
                You have the right to delete your account and all associated personal data at any time. You can delete your account directly within the app settings or by following our{' '}
                <Link href="/data-deletion" className="text-red-700 underline hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                  Data Deletion Instructions
                </Link>
                . You can also revoke EOTC Bible&apos;s access to your Google account at any time through your{' '}
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-700 underline hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Google Account Permissions
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">6. Contact Us</h2>
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="mt-3 rounded-lg bg-gray-50 dark:bg-neutral-800 p-4">
                <p>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:eotcopensource@gmail.com" className="text-red-700 underline hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                    eotcopensource@gmail.com
                  </a>
                </p>
                <p className="mt-1">
                  <strong>Location:</strong> Addis Ababa, Ethiopia
                </p>
              </div>
            </section>

            <hr className="my-8 border-gray-200 dark:border-neutral-800" />

            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
              <p>
                Last updated: April 2026
              </p>
              <div className="flex gap-4">
                <Link href="/terms-and-conditions" className="hover:text-gray-900 dark:hover:text-white underline">
                  Terms of Service
                </Link>
                <Link href="/data-deletion" className="hover:text-gray-900 dark:hover:text-white underline">
                  Data Deletion
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-gray-900 dark:hover:text-white">
            Home
          </Link>
          <Link href="/terms-and-conditions" className="hover:text-gray-900 dark:hover:text-white">
            Terms of Service
          </Link>
          <Link href="/data-deletion" className="hover:text-gray-900 dark:hover:text-white">
            Data Deletion Policy
          </Link>
          <a href="mailto:eotcopensource@gmail.com" className="hover:text-gray-900 dark:hover:text-white">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
