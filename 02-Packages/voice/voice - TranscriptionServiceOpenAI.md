---
title: voice - TranscriptionServiceOpenAI
type: symbol
layer: runtime
package: "@copilotkit/voice"
source:
  - packages/voice/src/transcription/transcription-service-openai.ts
tags: [copilotkit, voice, transcription, openai, whisper, layer/runtime, type/symbol, pkg/voice]
---
# voice - TranscriptionServiceOpenAI

The only exported class of [[@copilotkit/voice]]. An **OpenAI Whisper** implementation of the runtime's abstract `TranscriptionService` (from `@copilotkit/runtime/v2`). Transcription only — there is no TTS counterpart in this package.

## Shape

```ts
export interface TranscriptionServiceOpenAIConfig {
  openai: OpenAI;        // required client instance
  model?: string;        // default "whisper-1"
  language?: string;     // ISO-639-1, e.g. "en" — improves accuracy & latency
  prompt?: string;       // style/context hint; should match audio language
  temperature?: number;  // 0..1; lower = more deterministic
}

export class TranscriptionServiceOpenAI extends TranscriptionService {
  constructor(config: TranscriptionServiceOpenAIConfig);
  async transcribeFile(options: TranscribeFileOptions): Promise<string>;
}
```

## Responsibility

Implement the single abstract method `transcribeFile(options)` defined by the base `TranscriptionService` (see [[runtime - Transcribe Handler]] for where it is invoked). It forwards the audio to OpenAI's speech-to-text endpoint and returns the recognized text.

## Behavior (from source)

- **Constructor** stores the config. `this.openai = config.openai ?? new OpenAI()` (falls back to a default-constructed client, which reads `OPENAI_API_KEY` from the environment), `model` defaults to `"whisper-1"`, and `language`/`prompt`/`temperature` are optional passthroughs.
- **`transcribeFile`** calls `this.openai.audio.transcriptions.create({ file: options.audioFile, model: this.model, ... })`, conditionally spreading `language`, `prompt`, and `temperature` only when set (so unset options aren't sent), then returns `response.text`.
- `TranscribeFileOptions` (defined in the runtime) carries `audioFile: File` plus optional `mimeType` and `size`; this implementation uses only `audioFile`.

## Collaborators

- Base class **`TranscriptionService`** and **`TranscribeFileOptions`** — imported from [[@copilotkit/runtime]] via its `/v2` export (`packages/runtime/src/v2/runtime/transcription-service/transcription-service.ts`).
- `openai` SDK — `OpenAI.audio.transcriptions.create`.
- Registered on [[runtime - CopilotRuntime (v2)]] as `transcriptionService`; driven by [[runtime - Transcribe Handler]].

## Where used

Application code constructs it and passes it to the runtime, e.g.:

```ts
new CopilotRuntime({
  agents: { default: yourAgent },
  transcriptionService: new TranscriptionServiceOpenAI({
    openai: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
  }),
});
```

To use a non-OpenAI provider, subclass `TranscriptionService` directly instead of this class (implement your own `transcribeFile`).
