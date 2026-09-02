// This file is the "Rewarded Ads" entry point for the monetization
// framework's channel list — but it intentionally does NOT contain a
// new implementation. FITRER already has a working, voluntary
// "watch an ad to unlock X" system: UnlockGate.jsx (generic reward
// unlocks) and AdGateModal.jsx (template downloads specifically).
// Building a second, separate rewarded-ad component here would create
// exactly the competing system earlier instructions said not to
// build. This re-export just gives that existing system a name inside
// the monetization architecture, so it shows up where a "Rewarded
// Ads" channel is expected.
export { default } from "../components/UnlockGate.jsx";