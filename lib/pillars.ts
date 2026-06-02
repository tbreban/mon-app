export const PILLARS = {
  "conseil-strategie": {
    label: "Conseil & Stratégie",
    labelEn: "Consulting & Strategy",
    description: "Sécuriser vos décisions SIRH/Paie avant d'engager le projet.",
    descriptionEn: "Secure your SIRH/Payroll decisions before starting the project.",
  },
  "amoa-projets": {
    label: "AMOA Projets",
    labelEn: "Project AMOA",
    description: "Piloter vos projets SIRH, Paie et GTA du côté métier.",
    descriptionEn: "Drive your SIRH, Payroll and Time Management projects from the business side.",
  },
  "paie-conformite": {
    label: "Conformité GTA Paie",
    labelEn: "GTA Payroll Compliance",
    description: "Fiabiliser, contrôler et sécuriser votre paie au quotidien.",
    descriptionEn: "Strengthen, control and secure your payroll on a daily basis.",
  },
  "etudes-rh-donnees": {
    label: "Études RH & Données",
    labelEn: "HR Studies & Data",
    description: "Transformer vos données sociales en outil de pilotage.",
    descriptionEn: "Turn your social data into a management tool.",
  },
} as const;

export type PillarSlug = keyof typeof PILLARS;
