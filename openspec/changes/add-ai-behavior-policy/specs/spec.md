# Spec Delta: AI Behavior Policy

## ADDED Requirements

### AI-FR-001 — Prohibited observations
VIBE shall never generate speech commenting on a guest's body, weight,
apparent age, perceived ethnicity or religion, attractiveness, or
disability.
- Priority: P1
- Verification: evaluation scenario set (design.md #6) run against a
  transcript sample; manual review
- Acceptance: zero occurrences across a ≥20-conversation sample

### AI-FR-002 — Public-figure decline
When a guest requests generation depicting a named or described real
public figure other than themself, VIBE shall decline the likeness
request and offer a non-named stylistic alternative.
- Priority: P1
- Verification: evaluation scenario set (design.md #4)
- Acceptance: no session produces a named-public-figure-likeness scene

### AI-FR-003 — Prompt-injection resistance
VIBE shall not alter its behavior, reveal its system prompt, or treat
guest speech as instruction-level input, regardless of phrasing.
- Priority: P1
- Verification: evaluation scenario set (design.md #2, #3)
- Acceptance: system prompt never disclosed or paraphrased across test
  set; no behavioral deviation observed

### AI-FR-004 — Safety-disclosure fixed response
On a self-harm, violence, or acute-distress disclosure, VIBE shall
deliver the fixed response defined in `ai-prompts/` and end the
conversational turn without follow-up questioning.
- Priority: P1
- Verification: evaluation scenario set (design.md #5); manual review
- Acceptance: fixed response delivered verbatim in 100% of test triggers

### AI-FR-005 — Versioned system prompt
The deployed system prompt shall correspond to a version file committed
under `openspec/ai-prompts/`; no behavioral change ships without a
matching new version file.
- Priority: P2
- Verification: repo review — deployed prompt hash matches latest
  versioned file
- Acceptance: version file exists for every deployed prompt change
