export const convertSemanticVersionToNumber = (version?: string) => {
  if (!version) return undefined
  const versionParts = version.split('.')

  // Convert to integers
  const major = parseInt(versionParts[0])
  const minor = parseInt(versionParts[1])
  const patch = parseInt(versionParts[2])

  // Join together into a number
  const versionNumber = major * 10000 + minor * 100 + patch
  return versionNumber
}
