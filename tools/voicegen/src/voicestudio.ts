import { z } from "zod";

const ProfileList = z.array(z.object({ id: z.string(), name: z.string() }));
const CreatedProfile = z.object({ id: z.string() });
const Transcription = z.object({ text: z.string() });

export type Wav = Uint8Array<ArrayBuffer>;

export type SpeechRequest = {
  text: string;
  seed: number;
  profileId?: string;
  instruct?: string;
};

export type VoiceStudio = ReturnType<typeof connectVoiceStudio>;

export function connectVoiceStudio(baseUrl: string) {
  async function send(path: string, init: RequestInit): Promise<Response> {
    const response = await fetch(`${baseUrl}${path}`, init);
    if (!response.ok) {
      throw new Error(`VoiceStudio ${init.method ?? "GET"} ${path} failed with ${response.status}: ${await response.text()}`);
    }
    return response;
  }

  return {
    /** Same request as VoiceStudio's Generate button, so a take sounds exactly like it does in the app (its broadcast polish and denoise included). */
    async speak({ text, seed, profileId, instruct }: SpeechRequest): Promise<Wav> {
      const form = new FormData();
      form.set("text", text);
      form.set("language", "Indonesian");
      form.set("seed", String(seed));
      if (profileId !== undefined) form.set("profile_id", profileId);
      if (instruct !== undefined) form.set("instruct", instruct);
      const response = await send("/generate", { method: "POST", body: form });
      return new Uint8Array(await response.arrayBuffer());
    },

    async transcribe(wav: Wav): Promise<string> {
      const form = new FormData();
      form.set("model", "whisper-1");
      form.set("language", "id");
      form.set("file", new Blob([wav], { type: "audio/wav" }), "clip.wav");
      const response = await send("/v1/audio/transcriptions", { method: "POST", body: form });
      return Transcription.parse(await response.json()).text;
    },

    async findProfile(name: string): Promise<string | undefined> {
      const response = await send("/profiles", { method: "GET" });
      return ProfileList.parse(await response.json()).find((profile) => profile.name === name)?.id;
    },

    async createCloneProfile({ name, referenceWav, referenceText }: { name: string; referenceWav: Wav; referenceText: string }): Promise<string> {
      const form = new FormData();
      form.set("name", name);
      form.set("kind", "clone");
      form.set("language", "Indonesian");
      form.set("ref_text", referenceText);
      form.set("ref_audio", new Blob([referenceWav], { type: "audio/wav" }), `${name}.wav`);
      const response = await send("/profiles", { method: "POST", body: form });
      return CreatedProfile.parse(await response.json()).id;
    },
  };
}
