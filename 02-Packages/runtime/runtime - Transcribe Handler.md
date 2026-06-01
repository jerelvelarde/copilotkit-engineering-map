---
title: runtime - Transcribe Handler
type: symbol
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/v2/runtime/handlers/handle-transcribe.ts
  - packages/runtime/src/v2/runtime/transcription-service/transcription-service.ts
tags: [copilotkit, runtime, transcribe, audio, voice, layer/runtime, type/symbol, pkg/runtime]
---
# runtime - Transcribe Handler

`handleTranscribe` backs the `POST …/transcribe` route — audio → text. It requires a `transcriptionService` on [[runtime - CopilotRuntime (v2)]]; in practice this is `TranscriptionServiceOpenAI` from [[@copilotkit/voice]] (Whisper). Part of [[@copilotkit/runtime]].

## Contract

The `TranscriptionService` interface (`transcription-service/transcription-service.ts`) is the runtime-side abstraction the handler calls:

```ts
transcriptionService.transcribeFile({ audioFile: File, mimeType, size }): Promise<string>
```

If no service is configured, the handler returns `503` (`SERVICE_NOT_CONFIGURED`).

## Input handling

Two body formats, chosen by `Content-Type`:
- **`multipart/form-data`** (REST mode) — reads the `audio` `File` field.
- **`application/json`** (single-route mode) — `{ audio: base64, mimeType, filename? }`, decoded to a `File` via `atob`.

Audio MIME types are validated against an allowlist (`audio/mpeg|mp3|mp4|wav|webm|ogg|flac|aac`, plus empty / `application/octet-stream`). Because browser `MediaRecorder` blobs often arrive with an empty type, the handler **re-stamps** them as `audio/webm` (the standard MediaRecorder default) so Whisper picks the right decoder instead of rejecting valid WebM Opus.

## Output & errors

Success → `{ text, size, type }` (200). Provider failures are run through `categorizeProviderError`, which maps message substrings to typed `TranscriptionErrors` (rate-limit → 429, auth → 401, too-long → 400, else provider error 500). The `TranscriptionErrorCode` → HTTP-status table comes from [[@copilotkit/shared]]'s transcription error types. The `audioFileTranscriptionEnabled` flag in `/info` reflects whether a service is wired ([[runtime - Handlers (run/connect/stop)]]).
