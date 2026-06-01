---
title: react-native - useAttachments
type: symbol
layer: frontend
package: "@copilotkit/react-native"
source:
  - packages/react-native/src/hooks/use-attachments.ts
tags: [copilotkit, react-native, attachments, hook, expo, frontend, layer/frontend, type/symbol, pkg/react-native]
---
# react-native - useAttachments

The React Native counterpart of [[react-core - useAttachments]]. It manages multimodal file-attachment state — picking, validating, reading/uploading, and lifecycle — replacing the web APIs (`FileReader`, `DragEvent`, `HTMLInputElement`) with **Expo modules** (`expo-document-picker`, `expo-file-system`). Both are **optional** peer deps. Used internally by [[react-native - CopilotChat/Sidebar/Popup/Modal]]; exported from [[@copilotkit/react-native]].

```ts
function useAttachments(props: UseNativeAttachmentsProps): UseNativeAttachmentsReturn
```

All returned callbacks are referentially stable (`useCallback`); latest `config` and `attachments` are read through refs.

## Types

- **`NativeFileInput`** — platform-neutral file descriptor that replaces the web `File`: `{ uri, name, size, mimeType }`.
- **`NativeAttachmentsConfig`** — RN variant of the shared `AttachmentsConfig`: `enabled`, `accept?` (default all), `maxSize?` (default **20 MB**), `onUpload?(file: NativeFileInput) => AttachmentUploadResult | Promise<…>`, `onUploadFailed?({ reason, file, message })`. Differs from the web config only in that callbacks receive a `NativeFileInput` instead of a `File`.
- **`UseNativeAttachmentsProps`** — `{ config?: NativeAttachmentsConfig }`.
- **`UseNativeAttachmentsReturn`** — `attachments: Attachment[]`, `enabled`, `openPicker()`, `processFiles(files)`, `removeAttachment(id)`, `consumeAttachments()`.

`Attachment`, `AttachmentUploadResult`, `AttachmentUploadErrorReason`, plus helpers `getModalityFromMimeType`, `formatFileSize`, and `randomUUID` all come from [[@copilotkit/shared]] (see [[shared - Attachments]]).

## Behavior

- **`openPicker()`** — splits `accept` (comma-separated) into a type array and calls `DocumentPicker.getDocumentAsync({ type, copyToCacheDirectory: true, multiple: true })`. On cancel / empty it returns; otherwise maps each asset to a `NativeFileInput` (defaulting `name → "unknown"`, `size → 0`, `mimeType → "application/octet-stream"`) and forwards to `processFiles`. Picker errors are logged, not thrown.
- **`processFiles(files)`** — for each file:
  1. **Accept filter** via `matchesAccept` (supports `*/*`, `image/*`-style wildcards, exact MIME, and `.ext` suffixes; comma lists). Rejected files fire `onUploadFailed({ reason: "invalid-type" })`.
  2. **Size check** against `maxSize`; over-size fires `onUploadFailed({ reason: "file-too-large" })` and skips.
  3. Inserts an `"uploading"` placeholder `Attachment` (modality from `getModalityFromMimeType`, empty `data` source).
  4. If `onUpload` is provided, awaits it and splits off `metadata` from the returned source; **otherwise** reads the file as base64 via `FileSystem.readAsStringAsync(uri, { encoding: Base64 })` into a `{ type: "data", value, mimeType }` source.
  5. On success, patches the placeholder to `status: "ready"` with the resolved `source`/`metadata`. On failure, removes the placeholder, logs, and fires `onUploadFailed({ reason: "upload-failed" })`.
- **`removeAttachment(id)`** — drops one attachment by id.
- **`consumeAttachments()`** — returns the `"ready"` attachments and removes them from state (leaving any still `"uploading"`). This is what `CopilotChat.submitMessage` calls to attach files to the outgoing message.

## Collaborators

- `expo-document-picker`, `expo-file-system` — optional Expo peers; aliased to stubs under `src/__tests__/__mocks__/` in tests.
- [[shared - Attachments]] — `Attachment`, result/error types, `getModalityFromMimeType`, `formatFileSize`.
- [[react-native - CopilotChat/Sidebar/Popup/Modal]] — the consumer that wires `openPicker`/`removeAttachment`/`consumeAttachments` into the chat context.
- [[react-core - useAttachments]] — the web equivalent this mirrors.
