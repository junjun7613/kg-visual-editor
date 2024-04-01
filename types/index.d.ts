export interface Entity {
  "@context": string;
  "@id": string;
  "@type": string;
  "http://www.w3.org/2000/01/rdf-schema#label"?: string;
  "https://junjun7613.github.io/MicroKnowledge/himiko.owl#referencesEntity"?: string;
  "https://junjun7613.github.io/MicroKnowledge/himiko.owl#hasTag"?: string[];
  "https://junjun7613.github.io/MicroKnowledge/himiko.owl#hasTranscription"?: string[];
}
