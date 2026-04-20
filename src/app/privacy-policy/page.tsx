import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - EOTC Bible',
  description: 'Privacy Policy for the EOTC Bible application',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white dark:bg-neutral-900 p-8 shadow-sm md:p-12">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
          Privacy Policy
        </h1>

        <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            Welcome to the EOTC Bible (Ethiopian Orthodox Tewahedo Church Bible) platform. 
            Protecting your private information is our priority.
          </p>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Information We Collect</h2>
            <p>
              When you use our application and choose to log in via Facebook Login (or other social providers), 
              we collect basic profile information to create and manage your account. This information includes:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 ml-2">
              <li>Your Name</li>
              <li>Your Email Address</li>
              <li>Your Profile Picture</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">How We Use Your Information</h2>
            <p>
              The basic profile information we collect is used <strong>solely</strong> to:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 ml-2">
              <li>Create and securely manage your user account.</li>
              <li>Save and sync your personal reading progress across devices.</li>
              <li>Store your personalized highlights, bookmarks, and notes securely.</li>
              <li>Provide a personalized experience within the EOTC Bible app.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Information Sharing</h2>
            <p>
              <strong>We do not sell, rent, or lease your personal data to third parties.</strong>
              Your information is kept secure and is only used to provide the core functionality 
              of the EOTC Bible application.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Contact Us</h2>
            <p>
              If you have any questions or concerns regarding our privacy practices, please contact us at:{' '}
              <a href="mailto:eotcopensource@gmail.com" className="text-[#621B1C] dark:text-red-400 hover:underline font-medium">
                eotcopensource@gmail.com
              </a>
            </p>
          </section>

          <hr className="my-8 border-gray-200 dark:border-neutral-800" />
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: March 2026
          </p>
        </div>
      </div>
    </div>
  )
}
