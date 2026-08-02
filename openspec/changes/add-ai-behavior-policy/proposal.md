# Change: Add AI Behavior Policy

Status: Proposed

## Why

Every accepted and proposed spec so far governs image-generation behavior
or infrastructure. Nothing governs VIBE's *conversational* behavior — no
personality contract, no prompt-injection handling, no prohibited-topic
list, no public-figure handling, no safety-disclosure response, no
versioned system prompt. This is the largest category from the v0.1
review left entirely unaddressed.

## What Changes

- Define VIBE's personality contract and conversation boundaries.
- Define prohibited observations (no commentary on body/age/ethnicity/
  disability/etc.).
- Define public-figure request handling.
- Define prompt-injection handling (guest speech is content, never
  instruction).
- Define safety-disclosure response (self-harm/violence/distress).
- Require the system prompt to be versioned in-repo, not edited silently.
- Define a minimum conversational evaluation scenario set.

## Impact

- Affected spec: voice subsystem THINKING/SPEAKING states, DISCOVERY
  guest-journey state
- Affected requirements: new FR series under `ai-behavior`
- New artifact: `openspec/ai-prompts/` (versioned system prompt text)
