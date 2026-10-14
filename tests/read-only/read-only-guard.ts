/**
 * Re-export of the read-only guard so existing test imports keep working.
 * The implementation lives in `src/http/read-only-guard.ts` and is also
 * wired by `VirtuousClient` when `readOnly: true`.
 */
export {
  READ_ONLY_MAX_CALLS,
  requestPath,
  isReadOnlyHttpRequest,
  assertReadOnlyHttpRequest,
  axiosInstanceFromClient,
  attachReadOnlyGuard,
  sanitizeLiveError,
  liveStatus,
  isSkippableLiveError,
} from '../../src/http/read-only-guard';
export type { ReadOnlyGuardOptions } from '../../src/http/read-only-guard';
