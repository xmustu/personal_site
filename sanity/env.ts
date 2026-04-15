const env = {
  apiVersion:
    process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
    process.env.SANITY_STUDIO_API_VERSION,
  dataset:
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    process.env.SANITY_STUDIO_DATASET,
  projectId:
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    process.env.SANITY_STUDIO_PROJECT_ID,
}

export const apiVersion = env.apiVersion || '2026-04-15'

export const dataset = assertValue(
  env.dataset,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET or SANITY_STUDIO_DATASET'
)

export const projectId = assertValue(
  env.projectId,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_STUDIO_PROJECT_ID'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
