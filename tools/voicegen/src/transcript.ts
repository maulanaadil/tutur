/**
 * Indonesian word-final "k" is a glottal stop; Whisper transcribed our "kakak" clip as "Kaka".
 * Dropping it on both sides keeps that from counting as a mispronunciation.
 */
function dropFinalGlottalStop(word: string): string {
  return word.replace(/k$/, "");
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .split(/\s+/)
    .map((word) => dropFinalGlottalStop(word.replace(/[^\p{Letter}\p{Number}]/gu, "")))
    .join("");
}

export function transcriptMatches(transcript: string, acceptedTranscripts: readonly string[]): boolean {
  const heard = normalize(transcript);
  return heard.length > 0 && acceptedTranscripts.some((text) => normalize(text) === heard);
}
