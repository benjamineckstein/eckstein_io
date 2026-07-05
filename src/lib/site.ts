import { execSync } from 'node:child_process'

/**
 * Site-wide constants shared between the DE and EN pages, the legal pages
 * and the machine-readable files in public/. Kept in one place so nothing
 * drifts between languages.
 */

export const SITE_URL = 'https://eckstein.io'
export const REPO_URL = 'https://github.com/benjamineckstein/eckstein_io'
export const CONTACT_EMAIL = 'benjamin@eckstein.io'
export const CODEWITHAGENTS_URL = 'https://www.codewithagents.de/'
export const CODEWITHAGENTS_EN_URL = 'https://www.codewithagents.de/en/'
export const KI_SYNDIKAT_URL = 'https://www.ki-syndikat.de/'
export const GITHUB_URL = 'https://github.com/benjamineckstein'
export const GITHUB_ORG_URL = 'https://github.com/codewithagents'
export const NPM_ORG_URL = 'https://www.npmjs.com/org/codewithagents'
export const LINKEDIN_URL = 'https://www.linkedin.com/in/benjamin-eckstein-089326207'

/**
 * Short commit hash of the current build, used in the footer source link.
 * Falls back to "dev" when git is unavailable (e.g. a source tarball with no .git).
 */
export function getCommitHash(): string {
  try {
    return execSync('git rev-parse --short HEAD', {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return 'dev'
  }
}

/**
 * schema.org Person, identical in content to public/benjamin.json.
 * Embedded as JSON-LD in the head of both language variants.
 */
export const PERSON_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Benjamin Eckstein',
  givenName: 'Benjamin',
  familyName: 'Eckstein',
  jobTitle: 'Agentic Engineer',
  email: `mailto:${CONTACT_EMAIL}`,
  url: 'https://eckstein.io/',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kleinmachnow',
    addressCountry: 'DE',
  },
  sameAs: [
    CODEWITHAGENTS_URL,
    KI_SYNDIKAT_URL,
    GITHUB_URL,
    GITHUB_ORG_URL,
    NPM_ORG_URL,
    LINKEDIN_URL,
  ],
}
