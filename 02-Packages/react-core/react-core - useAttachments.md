---
title: "react-core - useAttachments"
type: symbol
layer: frontend
package: "@copilotkit/react-core"
source:
  - packages/react-core/src/v2/hooks/use-attachments.tsx
tags: [copilotkit, react-core, hook, attachments, files, layer/frontend, type/symbol, pkg/react-core]
---
# react-core - useAttachments

Manages file-attachment state for the chat input — selection, drag-and-drop, clipboard paste, validation, upload, and lifecycle. Powers the V2 chat input's attachment queue.

```ts
function useAttachments(props: { config?: AttachmentsConfig }): UseAttachmentsReturn
```

`UseAttachmentsReturn` exposes state (`attachments: Attachment[]`, `enabled`, `dragOver`), refs (`fileInputRef`, `containerRef`), event handlers (`handleFileUpload`, `handleDragOver`/`Leave`/`Drop`, `processFiles`), and queue ops (`removeAttachment(id)`, `consumeAttachments()`). All callbacks are **referentially stable** (`useCallback` reading config/attachments from refs) to avoid destabilizing downstream memoization.

**Processing (`processFiles`):** filters by `config.accept` (default `*/*`) via `matchesAcceptFilter` — rejects fire `onUploadFailed({ reason: "invalid-type" })`. Files over `config.maxSize` (default 20 MiB) fire `onUploadFailed({ reason: "file-too-large" })`. Valid files get a `"uploading"` placeholder (`Attachment` with a `randomUUID` id and modality from MIME type), then either `config.onUpload(file)` (custom storage, may return `metadata`) or a base64 data source via `readFileAsBase64`; videos also get a `generateVideoThumbnail`. On success the placeholder flips to `"ready"`; on failure it's removed and `onUploadFailed({ reason: "upload-failed" })` fires.

**Paste:** a `document`-level `paste` listener (active only when `enabled`) scoped to `containerRef` — pasted files matching `accept` are processed. **`consumeAttachments()`** returns the ready attachments, clears them from the queue, and resets the file input (no-op when empty).

All the helpers (`Attachment`, `AttachmentsConfig`, `matchesAcceptFilter`, `readFileAsBase64`, `getModalityFromMimeType`, `formatFileSize`, `generateVideoThumbnail`, `randomUUID`) come from [[shared - Attachments]] in [[@copilotkit/shared]]. This hook is web-DOM-bound, so it is **not** in the headless bundle ([[@copilotkit/react-native]] ships its own RN attachments hook). Links up to [[@copilotkit/react-core]].
