import type { StudyData } from 'shared/types';

export interface StudyClassification {
  therapeuticAreas: string[];
  studyPhase: string;
  treatmentType: string;
  population: string;
  confidence: number;
  keywords: string[];
}

export interface ClassificationResult {
  studyId: string;
  title: string;
  classification: StudyClassification;
}

// Define classification patterns
const CLASSIFICATION_PATTERNS = {
  therapeuticAreas: {
    cancer:
      /(cancer|oncology|tumor|malignant|metastatic|leukemia|lymphoma|sarcoma|melanoma|breast cancer|lung cancer|prostate cancer|colorectal cancer|pancreatic cancer|ovarian cancer|brain cancer|skin cancer)/i,
    cardiovascular:
      /(heart|cardiac|cardiovascular|hypertension|blood pressure|myocardial|coronary|arrhythmia|heart failure|stroke|atherosclerosis|angina)/i,
    neurological:
      /(brain|neurological|stroke|alzheimer|parkinson|epilepsy|multiple sclerosis|dementia|neurodegenerative|cognitive|memory|seizure)/i,
    psychiatric:
      /(depression|anxiety|psychiatric|mental health|autism|addiction|schizophrenia|bipolar|ptsd|ocd|adhd|mood disorder)/i,
    diabetes:
      /(diabetes|glycemic|insulin|glucose|diabetic|hyperglycemia|hypoglycemia|type 1|type 2)/i,
    respiratory:
      /(asthma|copd|pulmonary|respiratory|lung|bronchial|emphysema|bronchitis)/i,
    autoimmune:
      /(rheumatoid|lupus|autoimmune|inflammatory|arthritis|psoriasis|inflammatory bowel|crohn|ulcerative colitis)/i,
    infectious:
      /(infection|viral|bacterial|fungal|hiv|hepatitis|tuberculosis|malaria|covid|influenza)/i,
    dermatological:
      /(dermatitis|psoriasis|eczema|acne|skin|dermatological|wound|burn)/i,
    gastrointestinal:
      /(gastrointestinal|digestive|stomach|intestine|liver|pancreas|esophagus|colon|rectum)/i,
    musculoskeletal:
      /(musculoskeletal|bone|joint|muscle|fracture|osteoporosis|arthritis|back pain|spine)/i,
    ophthalmological:
      /(eye|ophthalmic|retinal|glaucoma|cataract|vision|blindness|macular)/i,
    urological:
      /(urinary|kidney|bladder|prostate|urological|nephrology|dialysis|renal)/i,
    gynecological:
      /(gynecological|ovarian|uterine|cervical|breast|menstrual|pregnancy|fertility)/i,
    pediatric: /(pediatric|child|infant|neonatal|adolescent|juvenile|young)/i,
    geriatric: /(geriatric|elderly|aging|senior|old age|dementia)/i,
  },

  studyPhases: {
    phase1: /(phase\s*1|phase\s*i|first\s*in\s*human|safety\s*study)/i,
    phase2: /(phase\s*2|phase\s*ii|efficacy\s*study)/i,
    phase3: /(phase\s*3|phase\s*iii|confirmatory|pivotal)/i,
    phase4: /(phase\s*4|phase\s*iv|post\s*marketing|surveillance)/i,
    observational:
      /(observational|registry|cohort|case\s*control|cross\s*sectional)/i,
    pilot: /(pilot|feasibility|exploratory)/i,
  },

  treatmentTypes: {
    drug: /(drug|medication|pharmaceutical|therapy|treatment|compound|molecule|inhibitor|agonist|antagonist)/i,
    device:
      /(device|implant|prosthesis|pacemaker|stent|catheter|sensor|monitor)/i,
    surgery: /(surgery|surgical|operation|procedure|intervention|transplant)/i,
    behavioral:
      /(behavioral|cognitive|therapy|counseling|psychotherapy|intervention)/i,
    lifestyle:
      /(lifestyle|diet|exercise|physical activity|nutrition|wellness)/i,
    radiation: /(radiation|radiotherapy|irradiation|x-ray|gamma|proton)/i,
    stemCell: /(stem\s*cell|cell\s*therapy|regenerative|tissue\s*engineering)/i,
    gene: /(gene|genetic|dna|rna|mutation|genomic|molecular)/i,
    vaccine: /(vaccine|immunization|immunity|antibody|antigen)/i,
  },

  populations: {
    healthy: /(healthy|volunteer|normal|control)/i,
    pediatric: /(pediatric|child|infant|neonatal|adolescent|juvenile|young)/i,
    geriatric: /(geriatric|elderly|aging|senior|old age)/i,
    pregnant: /(pregnant|pregnancy|gestation|maternal)/i,
    'specific condition':
      /(patients?\s*with|subjects?\s*with|individuals?\s*with)/i,
  },
};

export function classifyStudy(
  title: string,
  studyId: string
): ClassificationResult {
  const therapeuticAreas: string[] = [];
  let studyPhase = '';
  let treatmentType = '';
  let population = '';
  const keywords: string[] = [];
  let confidence = 0;
  let totalMatches = 0;

  // Classify therapeutic areas
  for (const [area, pattern] of Object.entries(
    CLASSIFICATION_PATTERNS.therapeuticAreas
  )) {
    if (pattern.test(title)) {
      therapeuticAreas.push(area);
      keywords.push(area);
      totalMatches++;
    }
  }

  // Classify study phase
  for (const [phase, pattern] of Object.entries(
    CLASSIFICATION_PATTERNS.studyPhases
  )) {
    if (pattern.test(title)) {
      studyPhase = phase;
      keywords.push(phase);
      totalMatches++;
      break; // Take the first match
    }
  }

  // Classify treatment type
  for (const [type, pattern] of Object.entries(
    CLASSIFICATION_PATTERNS.treatmentTypes
  )) {
    if (pattern.test(title)) {
      treatmentType = type;
      keywords.push(type);
      totalMatches++;
      break; // Take the first match
    }
  }

  // Classify population
  for (const [pop, pattern] of Object.entries(
    CLASSIFICATION_PATTERNS.populations
  )) {
    if (pattern.test(title)) {
      population = pop;
      keywords.push(pop);
      totalMatches++;
      break; // Take the first match
    }
  }

  // Calculate confidence based on number of matches and title length
  const titleWords = title.split(/\s+/).length;
  confidence = Math.min(
    0.9,
    (totalMatches / Math.max(titleWords * 0.1, 1)) * 0.8
  );

  return {
    studyId,
    title,
    classification: {
      therapeuticAreas,
      studyPhase,
      treatmentType,
      population,
      confidence,
      keywords,
    },
  };
}

export function classifyStudies(studies: StudyData[]): ClassificationResult[] {
  return studies.map(study => classifyStudy(study.title, study.id));
}

export type ClassificationStats = {
  therapeuticAreas: Record<string, number>;
  studyPhases: Record<string, number>;
  treatmentTypes: Record<string, number>;
  populations: Record<string, number>;
  totalStudies: number;
  averageConfidence: number;
};

export function getClassificationStats(
  classifications: ClassificationResult[]
): ClassificationStats {
  const stats = {
    therapeuticAreas: {} as Record<string, number>,
    studyPhases: {} as Record<string, number>,
    treatmentTypes: {} as Record<string, number>,
    populations: {} as Record<string, number>,
    totalStudies: classifications.length,
    averageConfidence: 0,
  };

  let totalConfidence = 0;

  classifications.forEach(result => {
    const { classification } = result;

    // Count therapeutic areas
    classification.therapeuticAreas.forEach(area => {
      stats.therapeuticAreas[area] = (stats.therapeuticAreas[area] || 0) + 1;
    });

    // Count other categories
    if (classification.studyPhase) {
      stats.studyPhases[classification.studyPhase] =
        (stats.studyPhases[classification.studyPhase] || 0) + 1;
    }
    if (classification.treatmentType) {
      stats.treatmentTypes[classification.treatmentType] =
        (stats.treatmentTypes[classification.treatmentType] || 0) + 1;
    }
    if (classification.population) {
      stats.populations[classification.population] =
        (stats.populations[classification.population] || 0) + 1;
    }

    totalConfidence += classification.confidence;
  });

  stats.averageConfidence = totalConfidence / classifications.length;

  return stats;
}
