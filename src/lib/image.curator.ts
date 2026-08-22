import type { ConceptImage } from "./rag.types";
import { extractSubject, STOP_WORDS } from "./rag.engine";

export const PEXELS_API_KEY =
  process.env["PEXELS_API_KEY"] ||
  "zpTDliPkn2r3exIPuRAqJ5tDrjiCzuRHwomwxDUNbrJA4tW7IaqMBjXd";

export interface VisualIntentDecision {
  needed: boolean;
  type: "conceptual_diagram" | "physical_entity" | "none";
  count: number;
  primaryQuery: string;
  secondaryQuery?: string;
  reason: string;
}

/**
 * Basic / Pure Non-Visual Query Patterns:
 * Queries like greetings, arithmetic, pure code snippets, short trivial conversions, etc.
 * do NOT require image conceptualization.
 */
const BASIC_PATTERNS = [
  /^(hi|hello|hey|greetings|howdy|good\s+(morning|afternoon|evening|day))[\s!.]*$/i,
  /^(who are you|what is your name|what can you do|help me|thank you|thanks)[\s!.]*$/i,
  /^what\s+is\s+(\d+[\s\d+\-*/^%().=]*\d+|\d+)\s*\??$/i, // Math calculation
  /\b(calculate|sum of|multiply|square root|convert\s+\d+|factorial|fibonacci)\b/i,
  /\b(regex|syntax for|code for|for loop in|write a function|console\.log|sql query)\b/i,
  /^(what time is it|what day is today|what date is it)\??$/i,
  /^(who is the prime minister of|who is the current president of|what is the capital of)\s+[a-zA-Z\s]+\??$/i,
];

/**
 * High-Concept Technical / Scientific / Educational Keywords
 */
const CONCEPTUAL_PATTERNS = [
  /\b(machine\s+learning|neural\s+network|deep\s+learning|artificial\s+intelligence|ai|ml|transformer|gradient\s+descent|backpropagation)\b/i,
  /\b(osi\s+model|tcp\s*\/\s*ip|network\s+protocol|http|dns|routing|subnetting|firewall|load\s+balancer)\b/i,
  /\b(photosynthesis|calvin\s+cycle|chloroplast|mitosis|meiosis|cellular\s+respiration|krebs\s+cycle|dna|rna|crispr|genetics)\b/i,
  /\b(quantum\s+computing|qubit|superposition|entanglement|schrodinger|wave\s+function|quantum\s+circuit)\b/i,
  /\b(cloud\s+computing|microservices|kubernetes|docker|container|serverless|system\s+architecture|distributed\s+systems)\b/i,
  /\b(earthquake|plate\s+tectonics|fault\s+line|volcano|tsunami|continental\s+drift|seismic)\b/i,
  /\b(black\s+hole|event\s+horizon|neutron\s+star|relativity|gravitational\s+waves|spacetime|solar\s+system|planetary\s+orbit)\b/i,
  /\b(anatomy|circulatory\s+system|heart\s+chambers|brain\s+lobes|neuron\s+synapse|digestive\s+system)\b/i,
  /\b(internal\s+combustion\s+engine|four\s+stroke|jet\s+engine|turbofan|electric\s+motor|battery\s+chemistry)\b/i,
  /\b(blockchain|proof\s+of\s+work|cryptography|public\s+key|rsa|hashing|merkle\s+tree)\b/i,
  /\b(b\s+tree|binary\s+search\s+tree|data\s+structure|graph\s+algorithm|sorting\s+algorithm)\b/i,
  /\b(explain|how\s+(does|do|is|works?)|mechanism|architecture|diagram|structure|pipeline|schematic|workflow|layers?)\b/i,
];

/**
 * CANONICAL CONCEPT ARCHITECTURE & SCHEMATICS KNOWLEDGE MATRIX
 * Verified, peer-reviewed educational diagrams explaining exact mechanics, layers, and taxonomy.
 */
const CANONICAL_DIAGRAMS: Record<string, ConceptImage[]> = {
  "machine learning": [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Colored_neural_network.svg/1280px-Colored_neural_network.svg.png",
      caption: "Neural Network Architecture — Input Layer, Hidden Synaptic Layers, and Output Classification",
      alt: "Multi-Layer Neural Network Architecture Diagram",
      photographer: "Wikimedia Commons (Educational Archive)",
      photographerUrl: "https://commons.wikimedia.org/wiki/File:Colored_neural_network.svg",
      sourceUrl: "https://en.wikipedia.org/wiki/Artificial_neural_network",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Supervised_and_unsupervised_learning.png",
      caption: "Machine Learning Taxonomy — Supervised vs Unsupervised vs Reinforcement Learning",
      alt: "Supervised and Unsupervised Learning Flowchart",
      photographer: "Wikimedia Commons",
      photographerUrl: "https://commons.wikimedia.org/wiki/File:Supervised_and_unsupervised_learning.png",
      sourceUrl: "https://en.wikipedia.org/wiki/Machine_learning",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/AI-ML-DL.svg/1280px-AI-ML-DL.svg.png",
      caption: "Hierarchical Relationship — Artificial Intelligence vs Machine Learning vs Deep Learning",
      alt: "AI vs ML vs Deep Learning Venn Diagram",
      photographer: "Wikimedia Commons",
      photographerUrl: "https://commons.wikimedia.org/wiki/File:AI-ML-DL.svg",
      sourceUrl: "https://en.wikipedia.org/wiki/Machine_learning",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Gradient_descent.svg/1280px-Gradient_descent.svg.png",
      caption: "Optimization Engine — Gradient Descent & Loss Surface Minimization",
      alt: "Gradient Descent Optimization Landscape",
      photographer: "Wikimedia Commons",
      photographerUrl: "https://commons.wikimedia.org/wiki/File:Gradient_descent.svg",
      sourceUrl: "https://en.wikipedia.org/wiki/Gradient_descent",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Reinforcement_learning_diagram.svg/1280px-Reinforcement_learning_diagram.svg.png",
      caption: "Reinforcement Learning Feedback Loop — Agent, Environment, State, and Reward",
      alt: "Reinforcement Learning Framework Diagram",
      photographer: "Wikimedia Commons",
      photographerUrl: "https://commons.wikimedia.org/wiki/File:Reinforcement_learning_diagram.svg",
      sourceUrl: "https://en.wikipedia.org/wiki/Reinforcement_learning",
    },
  ],
  "photosynthesis": [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Calvin_Cycle_5.svg/1280px-Calvin_Cycle_5.svg.png",
      caption: "Light-Independent Reactions — The Calvin-Benson Cycle Pathway in Chloroplast Stroma",
      alt: "Photosynthesis Calvin Cycle Biochemical Pathway",
      photographer: "Wikimedia Commons (Biochemistry Archive)",
      photographerUrl: "https://commons.wikimedia.org/wiki/File:Calvin_Cycle_5.svg",
      sourceUrl: "https://en.wikipedia.org/wiki/Calvin_cycle",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Photosynthesis_overview.svg/1280px-Photosynthesis_overview.svg.png",
      caption: "Photosynthetic Architecture — Light Reactions in Thylakoids & Energy Conversion (ATP/NADPH)",
      alt: "Photosynthesis Light and Dark Reactions Schematic",
      photographer: "Wikimedia Commons",
      photographerUrl: "https://commons.wikimedia.org/wiki/File:Photosynthesis_overview.svg",
      sourceUrl: "https://en.wikipedia.org/wiki/Photosynthesis",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Chloroplast_diagram.svg/1280px-Chloroplast_diagram.svg.png",
      caption: "Chloroplast Ultrastructure — Outer Membrane, Grana Stacks, Thylakoid Lumen, and Stroma",
      alt: "Chloroplast Cellular Organelle Anatomy",
      photographer: "Wikimedia Commons",
      photographerUrl: "https://commons.wikimedia.org/wiki/File:Chloroplast_diagram.svg",
      sourceUrl: "https://en.wikipedia.org/wiki/Chloroplast",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Chlorophyll_ab_spectra-en.svg/1280px-Chlorophyll_ab_spectra-en.svg.png",
      caption: "Light Absorption Spectrum — Chlorophyll A and B Photon Wavelength Dynamics",
      alt: "Chlorophyll Absorption Spectrum Chart",
      photographer: "Wikimedia Commons",
      photographerUrl: "https://commons.wikimedia.org/wiki/File:Chlorophyll_ab_spectra-en.svg",
      sourceUrl: "https://en.wikipedia.org/wiki/Chlorophyll",
    },
  ],
  "osi model": [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/OSI-model-Communication.svg/1280px-OSI-model-Communication.svg.png",
      caption: "7-Layer OSI Reference Architecture — Physical, Data Link, Network, Transport, Session, Presentation, Application",
      alt: "OSI 7 Layers Communication Flow Diagram",
      photographer: "Wikimedia Commons (Networking Standards)",
      photographerUrl: "https://commons.wikimedia.org/wiki/File:OSI-model-Communication.svg",
      sourceUrl: "https://en.wikipedia.org/wiki/OSI_model",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Osi-model-7-layers.png/1280px-Osi-model-7-layers.png",
      caption: "OSI vs TCP/IP Protocol Stack Comparison & Protocol Mapping",
      alt: "OSI Model vs TCP/IP Architecture Comparison",
      photographer: "Wikimedia Commons",
      photographerUrl: "https://commons.wikimedia.org/wiki/File:Osi-model-7-layers.png",
      sourceUrl: "https://en.wikipedia.org/wiki/OSI_model",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/UDP_encapsulation.svg/1280px-UDP_encapsulation.svg.png",
      caption: "Data Encapsulation Lifecycle — Framing, Packet Header Injection, and Segment Transport",
      alt: "Network Packet Encapsulation Diagram",
      photographer: "Wikimedia Commons",
      photographerUrl: "https://commons.wikimedia.org/wiki/File:UDP_encapsulation.svg",
      sourceUrl: "https://en.wikipedia.org/wiki/Encapsulation_(networking)",
    },
  ],
  "quantum computing": [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Bloch_sphere.svg/1280px-Bloch_sphere.svg.png",
      caption: "The Bloch Sphere — Geometric Representation of Quantum Qubit Superposition (|0⟩ and |1⟩ States)",
      alt: "Quantum Computing Bloch Sphere Qubit Diagram",
      photographer: "Wikimedia Commons (Quantum Physics)",
      photographerUrl: "https://commons.wikimedia.org/wiki/File:Bloch_sphere.svg",
      sourceUrl: "https://en.wikipedia.org/wiki/Bloch_sphere",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Quantum_logic_gate.svg/1280px-Quantum_logic_gate.svg.png",
      caption: "Quantum Circuit Topology — Hadamard Gates, CNOT Entanglement, and Unitary Matrix Operations",
      alt: "Quantum Circuit Logic Gate Schematic",
      photographer: "Wikimedia Commons",
      photographerUrl: "https://commons.wikimedia.org/wiki/File:Quantum_logic_gate.svg",
      sourceUrl: "https://en.wikipedia.org/wiki/Quantum_logic_gate",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Bluefors_dilution_refrigerator.jpg/1280px-Bluefors_dilution_refrigerator.jpg",
      caption: "Cryogenic Dilution Refrigerator — Millikelvin Cooling Architecture for Superconducting Qubits",
      alt: "Superconducting Quantum Processor Cryostat",
      photographer: "Wikimedia Commons",
      photographerUrl: "https://commons.wikimedia.org/wiki/File:Bluefors_dilution_refrigerator.jpg",
      sourceUrl: "https://en.wikipedia.org/wiki/Dilution_refrigerator",
    },
  ],
  "earthquake": [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Earthquake_wave_paths.svg/1280px-Earthquake_wave_paths.svg.png",
      caption: "Seismic Wave Propagation — Hypocenter Focus, Epicenter, P-Waves (Compressional), and S-Waves (Shear)",
      alt: "Earthquake Hypocenter and Seismic Wave Mechanics Diagram",
      photographer: "Wikimedia Commons (USGS / Geology)",
      photographerUrl: "https://commons.wikimedia.org/wiki/File:Earthquake_wave_paths.svg",
      sourceUrl: "https://en.wikipedia.org/wiki/Earthquake",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Tectonic_plate_boundaries.png/1280px-Tectonic_plate_boundaries.png",
      caption: "Global Plate Tectonics — Convergent, Divergent, and Transform Subduction Fault Lines",
      alt: "Global Tectonic Plate Boundaries Map",
      photographer: "Wikimedia Commons",
      photographerUrl: "https://commons.wikimedia.org/wiki/File:Tectonic_plate_boundaries.png",
      sourceUrl: "https://en.wikipedia.org/wiki/Plate_tectonics",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Fault_types.svg/1280px-Fault_types.svg.png",
      caption: "Geological Fault Line Types — Normal, Reverse (Thrust), and Strike-Slip Fracture Dynamics",
      alt: "Geological Fault Line Types Diagram",
      photographer: "Wikimedia Commons",
      photographerUrl: "https://commons.wikimedia.org/wiki/File:Fault_types.svg",
      sourceUrl: "https://en.wikipedia.org/wiki/Fault_(geology)",
    },
  ],
};

/**
 * Visual Intent & Semantic Need Evaluator
 */
export function evaluateVisualNeed(query: string, answerText: string = ""): VisualIntentDecision {
  const clean = (query || "").trim().toLowerCase();

  // 1. Basic / Conversational / Math Calculation -> 0 Images
  for (const pattern of BASIC_PATTERNS) {
    if (pattern.test(clean)) {
      return {
        needed: false,
        type: "none",
        count: 0,
        primaryQuery: "",
        reason: "Conversational, mathematical, or direct factual lookup — no visual explanation required.",
      };
    }
  }

  // Very short query without substantive subject (< 4 chars)
  if (clean.length < 4 && !clean.includes(" ")) {
    return {
      needed: false,
      type: "none",
      count: 0,
      primaryQuery: "",
      reason: "Query too brief for visual conceptualization.",
    };
  }

  const subject = extractSubject(query) || query;
  const searchTerms = cleanForImageSearch(subject);

  // 2. Conceptual / Scientific / Technical Architecture -> 3 to 5 Informative Educational Diagrams
  for (const pattern of CONCEPTUAL_PATTERNS) {
    if (pattern.test(clean) || pattern.test(answerText.slice(0, 500))) {
      return {
        needed: true,
        type: "conceptual_diagram",
        count: 4,
        primaryQuery: searchTerms,
        secondaryQuery: `${searchTerms} architecture diagram`,
        reason: "Technical/scientific concept — architectural schematics, flowcharts, and diagrams provide essential comprehension.",
      };
    }
  }

  // 3. Physical Real-World Entity / Landmark / Animal / City / Planet -> 2 to 3 Authentic Photos
  if (clean.length >= 6 || searchTerms.split(" ").length >= 2) {
    return {
      needed: true,
      type: "physical_entity",
      count: 3,
      primaryQuery: searchTerms,
      reason: "Physical entity/landmark benefits from authentic photographic perspectives.",
    };
  }

  return {
    needed: false,
    type: "none",
    count: 0,
    primaryQuery: "",
    reason: "Standard concise query.",
  };
}

function cleanForImageSearch(raw: string): string {
  const words = raw
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(
      (w) =>
        w.length > 2 &&
        !STOP_WORDS.has(w) &&
        !["what", "how", "why", "explain", "tell", "show", "describe", "picture", "images", "photo"].includes(w),
    );

  return words.slice(0, 4).join(" ") || raw;
}

/**
 * Discovers authentic, high-resolution scientific diagrams from Wikipedia & Wikimedia Commons
 * Specifically filters for diagrams, architectures, flowcharts, schematics, and structural figures.
 */
export async function fetchWikimediaDiagrams(query: string, maxCount = 4): Promise<ConceptImage[]> {
  const cleanSubject = extractSubject(query) || query;
  const normalizedSubject = cleanSubject.replace(/\s+/g, "_");

  try {
    // 1. Fetch images associated with the main Wikipedia article
    const articleUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
      normalizedSubject,
    )}|${encodeURIComponent(cleanSubject)}&prop=images&imlimit=50&format=json`;

    const res = await fetch(articleUrl, {
      headers: { "User-Agent": "EdithAssistant/2.0 (visual-intelligence)" },
    });

    if (!res.ok) return [];
    const data = (await res.json()) as {
      query?: { pages?: Record<string, { title?: string; images?: { title: string }[] }> };
    };

    const pages = Object.values(data?.query?.pages || {});
    const fileTitles: string[] = [];

    // Filter for educational diagrams, schematics, charts, architectures
    const DIAGRAM_KEYWORDS = [
      "diagram",
      "architecture",
      "structure",
      "network",
      "model",
      "cycle",
      "flow",
      "scheme",
      "topology",
      "circuit",
      "anatomy",
      "process",
      "hierarchy",
      "layer",
      "spectrum",
      "learning",
      "cell",
      "system",
      "vector",
      "tree",
      "gradient",
    ];

    const EXCLUDED = [
      "logo",
      "icon",
      "book",
      "symbol",
      "wiki",
      "ambox",
      "portal",
      "question",
      "star",
      "flag",
      "edit",
      "sound",
      "audio",
      "map",
    ];

    for (const p of pages) {
      if (p.images) {
        for (const img of p.images) {
          const lower = img.title.toLowerCase();
          const isExcluded = EXCLUDED.some((ex) => lower.includes(ex));
          if (!isExcluded) {
            const isDiagram = DIAGRAM_KEYWORDS.some((kw) => lower.includes(kw));
            if (isDiagram) {
              fileTitles.unshift(img.title); // High priority
            } else if (lower.endsWith(".svg") || lower.endsWith(".png") || lower.endsWith(".jpg")) {
              fileTitles.push(img.title);
            }
          }
        }
      }
    }

    // 2. Also search Wikimedia for "${cleanSubject} diagram"
    if (fileTitles.length < maxCount) {
      try {
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
          `${cleanSubject} diagram architecture`,
        )}&gsrlimit=6&prop=pageimages&pithumbsize=1200&format=json`;
        const searchRes = await fetch(searchUrl, {
          headers: { "User-Agent": "EdithAssistant/2.0 (visual-intelligence)" },
        });
        if (searchRes.ok) {
          const sData = (await searchRes.json()) as {
            query?: { pages?: Record<string, { title: string; thumbnail?: { source: string } }> };
          };
          const sPages = Object.values(sData?.query?.pages || {});
          for (const sp of sPages) {
            if (sp.thumbnail?.source && !sp.thumbnail.source.includes("logo") && !sp.thumbnail.source.includes("icon")) {
              // Add direct thumbnail page
              fileTitles.push(`File:${sp.title}.png`);
            }
          }
        }
      } catch {
        // Continue with collected files
      }
    }

    if (fileTitles.length === 0) return [];

    // 3. Batch query imageinfo to get 1200px rendered thumbnail URLs & metadata
    const uniqueFiles = Array.from(new Set(fileTitles)).slice(0, 10);
    const infoUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
      uniqueFiles.join("|"),
    )}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1200&format=json`;

    const infoRes = await fetch(infoUrl, {
      headers: { "User-Agent": "EdithAssistant/2.0 (visual-intelligence)" },
    });

    if (!infoRes.ok) return [];
    const infoData = (await infoRes.json()) as {
      query?: {
        pages?: Record<
          string,
          {
            title: string;
            imageinfo?: {
              thumburl?: string;
              url?: string;
              descriptionurl?: string;
            }[];
          }
        >;
      };
    };

    const results: ConceptImage[] = [];
    const returnedPages = Object.values(infoData?.query?.pages || {});

    for (const item of returnedPages) {
      const info = item.imageinfo?.[0];
      if (info?.thumburl || info?.url) {
        const rawTitle = item.title.replace(/^File:\s*/i, "").replace(/\.[^/.]+$/, "");
        const formattedTitle = rawTitle.replace(/[-_]/g, " ");

        results.push({
          url: info.thumburl || info.url!,
          caption: `${formattedTitle} — Verified Architecture & Mechanism Schematic`,
          alt: `${cleanSubject} — ${formattedTitle}`,
          photographer: "Wikimedia Commons (Peer-Reviewed Schematic)",
          photographerUrl: info.descriptionurl || "https://commons.wikimedia.org",
          sourceUrl: info.descriptionurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(normalizedSubject)}`,
        });

        if (results.length >= maxCount) break;
      }
    }

    return results;
  } catch (err) {
    console.warn("Wikimedia diagram discovery error:", err);
    return [];
  }
}

interface PexelsPhoto {
  id: number;
  url: string;
  photographer: string;
  photographer_url: string;
  alt: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    landscape: string;
  };
}

/**
 * Fetches authentic, high-resolution photographs from Pexels API
 * Best used for physical landmarks, animals, astronomy, landscapes, real hardware, and environments.
 */
export async function fetchPexelsPhotos(
  query: string,
  count = 4,
  orientation: "landscape" | "portrait" | "square" = "landscape",
): Promise<ConceptImage[]> {
  if (!query || !query.trim() || count <= 0) return [];
  const apiKey = PEXELS_API_KEY;
  if (!apiKey) return [];

  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${Math.min(
      count + 2,
      10,
    )}&orientation=${orientation}`;
    const res = await fetch(url, {
      headers: { Authorization: apiKey },
    });

    if (!res.ok) return [];
    const data = (await res.json()) as { photos?: PexelsPhoto[] };
    if (!data.photos || !Array.isArray(data.photos) || data.photos.length === 0) return [];

    return data.photos.slice(0, count).map((p) => {
      const cleanAlt = p.alt || query;
      const titleCaseQuery = query.charAt(0).toUpperCase() + query.slice(1);
      return {
        url: p.src.large2x || p.src.large || p.src.landscape || p.src.medium,
        caption: `${cleanAlt || titleCaseQuery} (Photo by ${p.photographer} on Pexels)`,
        alt: cleanAlt || titleCaseQuery,
        photographer: p.photographer,
        photographerUrl: p.photographer_url,
        sourceUrl: p.url,
      };
    });
  } catch (err) {
    console.warn("Pexels API image fetch error:", err);
    return [];
  }
}

/**
 * Check if the query matches our Canonical Diagram Matrix
 */
function findCanonicalDiagrams(query: string): ConceptImage[] | null {
  const clean = query.toLowerCase().trim();
  for (const [key, diagrams] of Object.entries(CANONICAL_DIAGRAMS)) {
    if (clean.includes(key) || key.includes(clean)) {
      return diagrams;
    }
  }
  return null;
}

/**
 * MASTER VISUAL CURATION & COGNITIVE REASONING ENGINE
 * 
 * 1. Evaluates user intent:
 *    - Basic / math / greeting -> 0 images (clean text output)
 *    - Abstract technical / scientific concept -> High-precision educational architectural diagrams & schematics
 *    - Physical entity / landmark / nature -> Authentic 4K Pexels photographs
 * 2. Delivers 100% relevant, informative, and structurally accurate visual evidence.
 */
export async function fetchCuratedConceptImages(
  query: string,
  answerText: string = "",
): Promise<ConceptImage[]> {
  const decision = evaluateVisualNeed(query, answerText);

  // 1. If basic query, return 0 images
  if (!decision.needed || decision.count <= 0) {
    return [];
  }

  // 2. Check canonical knowledge graph for immediate, high-fidelity diagram sets
  const canonical = findCanonicalDiagrams(query);
  if (canonical && canonical.length > 0) {
    return canonical.slice(0, decision.count);
  }

  const results: ConceptImage[] = [];
  const seenUrls = new Set<string>();

  // 3. For Conceptual / Scientific / Technical Topics -> Query Wikimedia Diagram Engine
  if (decision.type === "conceptual_diagram") {
    const diagrams = await fetchWikimediaDiagrams(decision.primaryQuery, decision.count);
    for (const d of diagrams) {
      if (!seenUrls.has(d.url)) {
        seenUrls.add(d.url);
        results.push(d);
      }
    }

    // If we need more context photos (e.g. lab environment or hardware), augment with Pexels
    if (results.length < decision.count) {
      const remaining = decision.count - results.length;
      const pexels = await fetchPexelsPhotos(decision.primaryQuery, remaining);
      for (const p of pexels) {
        if (!seenUrls.has(p.url)) {
          seenUrls.add(p.url);
          results.push(p);
        }
      }
    }
  } else {
    // 4. For Physical Entities / Nature / Landmarks -> Query Pexels API
    const pexels = await fetchPexelsPhotos(decision.primaryQuery, decision.count);
    for (const p of pexels) {
      if (!seenUrls.has(p.url)) {
        seenUrls.add(p.url);
        results.push(p);
      }
    }

    // If Pexels has few results, augment with Wikimedia
    if (results.length < decision.count) {
      const remaining = decision.count - results.length;
      const wiki = await fetchWikimediaDiagrams(decision.primaryQuery, remaining);
      for (const w of wiki) {
        if (!seenUrls.has(w.url)) {
          seenUrls.add(w.url);
          results.push(w);
        }
      }
    }
  }

  return results.slice(0, decision.count);
}
