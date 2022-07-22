export type ENV = "development" | "production" | "staging";
export type AppSwitchConfig = {
  development?: boolean;
  production?: boolean;
  staging?: boolean;
};

const KillSwitchApps = ["bounty", "peerReview"] as const;
export type KillswitchApp = typeof KillSwitchApps[number];

const KillswtichConfigs: Record<KillswitchApp, AppSwitchConfig> = {
  bounty: {
    development: true,
    staging: true,
    production: false,
  },
  peerReview: {
    development: false,
    staging: false,
    production: false,
  },
} as const;

export default KillswtichConfigs;
