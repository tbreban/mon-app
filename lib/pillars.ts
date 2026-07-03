export const PILLARS = {
  "conseil-projets-sirh": {
    label: "Conseil & Projets SIRH",
    labelEn: "HRIS Consulting & Projects",
    description: "Cadrage, choix de solution, déploiement, conduite du changement, projet de migration, recette, transformation.",
    descriptionEn: "Scoping, solution selection, deployment, change management, migration project, testing, transformation.",
  },
  "paie": {
    label: "Paie",
    labelEn: "Payroll",
    description: "Audit, fiabilisation, transition paie, multi-conventions, contrôles réglementaires.",
    descriptionEn: "Audit, reliability, payroll transition, multi-agreement, regulatory checks.",
  },
  "gta": {
    label: "GTA",
    labelEn: "Time & Attendance",
    description: "Conception, paramétrage, badgeage, horaires & cycles, plannings, interfaces avec la paie.",
    descriptionEn: "Design, configuration, time tracking, schedules & cycles, plannings, payroll interfaces.",
  },
  "formation": {
    label: "Formation",
    labelEn: "Training & Enablement",
    description: "Transfert de compétences en paie et GTA. Accompagnement utilisateurs et parcours sur mesure.",
    descriptionEn: "Payroll and T&A skills transfer. User support and tailored learning paths.",
  },
} as const;

export type PillarSlug = keyof typeof PILLARS;
