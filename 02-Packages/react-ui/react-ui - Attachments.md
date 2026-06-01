---
title: react-ui - Attachments
type: subsystem
layer: frontend
package: "@copilotkit/react-ui"
source:
  - packages/react-ui/src/components/chat/AttachmentQueue.tsx
  - packages/react-ui/src/components/chat/AttachmentRenderer.tsx
  - packages/react-ui/src/components/chat/attachment-utils.ts
  - packages/react-ui/src/components/chat/messages/ImageRenderer.tsx
  - packages/react-ui/src/components/chat/ImageUploadQueue.tsx
tags: [copilotkit, react-ui, attachments, multimodal, layer/frontend, type/subsystem, pkg/react-ui]
---
# react-ui - Attachments

File-attachment UI for the chat input (images, audio, video, documents) plus the V1→V2 deprecation bridge. The upload orchestration (drag/drop, paste, file picker, size/type validation, base64 reading) lives in [[react-ui - CopilotChat]]; this subsystem provides the presentational pieces and shared utilities. Part of [[@copilotkit/react-ui]].

**`AttachmentQueue`** (`AttachmentQueue.tsx`) — renders the pending-attachment strip below the messages: per-item preview + remove button + an uploading spinner overlay. Previews branch by modality:
- `image` → thumbnail `<img>`
- `audio` → `<audio controls>` + filename
- `video` → thumbnail image if available, else muted `<video>`
- `document` → an icon (`getDocumentIcon`) + filename + size (`formatFileSize`)

It resolves source URLs with `getSourceUrl` and the helpers above from [[@copilotkit/shared]]. Also re-exported as the deprecated alias **`ImageUploadQueue`** (since 1.56.0).

**`AttachmentRenderer`** (`AttachmentRenderer.tsx`) — renders an already-sent media part inside a [[react-ui - Messages]] `UserMessage`. Memoized per-modality subcomponents (`ImageAttachment` with error fallback, `AudioAttachment`, `VideoAttachment`, `DocumentAttachment`), each using `getSourceUrl` / `getDocumentIcon`.

**`attachment-utils.ts`** — re-exports the shared utilities (`getModalityFromMimeType`, `formatFileSize`, `exceedsMaxSize`, `readFileAsBase64`, `generateVideoThumbnail`, `matchesAcceptFilter`) from [[@copilotkit/shared]], and adds react-ui-specific `deprecationWarning(key, message)` (once-per-key, skipped in production) and `suppressDeprecationWarnings()` (exported from the package).

**`AttachmentsConfig` / `Attachment` / `AttachmentModality`** — the config + item types (re-exported from [[@copilotkit/shared]] via `props.ts`). `AttachmentsConfig` supports `enabled`, `accept`, `maxSize` (default 20 MB), `onUpload(file) => source`, and `onUploadFailed`.

**Deprecated image-only pieces** (since 1.56.0, superseded by the v2 attachment system in [[@copilotkit/react-core]]):
- **`ImageRenderer`** (`messages/ImageRenderer.tsx`) — renders an image from either a legacy `ImageData` (`image`) or a new `InputContentSource` (`source`), with an error fallback. Used for legacy image messages and exported from the package.
- **`ImageUploadQueue`** (`ImageUploadQueue.tsx`) — the old inline-styled image-only upload strip (distinct standalone component; the `AttachmentQueue` alias of the same name is the modern replacement).
- The deprecated props `imageUploadsEnabled`, `inputFileAccept`, and `ImageUpload` type on [[react-ui - CopilotChat]].
