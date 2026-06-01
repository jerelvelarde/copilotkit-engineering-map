---
title: shared - Attachments
type: subsystem
layer: shared
package: "@copilotkit/shared"
source:
  - packages/shared/src/attachments/index.ts
  - packages/shared/src/attachments/types.ts
  - packages/shared/src/attachments/utils.ts
tags: [copilotkit, shared, attachments, multimodal, files, layer/shared, type/subsystem, pkg/shared]
---
# shared - Attachments

The framework-agnostic model and helpers for **file attachments** in the chat input — images, audio, video, documents. Built directly on the AG-UI multimodal `InputContent` parts re-exported by [[shared - Message Types]], so an attachment maps cleanly onto an `InputContentDataSource` (base64) or `InputContentUrlSource`. This is the replacement for the deprecated `AIMessage.image`/`ImageData` path (migrated in 1.56.0).

## Config & result types (`types.ts`)

```ts
interface AttachmentsConfig {
  enabled: boolean;
  accept?: string;        // MIME filter, default all
  maxSize?: number;       // bytes, default 20 * 1024 * 1024 (20MB)
  onUpload?: (file: File) => AttachmentUploadResult | Promise<AttachmentUploadResult>;
  onUploadFailed?: (error: AttachmentUploadError) => void;
}

type AttachmentUploadResult =          // returned by onUpload
  | { type: "data"; value: string; mimeType: string;  metadata?: Record<string, unknown> }
  | { type: "url";  value: string; mimeType?: string; metadata?: Record<string, unknown> };

type AttachmentUploadErrorReason = "file-too-large" | "invalid-type" | "upload-failed";
interface AttachmentUploadError { reason: AttachmentUploadErrorReason; file: File; message: string }
```

A custom `onUpload` lets apps push the file to their own storage and return either inline base64 (`type: "data"`) or a hosted URL (`type: "url"`), optionally attaching `metadata` that is merged into the resulting `InputContent` part.

## Runtime attachment shape

```ts
type AttachmentModality = "image" | "audio" | "video" | "document";
interface Attachment {
  id: string;
  type: AttachmentModality;
  source: InputContentDataSource | InputContentUrlSource;
  filename?: string;
  size?: number;
  status: "uploading" | "ready";
  thumbnail?: string;
  metadata?: Record<string, unknown>;
}
```

## Helpers (`utils.ts`)

All pure/browser-safe functions, exported from the package barrel:

- **`getModalityFromMimeType(mime)`** → `"image"|"audio"|"video"|"document"` by MIME prefix (defaults to `document`).
- **`formatFileSize(bytes)`** → human string (`B`/`KB`/`MB`).
- **`exceedsMaxSize(file, maxSize = 20MB)`** → boolean.
- **`readFileAsBase64(file)`** → `Promise<string>` (data-URL prefix stripped; rejects if empty).
- **`generateVideoThumbnail(file)`** → captures a frame at `0.1s` via an off-DOM `<video>`+`<canvas>` (JPEG @ 0.7); returns `undefined` outside a browser (`typeof document === "undefined"`), on error, or after a 10s timeout.
- **`matchesAcceptFilter(file, accept)`** → handles `*/*`, comma lists, `.ext` suffixes, and `type/*` wildcards.
- **`getSourceUrl(source)`** → for `type: "url"` returns the URL; for data returns `data:<mimeType>;base64,<value>`.
- **`getDocumentIcon(mime)`** → short label `PDF`/`XLS`/`PPT`/`DOC`/`TXT`/`FILE`.

The package barrel (`index.ts`) re-exports the config/result/`Attachment`/modality types and all eight helpers.

Part of [[@copilotkit/shared]]. The UI bindings build on these: [[@copilotkit/react-core]] `useAttachments`, [[@copilotkit/react-ui]] attachment components, and the React Native attachment hook all consume this config and these helpers. A repo codemod (`migrate-attachments`) automates the 1.56.0 migration off the deprecated `ImageData`/`AIMessage.image` fields in [[shared - Message Types]].
