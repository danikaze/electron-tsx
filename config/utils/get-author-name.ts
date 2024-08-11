import packageJson from '../../package.json';

/**
 * Get the author from `package.json` and return the author's name, if any
 *
 * When it's a string, anything between `<*>` (email) and `(*)` (url) will be
 * removed
 *
 * When provided an object, only the `name` field will be returned
 *
 * @param author `author` field from `package.json`
 * @returns stripped author's name from `package.json`
 */
export function getAuthorName(): string | undefined {
  const author = packageJson.author as { name: string } | string | undefined;
  if (!author) return;
  if (typeof author === 'string') {
    return author
      .replace(/<[^>]*>/, '')
      .replace(/\([^)]*\)/, '')
      .trim();
  }
  return author.name;
}
