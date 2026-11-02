export interface FixFilenameOptions {
  /** Word separator. Default: '-'. */
  separator?: '-' | '_';
  /** Convert to lowercase. Default: true. */
  lowercase?: boolean;
}
/** Clean one filename. Throws for paths, invalid options, or oversized output. */
export declare function fixFilename(filename: string, options?: FixFilenameOptions): string;
