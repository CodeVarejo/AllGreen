/**
 * Centralized Application URL and Public Sharing Service
 * 
 * In Google AI Studio, the development preview (localhost:3000 or ais-dev-*) is sandboxed
 * and restricted to the active developer session. External devices, mobile phones, and clients
 * CANNOT open localhost or ais-dev URLs.
 * 
 * The Shared App URL (ais-pre-*) is the officially provisioned public endpoint that opens
 * globally without requiring authentication.
 */

export const SHARED_APP_URL = 'https://ais-pre-m2vczchqakz7oxww6isonk-590046030059.us-east1.run.app';

/**
 * Returns the public base URL suitable for external devices (smartphones, clients, QR codes).
 * Automatically replaces localhost, 127.0.0.1, and internal ais-dev domains with the public ais-pre endpoint.
 */
export function getPublicBaseUrl(): string {
  if (typeof window === 'undefined') {
    return SHARED_APP_URL;
  }

  const { hostname, origin } = window.location;

  // Check if running in a local or protected developer environment
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.includes('ais-dev-') ||
    hostname.includes('.corp.google.com') ||
    origin.includes('localhost') ||
    origin.includes('127.0.0.1')
  ) {
    return SHARED_APP_URL;
  }

  return origin;
}

/**
 * Generates the direct public URL for a specific project code (e.g., AG-8492)
 */
export function getProjectDirectUrl(projectCode: string): string {
  const base = getPublicBaseUrl();
  const cleanCode = (projectCode || '').trim().toUpperCase();
  return `${base}/?project=${encodeURIComponent(cleanCode)}`;
}

/**
 * Generates direct URLs for specific landing page sections
 */
export function getSectionDirectUrl(section: 'simulator' | 'quiz' | 'catalog' | 'projects' | 'roi'): string {
  const base = getPublicBaseUrl();
  return `${base}/#${section}`;
}
