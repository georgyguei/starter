/* oxlint-disable no-useless-escape: ⚠️  DO NOT remove backslash escapes in character classes (e.g. [+\-], [\x20\-]).
 * These are REQUIRED for the HTML pattern attribute which compiles with the `v` (unicodeSets) flag.
 * In `v` mode, unescaped hyphens in non-edge positions create ranges: [+-] → range from + to -.
 * Preserve v-flag compatible escapes.
 */

export const brlCurrencyRegex = /^[+-]?R\$\s?\d{1,3}(?:\.\d{3})*,\d{2}$/;
export const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
export const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
export const currencyRegex = /^[+-]?\$\s?\d{1,3}(?:,\d{3})*\.\d{2}$/;
export const datetimeRegex = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;
export const decimalRegex = /^[+-]?\d+(?:\.\d+)?$/;
export const emailRegex = /^[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
export const integerRegex = /^[+-]?\d+$/;
export const ipRegex = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
export const macRegex = /^(?:[0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;
export const numericRegex = /^[+-]?\d+(?:\.\d+)?$/;
export const percentageRegex = /^[+-]?\d+\s*%$/;
export const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
export const urlRegex = /^(https?|ftp):\/\/\S+$/;

// -- Additional common input regex patterns --

/** US phone: (123) 456-7890 or 123-456-7890 */
// oxlint-disable-next-line no-useless-escape
export const phoneRegex = /^\(?\d{3}\)?[\x20\-]?\d{3}[\x20\-]?\d{4}$/;

/** Credit card: 16 digits with space grouping (e.g. 1234 5678 9012 3456) */
export const creditCardRegex = /^\d{4}\x20\d{4}\x20\d{4}\x20\d{4}$/;

/** Hex color: #RGB, #RRGGBB, or #RRGGBBAA */
export const hexColorRegex = /^#(?:[0-9A-Fa-f]{3,4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

/** US ZIP code: 12345 or 12345-6789 */
// oxlint-disable-next-line no-useless-escape
export const zipCodeRegex = /^\d{5}(?:[\x20\-]\d{4})?$/;

/** Date only: YYYY-MM-DD */
export const dateRegex = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;

/** Time: HH:MM or HH:MM:SS */
export const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;

/** Username: alphanumeric + underscore, 3–20 characters */
export const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

/** URL slug: lowercase alphanumeric with single hyphens between segments */
export const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** UUID v4 */
export const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

/** Semantic versioning: major.minor.patch with optional pre-release and build metadata */
export const semverRegex = /^\d+\.\d+\.\d+(?:-[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*)?(?:\+[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*)?$/;

// -- Infrastructure regexes --

/** Dotted domain hostname only — rejects IP literals, localhost, .local and
 * numeric host tricks. Used for SSRF-safe image host validation. */
export const domainHostnameRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i;

/** JSX `className=` attribute name — for demo HTML → plain HTML conversion. */
export const classNameAttributeRegex = /className=/g;

/** Everything from the first `/` onward — strips a MIME subtype or path segment. */
export const slashSuffixRegex = /\/.*$/;

/** Converts an anchored validation regex into an HTML `pattern` attribute
 * value — anchors are implicit in the attribute, so they are stripped. */
export function regexToPattern(regex: RegExp): string {
  return regex.source.replace(/^\^|\$$/g, "");
}
