/** Sub-path the site is served from ("" at a root URL). next/link adds it on its own; plain URLs need it added. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
