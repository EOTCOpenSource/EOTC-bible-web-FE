import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Data Deletion - EOTC Bible',
  description: 'Instructions on how to request data deletion for your EOTC Bible account',
}

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-neutral-950">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm md:p-12 dark:bg-neutral-900">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
          Data Deletion Instructions
        </h1>

        <div className="space-y-6 leading-relaxed text-gray-700 dark:text-gray-300">
          <p>
            At EOTC Bible, we respect your privacy and your right to control your personal data. You
            can request complete deletion of your account and all associated data (including your
            reading progress, bookmarks, notes, and highlights) at any time.
          </p>

          <section className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Method 1: Delete via the App
            </h2>
            <p className="mb-4">
              You can delete your account directly through the application by following these steps:
            </p>

            <ol className="list-decimal space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-6 pl-5 dark:border-neutral-700 dark:bg-neutral-800">
              <li className="font-medium text-gray-900 dark:text-white">
                Log into the EOTC Bible app.
              </li>
              <li className="font-medium text-gray-900 dark:text-white">
                Navigate to your Profile / Settings.
              </li>
              <li className="font-medium text-gray-900 dark:text-white">
                Click the{' '}
                <span className="font-semibold text-red-600 dark:text-red-400">
                  &quot;Delete Account&quot;
                </span>{' '}
                button.
              </li>
            </ol>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Note: Deleting your account via the app will immediately and permanently remove all
              your data from our servers.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Method 2: Request via Email
            </h2>
            <p>Alternatively, you can request data deletion by emailing our support team.</p>
            <div className="mt-4 rounded-lg border border-[#621B1C]/10 bg-[#621B1C]/5 p-6 dark:border-neutral-700 dark:bg-neutral-800">
              <p className="mb-2">
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:eotcopensource@gmail.com"
                  className="text-[#621B1C] hover:underline dark:text-red-400"
                >
                  eotcopensource@gmail.com
                </a>
              </p>
              <p className="mb-2">
                <strong>Subject:</strong> Data Deletion Request
              </p>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Please ensure you send the email from the address linked to your EOTC Bible account
                so we can verify your identity. We will process your data deletion request and
                remove your data within <strong>7 business days</strong>.
              </p>
            </div>
          </section>

          <hr className="my-8 border-gray-200 dark:border-neutral-800" />

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} EOTC Bible. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
