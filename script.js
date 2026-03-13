const PHASES = ["Flashpoint", "Signals", "Pressure", "Brink", "Aftershock"];

const PHASE_DESCRIPTIONS = {
  Flashpoint: "Initial collision and first public signals",
  Signals: "Military movements, media pressure, and alliance reactions",
  Pressure: "Cyber disruptions, intelligence friction, and hotline decisions",
  Brink: "Direct confrontation under extreme time pressure",
  Aftershock: "Final crisis management and the path to an ending",
};

const DEFCON_LABELS = {
  5: "Routine Readiness",
  4: "Stable Alert",
  3: "Serious Alert",
  2: "War Footing",
  1: "Critical Nuclear Risk",
};

const TAG_LABELS = {
  hotline_open: "Hotline open",
  hotline_cut: "Hotline silent",
  allies_reassured: "Allies reassured",
  cyber_disruption: "Cyber disruption",
  naval_standoff: "Naval standoff",
  media_leak: "Media leak",
  backchannel: "Backchannel active",
  sanctions: "Economic sanctions",
  evacuation: "Civil defense active",
  verification: "Independent verification",
  strike_ready: "Strike plans ready",
  summit_path: "Summit pathway",
  ceasefire: "Ceasefire draft",
  ai_false_alarm: "Sensor anomaly",
};

const ADVISORS = {
  hawke: "Defense Secretary Mira Hawke",
  vale: "Foreign Minister Elias Vale",
  sora: "Intelligence Director Hana Sora",
  ortiz: "Chief of Staff Lena Ortiz",
};

const THREAD_BRIDGES = {
  public:
    "Your last move is already shaping the public mood. Governors, journalists, and families are reading your signals for hints about whether this crisis is cooling or accelerating.",
  diplomacy:
    "The diplomatic track has not frozen. Messages sent earlier are now returning with consequences, and each word from your government is changing how much room remains for compromise.",
  military:
    "The armed forces are now acting on the tone you set. Ship movements, air patrols, and alert orders are no longer abstract plans; they are becoming facts on the ground that Vesper can see.",
  intelligence:
    "Analysts are trying to separate signal from noise, but your earlier choices already changed what data is trusted and how quickly the system wants to act on it.",
  alliance:
    "Allies are responding not just to Vesper, but to you. The credibility and restraint you showed earlier are now influencing how much support they are willing to offer.",
  civilian:
    "The civilian side of the crisis is catching up. Markets, schools, hospitals, and local governments are reacting to the atmosphere created by your previous decisions.",
};

const CORE_PROMPTS = [
  {
    id: "opening_collision",
    phase: 0,
    thread: "public",
    title: "Gray Strait collision",
    body:
      "At 04:10, a Norhaven destroyer and a Vesper patrol ship collide in disputed waters. Both governments claim the other side acted aggressively. Social media fills with rumors that missiles were loaded on the Vesper ship, but intelligence has not confirmed it. Your cabinet wants a statement in the next ten minutes.",
    followup:
      "This is the first moment in which your presidency will define the tone of the crisis. Every public word now becomes part of the story both nations tell themselves about what happens next.",
    options: [
      {
        label: "Call for calm and announce a joint investigation",
        effect: "De-escalates publicly, but risks looking weak at home",
        deltas: { defcon: 0, relations: 8, readiness: -4, stability: 3, intel: 2 },
        addFlags: ["calm_statement"],
        addTags: ["verification"],
        log: "You publicly called for a joint investigation into the collision.",
      },
      {
        label: "Condemn Vesper aggression and send more ships to the strait",
        effect: "Projects strength and raises military pressure",
        deltas: { defcon: -1, relations: -9, readiness: 9, stability: -2, intel: 0 },
        addFlags: ["hardline_opening"],
        addTags: ["naval_standoff"],
        log: "You reinforced the Gray Strait after blaming Vesper for the collision.",
      },
      {
        label: "Stay vague in public while opening a private military review",
        effect: "Buys time, but leaves room for speculation",
        deltas: { defcon: 0, relations: -2, readiness: 5, stability: -1, intel: 4 },
        addFlags: ["quiet_review"],
        log: "You delayed a firm public stance and ordered a private review.",
      },
    ],
  },
  {
    id: "ambassador_request",
    phase: 0,
    thread: "diplomacy",
    title: "Ambassador on secure line",
    body:
      "Your ambassador in a neutral capital reports that Vesper officials are shocked by the collision and are asking for a quiet conversation before either side hardens its position. Meanwhile, your domestic opposition accuses you of hesitating in a crisis.",
    followup:
      "The request arrives in the shadow of your first response to the collision, so everyone involved will read your answer as a clue to whether Norhaven is looking for a ramp down or a better position from which to escalate.",
    options: [
      {
        label: "Authorize a discreet diplomatic contact",
        effect: "Improves future negotiation options",
        deltas: { defcon: 0, relations: 7, readiness: -2, stability: 1, intel: 3 },
        addFlags: ["backchannel_opened"],
        addTags: ["backchannel"],
        log: "You opened a discreet backchannel through your ambassador.",
      },
      {
        label: "Refuse talks until Vesper apologizes publicly",
        effect: "Hardens your position and narrows options later",
        deltas: { defcon: -1, relations: -8, readiness: 6, stability: 0, intel: -1 },
        addFlags: ["public_apology_demanded"],
        log: "You refused talks without a public apology from Vesper.",
      },
      {
        label: "Invite allied leaders into the conversation first",
        effect: "Builds coalition support but slows response time",
        deltas: { defcon: 0, relations: 3, readiness: 1, stability: 2, intel: 2 },
        addFlags: ["ally_consulted"],
        addTags: ["allies_reassured"],
        log: "You coordinated with allies before contacting Vesper.",
      },
    ],
  },
  {
    id: "satellite_glare",
    phase: 0,
    thread: "intelligence",
    title: "Unclear satellite imagery",
    body:
      "Fresh satellite images show movement near a Vesper missile brigade, but analysts disagree whether it is a real deployment, an exercise, or simply vehicle maintenance under poor weather conditions. Cable news has already begun using the phrase 'countdown to war.'",
    followup:
      "Because the political temperature is already rising, uncertain intelligence is suddenly more dangerous than usual. Ambiguous pictures can become policy if you let fear outrun verification.",
    options: [
      {
        label: "Release a measured statement: no confirmed launch activity",
        effect: "Supports calm and reinforces verified intelligence",
        deltas: { defcon: 1, relations: 3, readiness: -2, stability: 4, intel: 4 },
        addFlags: ["measured_imagery"],
        addTags: ["verification"],
        log: "You emphasized that the imagery did not confirm launch activity.",
      },
      {
        label: "Raise readiness quietly and keep the imagery classified",
        effect: "Prepares the military without spooking the public",
        deltas: { defcon: 0, relations: -1, readiness: 7, stability: 0, intel: 1 },
        addFlags: ["quiet_alert"],
        log: "You quietly raised readiness while keeping satellite data classified.",
      },
      {
        label: "Leak the images to pressure Vesper internationally",
        effect: "Can rally support, but risks panic if the evidence is wrong",
        deltas: { defcon: -1, relations: -6, readiness: 3, stability: -6, intel: -3 },
        addFlags: ["imagery_leaked"],
        addTags: ["media_leak"],
        log: "Images were leaked to international media to pressure Vesper.",
      },
    ],
  },
  {
    id: "allied_radar_ping",
    phase: 1,
    thread: "alliance",
    title: "Ally requests joint radar release",
    body:
      "Caldor, your closest treaty ally, wants to publicly release shared radar data to show Vesper aircraft approaching the strait before the collision. Your intelligence chief warns the radar record is real but incomplete and could be misread outside expert circles.",
    followup:
      "Caldor's request is really a test of your leadership. Allies are now judging whether your crisis management is disciplined enough to follow, or volatile enough to fear.",
    options: [
      {
        label: "Approve the release with a technical briefing",
        effect: "Boosts alliance trust and public clarity",
        deltas: { defcon: 0, relations: 2, readiness: 1, stability: 3, intel: 4 },
        addFlags: ["allied_transparency"],
        addTags: ["allies_reassured"],
        log: "You approved a joint radar release with technical context.",
      },
      {
        label: "Keep the data private and share it only at the UN",
        effect: "Preserves credibility but slows the information battle",
        deltas: { defcon: 1, relations: 4, readiness: -1, stability: 1, intel: 3 },
        addFlags: ["un_route"],
        log: "You reserved the radar evidence for private diplomatic use.",
      },
      {
        label: "Release it immediately and accuse Vesper of preparing an ambush",
        effect: "Rallies domestic support, but sharpens the crisis",
        deltas: { defcon: -1, relations: -7, readiness: 5, stability: 0, intel: -1 },
        addFlags: ["public_accusation"],
        addTags: ["media_leak"],
        log: "You released radar data while accusing Vesper of setting an ambush.",
      },
    ],
  },
  {
    id: "missile_defense_test",
    phase: 1,
    thread: "military",
    title: "Missile defense command requests a test",
    body:
      "Your missile defense commanders ask permission to conduct a visible interceptor test. They argue it would reassure the public and deter Vesper. Diplomats warn the launch could be mistaken for preparation for a first strike.",
    followup:
      "The request carries extra weight because Vesper is already parsing your military signals for intent. What looks defensive to Norhaven may look like a countdown somewhere else.",
    options: [
      {
        label: "Reject the visible test and move assets quietly",
        effect: "Avoids signaling panic while preserving readiness",
        deltas: { defcon: 1, relations: 4, readiness: 3, stability: 1, intel: 1 },
        addFlags: ["quiet_assets"],
        log: "You rejected a public interceptor test and shifted assets quietly.",
      },
      {
        label: "Approve the test and broadcast confidence",
        effect: "Shows strength, but can look provocative",
        deltas: { defcon: -1, relations: -5, readiness: 6, stability: 2, intel: 0 },
        addFlags: ["interceptor_tested"],
        addTags: ["strike_ready"],
        log: "You approved a visible missile defense test during the crisis.",
      },
      {
        label: "Delay the test pending a hotline conversation with Vesper",
        effect: "Links military signaling to diplomacy",
        deltas: { defcon: 0, relations: 6, readiness: -1, stability: 0, intel: 2 },
        addFlags: ["diplomacy_tied_signal"],
        requireAnyTag: ["hotline_open", "backchannel"],
        log: "You delayed a missile defense test pending direct talks.",
      },
    ],
  },
  {
    id: "hotline_offer",
    phase: 1,
    thread: "diplomacy",
    title: "Hotline offered",
    body:
      "A Swiss intermediary says Vesper's president will speak with you directly in twenty minutes, but only if neither side makes new military announcements first. Your defense minister thinks silence could be seen as hesitation. Your foreign minister says this may be the best off-ramp you get.",
    followup:
      "Whether the hotline works will depend heavily on the tone you have already set. If your earlier decisions made Norhaven look disciplined, the call can calm things. If not, it may just become another stage for mutual threats.",
    options: [
      {
        label: "Accept the hotline and freeze new military announcements",
        effect: "Creates a real path to de-escalation",
        deltas: { defcon: 1, relations: 8, readiness: -2, stability: 1, intel: 2 },
        addFlags: ["hotline_accepted"],
        addTags: ["hotline_open"],
        removeTags: ["hotline_cut"],
        log: "You accepted a direct hotline call and froze new military announcements.",
      },
      {
        label: "Demand Vesper withdraw ships before you speak",
        effect: "Maintains leverage, but could kill the call",
        deltas: { defcon: -1, relations: -6, readiness: 4, stability: -1, intel: 0 },
        addFlags: ["hotline_preconditions"],
        addTags: ["hotline_cut"],
        log: "You attached preconditions to the hotline call.",
      },
      {
        label: "Let your vice president handle the first contact",
        effect: "Reduces political risk, but weakens the signal",
        deltas: { defcon: 0, relations: 2, readiness: 0, stability: 0, intel: 1 },
        addFlags: ["hotline_delegated"],
        addTags: ["hotline_open"],
        log: "You delegated the first direct contact to the vice president.",
      },
    ],
  },
  {
    id: "market_shock",
    phase: 1,
    thread: "civilian",
    title: "Markets slide, panic buying begins",
    body:
      "Financial markets plunge after a false online report claims Vesper forces have dispersed mobile nuclear launchers. Grocery stores in several Norhaven cities see panic buying. Governors want clear guidance within the hour.",
    followup:
      "Until now, the crisis has lived mostly in briefing rooms. That barrier is breaking. Citizens are beginning to react to the world your previous decisions helped create.",
    options: [
      {
        label: "Address the nation with calm, specific facts",
        effect: "Improves stability and counters rumors",
        deltas: { defcon: 1, relations: 1, readiness: -1, stability: 7, intel: 2 },
        addFlags: ["calm_address"],
        log: "You delivered a calm national address focused on verified facts.",
      },
      {
        label: "Activate emergency supply coordination and civil defense messaging",
        effect: "Improves preparedness but signals a more serious threat",
        deltas: { defcon: 0, relations: -1, readiness: 2, stability: 3, intel: 0 },
        addFlags: ["civil_defense_active"],
        addTags: ["evacuation"],
        log: "You activated emergency supply coordination and civil defense messaging.",
      },
      {
        label: "Say little publicly and focus on security operations",
        effect: "Keeps options open, but panic may grow",
        deltas: { defcon: -1, relations: 0, readiness: 4, stability: -5, intel: 1 },
        addFlags: ["info_vacuum"],
        log: "You prioritized security operations over public reassurance.",
      },
    ],
  },
  {
    id: "cyber_intrusion",
    phase: 2,
    thread: "intelligence",
    title: "Command network intrusion",
    body:
      "A cyber team reports malicious traffic inside a logistics network that supports one of your missile warning centers. They cannot yet tell whether it is espionage, sabotage, or unrelated criminal activity. Vesper denies involvement and blames 'digital opportunists.'",
    followup:
      "The intrusion lands in a crisis where trust is already thin. Because of everything that came before, even a technical problem now carries strategic meaning.",
    options: [
      {
        label: "Isolate the affected systems and announce a technical review",
        effect: "Lowers immediate risk and boosts verification",
        deltas: { defcon: 1, relations: 2, readiness: -2, stability: 1, intel: 6 },
        addFlags: ["cyber_isolated"],
        addTags: ["cyber_disruption", "verification"],
        log: "You isolated compromised systems and announced a technical review.",
      },
      {
        label: "Launch a retaliatory cyber operation against Vesper infrastructure",
        effect: "Projects resolve, but could trigger a wider exchange",
        deltas: { defcon: -1, relations: -9, readiness: 5, stability: -2, intel: -1 },
        addFlags: ["cyber_retaliated"],
        addTags: ["cyber_disruption"],
        log: "You authorized a retaliatory cyber operation against Vesper.",
      },
      {
        label: "Privately warn Vesper that any interference with warning systems is unacceptable",
        effect: "Signals seriousness while keeping space for diplomacy",
        deltas: { defcon: 0, relations: 4, readiness: 1, stability: 0, intel: 3 },
        addFlags: ["private_warning_sent"],
        requireAnyTag: ["hotline_open", "backchannel"],
        log: "You privately warned Vesper over interference with warning systems.",
      },
    ],
  },
  {
    id: "border_mobilization",
    phase: 2,
    thread: "military",
    title: "Vesper reserve forces mobilize",
    body:
      "Drone feeds show reserve units moving toward rail hubs in northern Vesper. Analysts disagree whether the purpose is to strengthen air defense, prepare for a limited strike, or create bargaining leverage. Your generals want authority to pre-position missile units in response.",
    followup:
      "These movements are being interpreted through the lens of your earlier posture. If you have already signaled force, Vesper may believe your next move is coming quickly. If you have signaled restraint, this may still be recoverable.",
    options: [
      {
        label: "Mirror the mobilization with your own visible deployments",
        effect: "Raises deterrence, but tightens the spiral",
        deltas: { defcon: -1, relations: -6, readiness: 7, stability: -1, intel: 0 },
        addFlags: ["mirrored_mobilization"],
        addTags: ["strike_ready"],
        log: "You mirrored Vesper's mobilization with visible deployments.",
      },
      {
        label: "Increase air and naval patrols, but keep missile units back",
        effect: "Shows caution with credible defense",
        deltas: { defcon: 0, relations: -1, readiness: 4, stability: 1, intel: 2 },
        addFlags: ["patrol_only"],
        log: "You expanded patrols while holding missile units back.",
      },
      {
        label: "Offer reciprocal pullbacks if Vesper freezes its movements",
        effect: "Creates an off-ramp if trust can hold",
        deltas: { defcon: 1, relations: 7, readiness: -3, stability: 1, intel: 2 },
        addFlags: ["reciprocal_pullback"],
        requireAnyTag: ["hotline_open", "backchannel"],
        addTags: ["ceasefire"],
        log: "You offered reciprocal pullbacks in exchange for a freeze.",
      },
    ],
  },
  {
    id: "intel_dispute",
    phase: 2,
    thread: "intelligence",
    title: "Analysts split on launch warning",
    body:
      "An early-warning analyst flags a pattern that resembles Vesper preparing launcher dispersal. A second team says the pattern overlaps with a national holiday exercise seen in previous years. Your advisors are divided between acting now and demanding more confirmation.",
    followup:
      "This dispute is more dangerous because the system now remembers your earlier habits. If you rewarded caution, analysts will speak up. If you rewarded speed and force, fewer people may want to be the voice that slows the room down.",
    options: [
      {
        label: "Require two-source confirmation before any major response",
        effect: "Strengthens decision discipline and reduces false alarms",
        deltas: { defcon: 1, relations: 2, readiness: -2, stability: 2, intel: 7 },
        addFlags: ["verification_push"],
        addTags: ["verification"],
        log: "You required two-source confirmation before any major response.",
      },
      {
        label: "Order strategic forces to prepare for rapid dispersal",
        effect: "Cuts reaction time, but raises fear on both sides",
        deltas: { defcon: -1, relations: -5, readiness: 8, stability: -3, intel: 0 },
        addFlags: ["rapid_dispersal"],
        addTags: ["strike_ready"],
        log: "You ordered strategic forces to prepare for rapid dispersal.",
      },
      {
        label: "Ask a neutral monitoring group to review the data",
        effect: "Adds outside credibility if time allows",
        deltas: { defcon: 0, relations: 5, readiness: -1, stability: 1, intel: 5 },
        addFlags: ["neutral_review"],
        addTags: ["verification"],
        log: "You requested a neutral external review of the warning data.",
      },
    ],
  },
  {
    id: "media_documents",
    phase: 2,
    thread: "public",
    title: "Leaked documents hit the press",
    body:
      "A major outlet publishes leaked planning documents suggesting your military has war-gamed limited conventional strikes against Vesper command posts. The documents are real but incomplete. Vesper's state television says the leak proves Norhaven was preparing aggression from the start.",
    followup:
      "Because earlier decisions have already shaped your credibility, the leak will not land the same way in every run. A transparent president can survive this hit. A slippery one may watch the narrative collapse.",
    options: [
      {
        label: "Acknowledge the plans and explain they were contingency only",
        effect: "Protects credibility, but confirms some fears",
        deltas: { defcon: 0, relations: -2, readiness: 1, stability: 2, intel: 2 },
        addFlags: ["plan_acknowledged"],
        addTags: ["media_leak"],
        log: "You acknowledged the leaked plans as contingency scenarios only.",
      },
      {
        label: "Deny the leak's significance and blame disinformation",
        effect: "May steady politics now, but credibility could suffer later",
        deltas: { defcon: -1, relations: -3, readiness: 1, stability: 0, intel: -4 },
        addFlags: ["leak_denied"],
        addTags: ["media_leak"],
        log: "You downplayed leaked planning documents as disinformation.",
      },
      {
        label: "Use the moment to propose mutual transparency talks",
        effect: "Turns a leak into a diplomatic opening",
        deltas: { defcon: 1, relations: 6, readiness: -2, stability: 1, intel: 3 },
        addFlags: ["transparency_talks"],
        requireAnyTag: ["hotline_open", "backchannel"],
        addTags: ["summit_path"],
        log: "You responded to the leak by proposing transparency talks.",
      },
    ],
  },
  {
    id: "ally_pressure",
    phase: 2,
    thread: "alliance",
    title: "Allies split on next move",
    body:
      "Your allies are no longer unified. Some want a show of force to deter Vesper. Others want an emergency summit and say any aggressive move could force them to distance themselves publicly. You need to choose which coalition you want to hold together.",
    followup:
      "This split did not appear from nowhere. It is a delayed reaction to the tone, clarity, and discipline of your earlier decisions, and allies are now asking whether your strategy actually has an ending.",
    options: [
      {
        label: "Prioritize alliance unity and back an emergency summit",
        effect: "Stabilizes diplomacy, but may frustrate hawks",
        deltas: { defcon: 1, relations: 7, readiness: -2, stability: 2, intel: 2 },
        addFlags: ["summit_allies"],
        addTags: ["allies_reassured", "summit_path"],
        log: "You prioritized alliance unity and backed an emergency summit.",
      },
      {
        label: "Lead a hardline coalition for stronger deterrence",
        effect: "Signals resolve while narrowing room to compromise",
        deltas: { defcon: -1, relations: -4, readiness: 7, stability: 1, intel: 0 },
        addFlags: ["hardline_allies"],
        addTags: ["strike_ready"],
        log: "You aligned with allies pushing for stronger deterrence.",
      },
      {
        label: "Keep both camps engaged and avoid a final commitment",
        effect: "Preserves flexibility, but can look indecisive",
        deltas: { defcon: 0, relations: 1, readiness: 1, stability: -1, intel: 1 },
        addFlags: ["balancing_allies"],
        log: "You tried to keep both allied camps engaged without committing.",
      },
    ],
  },
  {
    id: "sensor_anomaly",
    phase: 3,
    thread: "intelligence",
    title: "Possible launch indication",
    body:
      "For ninety seconds, a warning console reports what looks like a small cluster of launches from deep inside Vesper territory. The track then collapses. Engineers suspect a sensor fusion error, but a few commanders argue that waiting in this moment is the greatest risk of all.",
    followup:
      "This is the kind of moment every previous decision has been preparing you for. The culture inside the room, the trust in your systems, and the tone of your relationship with Vesper all now matter at once.",
    options: [
      {
        label: "Stand down and demand human verification before any response",
        effect: "Reduces false-alarm danger and reinforces command discipline",
        deltas: { defcon: 1, relations: 2, readiness: -2, stability: 1, intel: 7 },
        addFlags: ["false_alarm_standdown"],
        addTags: ["ai_false_alarm", "verification"],
        log: "You stood down after a possible false launch indication.",
      },
      {
        label: "Order immediate dispersal of strategic aircraft",
        effect: "Raises survivability, but could be read as pre-attack movement",
        deltas: { defcon: -1, relations: -6, readiness: 9, stability: -2, intel: -1 },
        addFlags: ["strategic_aircraft_dispersed"],
        addTags: ["strike_ready", "ai_false_alarm"],
        log: "You ordered strategic aircraft dispersal after a launch scare.",
      },
      {
        label: "Call Vesper through every available channel before moving",
        effect: "Takes nerve, but can break the panic cycle",
        deltas: { defcon: 1, relations: 8, readiness: -3, stability: 0, intel: 4 },
        addFlags: ["verified_by_hotline"],
        requireAnyTag: ["hotline_open", "backchannel"],
        addTags: ["hotline_open", "verification"],
        log: "You used every available channel to verify the launch scare with Vesper.",
      },
    ],
  },
  {
    id: "submarine_ping",
    phase: 3,
    thread: "military",
    title: "Submarine contact near exclusion zone",
    body:
      "A Norhaven attack submarine detects an unidentified vessel near a declared exclusion zone. The captain asks whether to shadow aggressively, issue a warning, or withdraw to avoid collision. Naval commanders say underwater accidents in this climate could be catastrophic.",
    followup:
      "Sea commanders are operating inside the atmosphere you built earlier. An aggressive posture now invites one kind of interpretation; restraint invites another. Underwater, there is very little time for correction.",
    options: [
      {
        label: "Order a warning and maintain distance",
        effect: "Signals control without provoking a collision",
        deltas: { defcon: 1, relations: 3, readiness: 1, stability: 0, intel: 2 },
        addFlags: ["warning_distance"],
        log: "You ordered a warning to the unidentified submarine while maintaining distance.",
      },
      {
        label: "Shadow aggressively to force it out",
        effect: "Shows dominance, but increases accident risk",
        deltas: { defcon: -1, relations: -5, readiness: 5, stability: -1, intel: 0 },
        addFlags: ["aggressive_shadow"],
        addTags: ["naval_standoff"],
        log: "You ordered aggressive shadowing near the exclusion zone.",
      },
      {
        label: "Withdraw and propose a deconfliction corridor at sea",
        effect: "Avoids a flashpoint and opens a practical off-ramp",
        deltas: { defcon: 1, relations: 6, readiness: -2, stability: 1, intel: 1 },
        addFlags: ["sea_corridor"],
        addTags: ["ceasefire"],
        log: "You withdrew and proposed a deconfliction corridor at sea.",
      },
    ],
  },
  {
    id: "capital_evacuation",
    phase: 3,
    thread: "civilian",
    title: "Evacuation pressure in the capital",
    body:
      "Security services recommend moving parts of the government to hardened sites. If the relocation leaks, the public may assume war is imminent. If you stay visible in the capital, your advisors say it could calm nerves but expose you to real risk if events spiral further.",
    followup:
      "This is no longer just a military or diplomatic problem. Your earlier choices have changed how much the public trusts you, how much secrecy is still possible, and whether visible calm would feel believable.",
    options: [
      {
        label: "Relocate key staff quietly while you remain visible",
        effect: "Balances continuity and reassurance",
        deltas: { defcon: 0, relations: 0, readiness: 2, stability: 3, intel: 1 },
        addFlags: ["key_staff_split"],
        addTags: ["evacuation"],
        log: "You relocated key staff quietly while remaining visible in the capital.",
      },
      {
        label: "Move the full national command team immediately",
        effect: "Maximizes protection, but may trigger panic if noticed",
        deltas: { defcon: -1, relations: -1, readiness: 4, stability: -4, intel: 0 },
        addFlags: ["gov_relocated"],
        addTags: ["evacuation"],
        log: "You relocated the full national command team to hardened sites.",
      },
      {
        label: "Stay in place and focus on public reassurance",
        effect: "Supports civic calm, but reduces your security margin",
        deltas: { defcon: 1, relations: 1, readiness: -2, stability: 5, intel: 0 },
        addFlags: ["stayed_capital"],
        log: "You stayed in the capital to reassure the public.",
      },
    ],
  },
  {
    id: "sanctions_window",
    phase: 3,
    thread: "alliance",
    title: "Economic warfare proposal",
    body:
      "Your treasury team says a coordinated sanctions package could hurt Vesper quickly without firing a shot. Critics warn that cutting energy and banking channels now might corner Vesper's leadership and make military action more attractive than compromise.",
    followup:
      "By this stage, economic pressure is not a separate tool from the rest of the crisis. It will be interpreted through your earlier threats, your diplomatic signals, and whether Vesper still believes you want a way out.",
    options: [
      {
        label: "Impose targeted sanctions tied to a negotiation offer",
        effect: "Applies pressure while keeping an off-ramp visible",
        deltas: { defcon: 0, relations: -1, readiness: 0, stability: 1, intel: 1 },
        addFlags: ["targeted_sanctions"],
        addTags: ["sanctions", "summit_path"],
        log: "You imposed targeted sanctions paired with a negotiation offer.",
      },
      {
        label: "Launch a full sanctions package immediately",
        effect: "Raises the cost to Vesper, but may harden its stance",
        deltas: { defcon: -1, relations: -7, readiness: 2, stability: 0, intel: 0 },
        addFlags: ["heavy_sanctions"],
        addTags: ["sanctions"],
        log: "You launched a full sanctions package immediately.",
      },
      {
        label: "Hold sanctions in reserve to preserve leverage for talks",
        effect: "Keeps diplomatic space open",
        deltas: { defcon: 1, relations: 4, readiness: -1, stability: 0, intel: 1 },
        addFlags: ["sanctions_held"],
        log: "You held sanctions in reserve to preserve leverage for talks.",
      },
    ],
  },
  {
    id: "general_request",
    phase: 3,
    thread: "military",
    title: "General requests strike authorization",
    body:
      "A senior general says that if Vesper's mobile missile units disperse much farther, your military will lose the chance to hit them conventionally. Civilian advisors warn that any strike on nuclear-related systems could be misread as an attempt to disarm Vesper before a larger war.",
    followup:
      "This request is shaped by the incentives you have created. If force has been rewarded all night, military voices will press harder now. If caution has mattered, civilian restraint still has a chance to hold.",
    options: [
      {
        label: "Reject preemptive strikes and restate civilian control",
        effect: "Protects against catastrophic miscalculation",
        deltas: { defcon: 1, relations: 4, readiness: -3, stability: 1, intel: 2 },
        addFlags: ["preemptive_rejected"],
        log: "You rejected preemptive strike authority and restated civilian control.",
      },
      {
        label: "Approve limited strike planning, but not execution",
        effect: "Improves readiness and raises risk",
        deltas: { defcon: -1, relations: -4, readiness: 6, stability: -1, intel: 1 },
        addFlags: ["limited_strike_planned"],
        addTags: ["strike_ready"],
        log: "You approved limited strike planning without authorizing execution.",
      },
      {
        label: "Signal privately that any nuclear move would trigger overwhelming consequences",
        effect: "Strengthens deterrence through a direct warning",
        deltas: { defcon: 0, relations: -1, readiness: 3, stability: 0, intel: 2 },
        addFlags: ["private_deterrent"],
        requireAnyTag: ["hotline_open", "backchannel"],
        log: "You sent a private warning about the consequences of any nuclear move.",
      },
    ],
  },
  {
    id: "summit_offer",
    phase: 4,
    thread: "diplomacy",
    title: "Emergency summit proposal",
    body:
      "A neutral state offers to host you and the Vesper president within hours. Travel would be risky and controversial, but the offer includes military deconfliction teams, satellite transparency experts, and a ceasefire draft already on the table. Hardliners insist talks at this moment reward brinkmanship.",
    followup:
      "Whether this summit feels like weakness or leadership depends almost entirely on the road that got you here. The room is now judging whether you have earned the authority to shift from brinkmanship to settlement.",
    options: [
      {
        label: "Accept the summit and send military deconfliction teams ahead",
        effect: "Strongest path to a negotiated landing",
        deltas: { defcon: 1, relations: 9, readiness: -3, stability: 2, intel: 3 },
        addFlags: ["summit_accepted"],
        addTags: ["summit_path", "ceasefire", "verification"],
        log: "You accepted an emergency summit and sent deconfliction teams ahead.",
      },
      {
        label: "Send your foreign minister first while keeping pressure on Vesper",
        effect: "Keeps leverage while testing whether talks are real",
        deltas: { defcon: 0, relations: 4, readiness: 1, stability: 1, intel: 2 },
        addFlags: ["envoy_first"],
        addTags: ["summit_path"],
        log: "You sent your foreign minister ahead while maintaining pressure.",
      },
      {
        label: "Reject the summit and prepare for a prolonged standoff",
        effect: "Avoids appearing to bend, but extends the crisis",
        deltas: { defcon: -1, relations: -8, readiness: 4, stability: -2, intel: -1 },
        addFlags: ["summit_rejected"],
        log: "You rejected the summit offer and prepared for a prolonged standoff.",
      },
    ],
  },
  {
    id: "ceasefire_text",
    phase: 4,
    thread: "diplomacy",
    title: "Draft ceasefire arrives",
    body:
      "Negotiators deliver a draft ceasefire: pull back naval units, restore communication channels, freeze missile exercises for thirty days, and create a joint inquiry into the original collision. Your defense team supports parts of it but says a full freeze gives Vesper breathing room.",
    followup:
      "The draft does not arrive in a vacuum. It is a summary of the crisis you built. Every concession reflects previous threats, every safeguard reflects previous fears, and every loophole reflects the trust that still does not exist.",
    options: [
      {
        label: "Sign the draft with verification inspectors attached",
        effect: "Improves stability and creates concrete guardrails",
        deltas: { defcon: 1, relations: 8, readiness: -4, stability: 4, intel: 4 },
        addFlags: ["ceasefire_signed"],
        addTags: ["ceasefire", "verification"],
        log: "You signed the ceasefire draft with verification inspectors.",
      },
      {
        label: "Demand stronger terms before signing",
        effect: "May improve the final deal, but risks losing it",
        deltas: { defcon: 0, relations: -1, readiness: 2, stability: -1, intel: 1 },
        addFlags: ["stronger_terms"],
        log: "You demanded stronger terms before signing the ceasefire draft.",
      },
      {
        label: "Reject the freeze and continue military pressure",
        effect: "Preserves coercive leverage, but keeps the risk high",
        deltas: { defcon: -1, relations: -6, readiness: 5, stability: -2, intel: 0 },
        addFlags: ["freeze_rejected"],
        addTags: ["strike_ready"],
        log: "You rejected the freeze and continued military pressure.",
      },
    ],
  },
  {
    id: "final_warning",
    phase: 4,
    thread: "public",
    title: "Final warning from Vesper",
    body:
      "Vesper broadcasts that any attack on its strategic systems will be treated as a threat to national survival. Your advisors are split between answering with equal severity and deliberately lowering the temperature. The next message could set the tone for the last hours of the crisis.",
    followup:
      "Their warning is shaped by everything you have both done so far. One more misread signal could lock each capital into the version of the story it fears most.",
    options: [
      {
        label: "Respond with a firm but restrained deterrent warning",
        effect: "Maintains resolve without adding gasoline to the fire",
        deltas: { defcon: 0, relations: 1, readiness: 2, stability: 1, intel: 1 },
        addFlags: ["restrained_warning"],
        log: "You responded to Vesper with a firm but restrained warning.",
      },
      {
        label: "Answer with maximum-force rhetoric and visible alert moves",
        effect: "Signals absolute resolve and spikes escalation risk",
        deltas: { defcon: -1, relations: -8, readiness: 7, stability: -3, intel: -1 },
        addFlags: ["max_force_rhetoric"],
        addTags: ["strike_ready"],
        log: "You answered Vesper with maximum-force rhetoric and alert moves.",
      },
      {
        label: "Use the warning to justify an immediate diplomatic reset proposal",
        effect: "Turns a public threat into a final off-ramp",
        deltas: { defcon: 1, relations: 6, readiness: -2, stability: 2, intel: 2 },
        addFlags: ["diplomatic_reset"],
        addTags: ["summit_path"],
        log: "You used Vesper's warning to justify a diplomatic reset proposal.",
      },
    ],
  },
  {
    id: "inspection_offer",
    phase: 4,
    thread: "intelligence",
    title: "Inspection corridor proposal",
    body:
      "Neutral observers propose a temporary inspection corridor around the Gray Strait and selected missile storage sites. Accepting could dramatically lower uncertainty. Refusing may preserve sovereignty and secrecy, but it also leaves the worst assumptions alive on both sides.",
    followup:
      "By now, uncertainty itself has become one of the main engines of danger. This proposal is an attempt to answer the questions your earlier choices left unresolved.",
    options: [
      {
        label: "Accept reciprocal inspections under strict timelines",
        effect: "Reduces uncertainty and rewards transparency",
        deltas: { defcon: 1, relations: 7, readiness: -2, stability: 2, intel: 5 },
        addFlags: ["inspections_accepted"],
        addTags: ["verification"],
        log: "You accepted reciprocal inspections under strict timelines.",
      },
      {
        label: "Offer sea inspections only, not missile-related access",
        effect: "Provides partial trust-building with less exposure",
        deltas: { defcon: 0, relations: 3, readiness: 0, stability: 1, intel: 2 },
        addFlags: ["sea_only_inspections"],
        log: "You offered sea inspections but withheld missile-related access.",
      },
      {
        label: "Refuse inspections and keep all strategic ambiguity",
        effect: "Protects secrecy while sustaining maximum suspicion",
        deltas: { defcon: -1, relations: -5, readiness: 3, stability: -1, intel: -2 },
        addFlags: ["inspections_refused"],
        log: "You refused inspections and kept strategic ambiguity intact.",
      },
    ],
  },
  {
    id: "public_address_final",
    phase: 4,
    thread: "civilian",
    title: "Last address before dawn",
    body:
      "The crisis has entered its final stretch. Your speechwriters offer three directions for a live address before dawn: reassure the public and explain the de-escalation path, rally national endurance for a long confrontation, or deliver a warning meant mainly for Vesper's leadership.",
    followup:
      "This speech will not just describe the crisis. It will interpret the meaning of everything that happened before it and tell the country what kind of presidency it has just witnessed.",
    options: [
      {
        label: "Explain the de-escalation path and ask the public to stay calm",
        effect: "Strengthens civic resilience and supports diplomacy",
        deltas: { defcon: 1, relations: 3, readiness: -1, stability: 6, intel: 1 },
        addFlags: ["deescalation_speech"],
        log: "You explained the de-escalation path and asked the public to stay calm.",
      },
      {
        label: "Frame the crisis as a long struggle requiring sacrifice",
        effect: "Builds endurance, but normalizes prolonged confrontation",
        deltas: { defcon: 0, relations: -1, readiness: 3, stability: 1, intel: 0 },
        addFlags: ["endurance_speech"],
        log: "You framed the crisis as a long national struggle.",
      },
      {
        label: "Deliver a warning aimed mainly at Vesper's leadership",
        effect: "Pressures the rival government, but heightens the final atmosphere",
        deltas: { defcon: -1, relations: -4, readiness: 4, stability: -2, intel: 0 },
        addFlags: ["leader_warning_speech"],
        log: "You delivered a warning aimed directly at Vesper's leadership.",
      },
    ],
  },
];

const LOCKED_PROMPTS = [
  {
    id: "secret_envoy_note",
    phase: 1,
    thread: "diplomacy",
    title: "Secret envoy note from Vesper",
    body:
      "Because you previously opened a discreet diplomatic channel, a handwritten note from a Vesper envoy reaches your foreign minister. It says the Vesper president is facing pressure from generals who believe Norhaven wants regime humiliation, not crisis control.",
    followup:
      "This scene only exists because you made room for private diplomacy earlier. The note may be genuine, manipulative, or both.",
    requireFlagsAll: ["backchannel_opened"],
    options: [
      {
        label: "Send assurances that Norhaven wants de-escalation, not humiliation",
        effect: "Builds trust quietly, but may anger your hawks",
        deltas: { defcon: 1, relations: 6, readiness: -1, stability: 0, intel: 2 },
        addFlags: ["quiet_assurances"],
        log: "You used the backchannel to signal that Norhaven wants de-escalation, not humiliation.",
      },
      {
        label: "Demand proof before treating the note as serious",
        effect: "Protects against manipulation, but slows momentum",
        deltas: { defcon: 0, relations: 1, readiness: 0, stability: 0, intel: 3 },
        addFlags: ["proof_demanded"],
        log: "You demanded proof before treating the envoy note as credible.",
      },
      {
        label: "Use the note to pressure Vesper harder in public",
        effect: "Could fracture their leadership, or close the channel",
        deltas: { defcon: -1, relations: -5, readiness: 3, stability: -1, intel: -1 },
        addFlags: ["backchannel_burned"],
        log: "You used private signals from Vesper to pressure them in public.",
      },
    ],
  },
  {
    id: "apology_backlash",
    phase: 1,
    thread: "public",
    title: "Nationalist backlash at home",
    body:
      "Because you demanded a public apology from Vesper, media figures and veterans' groups are now treating the apology question as a test of national honor. Even some moderates say backing down would be politically dangerous.",
    followup:
      "What began as a bargaining tactic is hardening into a domestic commitment. You now have less room to compromise without paying a political price.",
    requireFlagsAll: ["public_apology_demanded"],
    options: [
      {
        label: "Reframe the issue around safety instead of pride",
        effect: "May restore flexibility if the public follows you",
        deltas: { defcon: 1, relations: 3, readiness: -1, stability: 2, intel: 1 },
        addFlags: ["honor_reframed"],
        log: "You tried to shift the public conversation from pride to safety.",
      },
      {
        label: "Double down: no talks without the apology",
        effect: "Strengthens your position at home and traps you abroad",
        deltas: { defcon: -1, relations: -6, readiness: 3, stability: 1, intel: 0 },
        addFlags: ["honor_line_hardened"],
        log: "You doubled down on demanding a public apology before talks.",
      },
    ],
  },
  {
    id: "caldor_private_warning",
    phase: 1,
    thread: "alliance",
    title: "Private warning from Caldor",
    body:
      "Because you consulted allies early, Caldor's prime minister now sends a private warning: several allied capitals will support deterrence, but not an open-ended confrontation with unclear goals.",
    followup:
      "Your alliance has given you leverage, but only on the condition that your strategy still looks disciplined.",
    requireFlagsAll: ["ally_consulted"],
    options: [
      {
        label: "Commit to allied transparency before any escalation",
        effect: "Strengthens coalition cohesion",
        deltas: { defcon: 1, relations: 4, readiness: -1, stability: 1, intel: 2 },
        addFlags: ["allied_transparency_pledge"],
        log: "You pledged allied transparency before any further escalation.",
      },
      {
        label: "Tell Caldor Norhaven will decide alone if necessary",
        effect: "Protects freedom of action and rattles the alliance",
        deltas: { defcon: -1, relations: -3, readiness: 2, stability: 0, intel: 0 },
        addFlags: ["allied_frustration"],
        log: "You warned Caldor that Norhaven might act alone if necessary.",
      },
    ],
  },
  {
    id: "classified_leak_aftershock",
    phase: 2,
    thread: "public",
    title: "Leak fallout snowballs",
    body:
      "Because classified material already hit the press, reporters are now connecting separate fragments into a more dramatic story: secret alerts, missile movements, and possible strike planning. Much of it is incomplete, but the atmosphere is getting harder to control.",
    followup:
      "This prompt only appears if leaks entered your run. The crisis narrative is now being co-written by people outside the command room.",
    requireAnyTag: ["media_leak"],
    options: [
      {
        label: "Hold a technical briefing and correct the record point by point",
        effect: "Can restore trust if your facts hold up",
        deltas: { defcon: 1, relations: 1, readiness: -1, stability: 4, intel: 3 },
        addFlags: ["leak_briefing"],
        log: "You held a technical briefing to contain the leak fallout.",
      },
      {
        label: "Launch an internal leak hunt and say little publicly",
        effect: "Shows control, but can deepen panic",
        deltas: { defcon: 0, relations: 0, readiness: 2, stability: -2, intel: 1 },
        addFlags: ["leak_hunt"],
        log: "You launched an internal leak hunt while limiting public comment.",
      },
    ],
  },
  {
    id: "civil_defense_hoax",
    phase: 2,
    thread: "civilian",
    title: "Shelter hoax spreads online",
    body:
      "Because civil defense messaging is active, false maps of 'priority shelters' now spread online. Families begin driving across city lines, emergency lines clog, and opposition lawmakers accuse the government of staging fear to justify secrecy.",
    followup:
      "Preparedness has benefits, but it also creates a social system that rumors can hijack.",
    requireFlagsAll: ["civil_defense_active"],
    options: [
      {
        label: "Release corrected maps and put local officials on camera",
        effect: "Improves trust through visible competence",
        deltas: { defcon: 1, relations: 0, readiness: -1, stability: 5, intel: 1 },
        addFlags: ["hoax_contained"],
        log: "You used local officials and corrected maps to contain a shelter hoax.",
      },
      {
        label: "Treat the hoax as hostile information warfare",
        effect: "May justify stronger control, but can deepen fear",
        deltas: { defcon: 0, relations: -1, readiness: 2, stability: -2, intel: 2 },
        addFlags: ["hoax_securitized"],
        log: "You framed the shelter hoax as hostile information warfare.",
      },
    ],
  },
  {
    id: "interceptor_politics",
    phase: 2,
    thread: "military",
    title: "Interceptor test changes the room",
    body:
      "Because you approved a visible interceptor test, several generals now argue that public demonstrations of capability are shifting the balance. Diplomats counter that Vesper may now assume you are preparing to absorb retaliation while acting first.",
    followup:
      "The military signal you sent earlier has acquired a political life of its own.",
    requireFlagsAll: ["interceptor_tested"],
    options: [
      {
        label: "Use the test as leverage for direct talks",
        effect: "Turns a hard signal into a bargaining chip",
        deltas: { defcon: 0, relations: 3, readiness: -1, stability: 0, intel: 1 },
        addFlags: ["test_as_leverage"],
        log: "You tried to convert a military demonstration into diplomatic leverage.",
      },
      {
        label: "Authorize another visible readiness measure",
        effect: "Deepens deterrence and sharpens Vesper's fears",
        deltas: { defcon: -1, relations: -4, readiness: 4, stability: -1, intel: 0 },
        addFlags: ["signal_stack"],
        log: "You followed the interceptor test with another visible readiness measure.",
      },
    ],
  },
  {
    id: "quiet_inspection_channel",
    phase: 2,
    thread: "diplomacy",
    title: "Quiet inspection channel opens",
    body:
      "Because you combined private diplomacy with an emphasis on verification, neutral intermediaries now float a quiet inspection scheme: both sides would allow limited technical access without publicly admitting mistrust.",
    followup:
      "This is a rare path. It only appears when your earlier choices created both communication and credibility.",
    requireFlagsAll: ["backchannel_opened", "verification_push"],
    options: [
      {
        label: "Approve the quiet inspection channel",
        effect: "Reduces uncertainty and opens an unusual off-ramp",
        deltas: { defcon: 1, relations: 6, readiness: -2, stability: 1, intel: 5 },
        addFlags: ["quiet_inspections"],
        log: "You approved a quiet inspection channel through intermediaries.",
      },
      {
        label: "Keep the idea in reserve and reveal nothing yet",
        effect: "Preserves flexibility if timing still feels wrong",
        deltas: { defcon: 0, relations: 2, readiness: 0, stability: 0, intel: 2 },
        addFlags: ["quiet_inspections_reserved"],
        log: "You held the quiet inspection proposal in reserve.",
      },
    ],
  },
  {
    id: "cyber_blowback",
    phase: 3,
    thread: "intelligence",
    title: "Cyber blowback hits civilian systems",
    body:
      "Because you authorized retaliatory cyber action, hospitals and shipping firms across the region now report unexplained software failures. Your own cyber commanders say this may be spillover from malware moving through shared infrastructure.",
    followup:
      "A hidden domain of the crisis has become visible to ordinary people.",
    requireFlagsAll: ["cyber_retaliated"],
    options: [
      {
        label: "Pause offensive cyber operations and disclose limited facts",
        effect: "Cuts risk and costs you some political cover",
        deltas: { defcon: 1, relations: 2, readiness: -1, stability: 2, intel: 3 },
        addFlags: ["cyber_pause"],
        log: "You paused offensive cyber operations after spillover reached civilian systems.",
      },
      {
        label: "Continue operations and blame Vesper escalation",
        effect: "Keeps pressure high and worsens regional instability",
        deltas: { defcon: -1, relations: -5, readiness: 2, stability: -3, intel: -1 },
        addFlags: ["cyber_escalation_doubled"],
        log: "You continued offensive cyber operations despite civilian spillover.",
      },
    ],
  },
  {
    id: "shadow_commanders",
    phase: 3,
    thread: "military",
    title: "Field commanders push the line",
    body:
      "Because strategic forces have been visibly prepared, field commanders are now making requests that would have seemed extreme hours ago. They want broader authority to move first if they think Vesper is gaining positional advantage.",
    followup:
      "This prompt exists because earlier readiness decisions changed what your commanders now consider normal.",
    requireAnyFlag: ["rapid_dispersal", "limited_strike_planned", "strategic_aircraft_dispersed"],
    options: [
      {
        label: "Rein them in and restate centralized control",
        effect: "Lowers accidental-escalation risk",
        deltas: { defcon: 1, relations: 2, readiness: -2, stability: 0, intel: 2 },
        addFlags: ["central_control_reasserted"],
        log: "You reasserted centralized control over field commanders.",
      },
      {
        label: "Grant conditional flexibility in the field",
        effect: "Improves response speed and multiplies danger",
        deltas: { defcon: -1, relations: -4, readiness: 5, stability: -1, intel: -1 },
        addFlags: ["field_flexibility_granted"],
        log: "You granted conditional flexibility to field commanders.",
      },
    ],
  },
  {
    id: "naval_flash_signal",
    phase: 3,
    thread: "military",
    title: "Flash signal in the Gray Strait",
    body:
      "Because naval encounters remained tense, a Norhaven captain now reports that a Vesper vessel briefly illuminated fire-control radar before breaking away. Vesper says the signal was accidental. Your navy says accidents in a live standoff are not really accidents anymore.",
    followup:
      "This scene only appears when sea pressure remained part of the story.",
    requireAnyFlag: ["hardline_opening", "aggressive_shadow"],
    options: [
      {
        label: "Log the incident, warn privately, and avoid public escalation",
        effect: "Contains the flashpoint if discipline holds",
        deltas: { defcon: 1, relations: 2, readiness: 0, stability: 0, intel: 2 },
        addFlags: ["naval_incident_contained"],
        log: "You contained a dangerous radar-illumination incident at sea.",
      },
      {
        label: "Release the incident publicly and move more ships forward",
        effect: "Raises pressure and can rally domestic support",
        deltas: { defcon: -1, relations: -5, readiness: 4, stability: 1, intel: 0 },
        addFlags: ["naval_incident_public"],
        log: "You publicized the naval flash signal and moved more ships forward.",
      },
    ],
  },
  {
    id: "ally_split_memorandum",
    phase: 3,
    thread: "alliance",
    title: "Allied memorandum leaks",
    body:
      "Because your coalition has been under strain, an allied memorandum leaks. It shows some governments fear Norhaven is becoming trapped in its own rhetoric, while others fear you are still too cautious to deter Vesper.",
    followup:
      "Alliance management has become part of the narrative, not background support.",
    requireAnyFlag: ["hardline_allies", "balancing_allies", "summit_allies"],
    options: [
      {
        label: "Bring allied leaders into a private strategic call tonight",
        effect: "May restore trust and slow fragmentation",
        deltas: { defcon: 0, relations: 3, readiness: -1, stability: 1, intel: 1 },
        addFlags: ["allied_call_held"],
        log: "You pulled allied leaders into a late-night strategic call.",
      },
      {
        label: "Ignore the leak and project unilateral confidence",
        effect: "Shows resolve and deepens alliance mistrust",
        deltas: { defcon: -1, relations: -3, readiness: 2, stability: -1, intel: 0 },
        addFlags: ["allied_fracture_deepened"],
        log: "You brushed aside allied criticism and projected unilateral confidence.",
      },
    ],
  },
  {
    id: "relocation_leak",
    phase: 3,
    thread: "civilian",
    title: "Government movement noticed",
    body:
      "Because portions of the government were relocated, amateur flight trackers and local reporters now think something major is happening. The rumor spreading online is blunt: the president knows war is coming.",
    followup:
      "You are now balancing real continuity-of-government needs against the symbolic power of being seen.",
    requireAnyFlag: ["key_staff_split", "gov_relocated"],
    options: [
      {
        label: "Appear live from the capital to steady nerves",
        effect: "Could restore trust if the public believes you",
        deltas: { defcon: 1, relations: 0, readiness: -1, stability: 4, intel: 0 },
        addFlags: ["visible_presidency"],
        log: "You appeared live from the capital to counter evacuation rumors.",
      },
      {
        label: "Say nothing and prioritize continuity planning",
        effect: "Protects command continuity, but feeds the rumor cycle",
        deltas: { defcon: 0, relations: 0, readiness: 2, stability: -3, intel: 1 },
        addFlags: ["rumor_cycle_fed"],
        log: "You prioritized continuity planning over countering evacuation rumors.",
      },
    ],
  },
  {
    id: "sanctions_smuggling",
    phase: 3,
    thread: "alliance",
    title: "Sanctions loophole discovered",
    body:
      "Because economic pressure is now central to your strategy, intelligence finds private firms in allied countries quietly routing materials around the sanctions regime. Public exposure could embarrass your coalition. Silence could make the sanctions look hollow.",
    followup:
      "Even economic tools now carry alliance costs.",
    requireAnyFlag: ["targeted_sanctions", "heavy_sanctions"],
    options: [
      {
        label: "Confront allies privately and preserve the coalition",
        effect: "Keeps the pressure system mostly intact",
        deltas: { defcon: 0, relations: 2, readiness: 0, stability: 0, intel: 2 },
        addFlags: ["sanctions_patchwork"],
        log: "You handled sanctions loopholes privately to preserve coalition unity.",
      },
      {
        label: "Expose the loopholes and demand immediate compliance",
        effect: "Boosts credibility and angers allies",
        deltas: { defcon: -1, relations: -2, readiness: 1, stability: 0, intel: 1 },
        addFlags: ["sanctions_crackdown"],
        log: "You publicly exposed sanctions loopholes and demanded compliance.",
      },
    ],
  },
  {
    id: "false_alarm_commission",
    phase: 4,
    thread: "intelligence",
    title: "Joint false-alarm review proposed",
    body:
      "Because you both survived a launch-scare moment and kept communication alive, technical experts now propose a joint review of warning-system vulnerabilities. Hardliners call it naive. Analysts call it the first genuinely future-focused idea of the crisis.",
    followup:
      "This is one of the rarest late-game prompts and can unlock an unusually constructive ending.",
    requireFlagsAll: ["false_alarm_standdown"],
    requireAnyTag: ["hotline_open"],
    options: [
      {
        label: "Approve the joint review quietly and keep the politics modest",
        effect: "Creates a rare path toward long-term stability",
        deltas: { defcon: 1, relations: 7, readiness: -2, stability: 1, intel: 5 },
        addFlags: ["shared_warning_center"],
        log: "You approved a joint review of warning-system vulnerabilities.",
      },
      {
        label: "Keep the idea on paper and focus on the immediate crisis",
        effect: "Helps today less than it might help tomorrow",
        deltas: { defcon: 0, relations: 2, readiness: 0, stability: 0, intel: 2 },
        addFlags: ["future_review_delayed"],
        log: "You delayed a joint review of warning-system vulnerabilities.",
      },
    ],
  },
  {
    id: "summit_security_scare",
    phase: 4,
    thread: "diplomacy",
    title: "Summit security scare",
    body:
      "Because a summit path is now real, security teams report an unverified threat near the neutral venue. Canceling might kill the summit. Proceeding could look reckless if the threat is real.",
    followup:
      "This scene only appears on late diplomatic paths and tests whether you can hold nerve without slipping into denial.",
    requireAnyFlag: ["summit_accepted", "envoy_first", "diplomatic_reset"],
    options: [
      {
        label: "Proceed with tighter security and keep the channel alive",
        effect: "Preserves momentum under pressure",
        deltas: { defcon: 0, relations: 4, readiness: 1, stability: 0, intel: 2 },
        addFlags: ["summit_held_under_pressure"],
        log: "You pushed ahead with summit plans under heightened security.",
      },
      {
        label: "Pause the summit until the threat picture is clearer",
        effect: "May be prudent, but could drain momentum",
        deltas: { defcon: 0, relations: -1, readiness: 0, stability: 0, intel: 3 },
        addFlags: ["summit_paused"],
        log: "You paused summit plans pending better threat intelligence.",
      },
    ],
  },
  {
    id: "decapitation_scare",
    phase: 4,
    thread: "military",
    title: "Decapitation strike scare",
    body:
      "Because strike planning advanced while communication weakened, intelligence now warns that Vesper may believe Norhaven is considering a decapitation strike. Their leadership is dispersing, and several units are acting with less centralized oversight.",
    followup:
      "This is a rare negative branch created by a particularly dangerous mix of earlier choices.",
    requireFlagsAll: ["limited_strike_planned"],
    requireAnyTag: ["hotline_cut"],
    options: [
      {
        label: "Pull back visible strike preparations and send a clarification",
        effect: "May still save the situation if Vesper believes you",
        deltas: { defcon: 1, relations: 2, readiness: -3, stability: 0, intel: 2 },
        addFlags: ["decapitation_scare_contained"],
        log: "You pulled back visible strike preparations after a decapitation scare.",
      },
      {
        label: "Press on and assume Vesper is bluffing",
        effect: "Creates one of the most dangerous paths in the simulation",
        deltas: { defcon: -1, relations: -7, readiness: 5, stability: -2, intel: -1 },
        addFlags: ["decapitation_scare_uncontained"],
        log: "You pressed on with strike preparations during a decapitation scare.",
      },
    ],
  },
  {
    id: "midnight_mediator",
    phase: 4,
    thread: "diplomacy",
    title: "Midnight mediator package",
    body:
      "Because you combined allied discipline, diplomacy, and concrete de-escalation moves, a neutral mediator now offers a package deal: sea deconfliction, inspections, sanctions sequencing, and a face-saving statement for both presidents.",
    followup:
      "This is a rare positive branch built from multiple earlier choices lining up well.",
    requireFlagsAll: ["quiet_inspections"],
    requireAnyTag: ["allies_reassured"],
    requireAnyFlag: ["reciprocal_pullback", "summit_accepted", "ceasefire_signed"],
    options: [
      {
        label: "Take the package and lock in the off-ramp",
        effect: "Opens the strongest positive ending path",
        deltas: { defcon: 1, relations: 8, readiness: -3, stability: 2, intel: 4 },
        addFlags: ["midnight_package_accepted"],
        log: "You accepted a broad midnight mediator package.",
      },
      {
        label: "Trim the package to avoid looking too eager",
        effect: "Keeps progress alive, but weakens the breakthrough",
        deltas: { defcon: 0, relations: 3, readiness: 0, stability: 0, intel: 1 },
        addFlags: ["midnight_package_trimmed"],
        log: "You trimmed the mediator package to avoid appearing too eager.",
      },
    ],
  },
  {
    id: "launch_key_confusion",
    phase: 4,
    thread: "intelligence",
    title: "Launch key confusion",
    body:
      "Because cyber disruption, strategic readiness, and weak communication all overlapped, your security services report a deeply alarming rumor: a Vesper command unit may be operating under incomplete authentication protocols after relocating in haste.",
    followup:
      "This is one of the paths that can lead to the catastrophic endings.",
    requireAnyTag: ["cyber_disruption", "hotline_cut"],
    requireAnyFlag: ["rapid_dispersal", "field_flexibility_granted", "signal_stack"],
    options: [
      {
        label: "Freeze any new provocation and flood every channel with clarifications",
        effect: "The safest option in an exceptionally unsafe situation",
        deltas: { defcon: 1, relations: 1, readiness: -2, stability: 0, intel: 3 },
        addFlags: ["authentication_crisis_managed"],
        log: "You froze new provocations during a launch-authentication scare.",
      },
      {
        label: "Assume the report is exaggerated and stay on your current course",
        effect: "A catastrophic gamble",
        deltas: { defcon: -1, relations: -6, readiness: 3, stability: -3, intel: -2 },
        addFlags: ["authentication_crisis_ignored"],
        log: "You held course during a launch-authentication scare.",
      },
    ],
  },
];

const PROMPTS = [...CORE_PROMPTS, ...LOCKED_PROMPTS];

const state = {
  started: false,
  turn: 0,
  totalTurns: 0,
  defcon: 4,
  relations: 50,
  readiness: 50,
  stability: 55,
  intel: 50,
  intelTrust: 50,
  commandPressure: 45,
  publicCredibility: 50,
  escalationMomentum: 40,
  complicationCount: 0,
  hardlineStabilizations: 0,
  usedPrompts: new Set(),
  activeTags: new Set(),
  decisionFlags: new Set(),
  history: [],
  eventLog: [
    "Crisis monitor initialized.",
    "Naval collision reported in the Gray Strait.",
  ],
  currentPrompt: null,
  previousPrompt: null,
  narrativeFocus: "public",
  lastOutcomeText: "",
  lastImpact: null,
};

const elements = {
  startWrap: document.getElementById("startWrap"),
  startButton: document.getElementById("startButton"),
  screenTitle: document.getElementById("screenTitle"),
  screenBody: document.getElementById("screenBody"),
  choices: document.getElementById("choices"),
  defconValue: document.getElementById("defconValue"),
  defconLabel: document.getElementById("defconLabel"),
  defconTrack: document.getElementById("defconTrack"),
  phaseBadge: document.getElementById("phaseBadge"),
  turnBadge: document.getElementById("turnBadge"),
  eventLog: document.getElementById("eventLog"),
  tagList: document.getElementById("tagList"),
  relationsValue: document.getElementById("relationsValue"),
  readinessValue: document.getElementById("readinessValue"),
  stabilityValue: document.getElementById("stabilityValue"),
  intelValue: document.getElementById("intelValue"),
  relationsMeter: document.getElementById("relationsMeter"),
  readinessMeter: document.getElementById("readinessMeter"),
  stabilityMeter: document.getElementById("stabilityMeter"),
  intelMeter: document.getElementById("intelMeter"),
  choiceTemplate: document.getElementById("choiceTemplate"),
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function buildDefconTrack() {
  elements.defconTrack.innerHTML = "";
  [5, 4, 3, 2, 1].forEach((level) => {
    const row = document.createElement("div");
    row.className = `defcon-step level-${level}`;
    row.dataset.level = String(level);
    row.textContent = `DEFCON ${level}`;
    elements.defconTrack.appendChild(row);
  });
}

function getPhaseIndex() {
  const progress = state.totalTurns === 0 ? 0 : state.turn / state.totalTurns;
  return Math.min(PHASES.length - 1, Math.floor(progress * PHASES.length));
}

function optionAvailable(option) {
  if (!option.requireAnyTag) {
    if (!option.requireFlagsAll && !option.requireAnyFlag && !option.excludeFlags) {
      return true;
    }
  }

  const tagPass = !option.requireAnyTag || option.requireAnyTag.some((tag) => state.activeTags.has(tag));
  const allFlagsPass = !option.requireFlagsAll || option.requireFlagsAll.every((flag) => state.decisionFlags.has(flag));
  const anyFlagPass = !option.requireAnyFlag || option.requireAnyFlag.some((flag) => state.decisionFlags.has(flag));
  const excludePass = !option.excludeFlags || option.excludeFlags.every((flag) => !state.decisionFlags.has(flag));

  return tagPass && allFlagsPass && anyFlagPass && excludePass;
}

function promptAvailable(prompt) {
  if (state.usedPrompts.has(prompt.id)) {
    return false;
  }

  const anyOptionAvailable = prompt.options.some(optionAvailable);
  if (!anyOptionAvailable) {
    return false;
  }

  const anyTagPass = !prompt.requireAnyTag || prompt.requireAnyTag.some((tag) => state.activeTags.has(tag));
  const allFlagsPass = !prompt.requireFlagsAll || prompt.requireFlagsAll.every((flag) => state.decisionFlags.has(flag));
  const anyFlagPass = !prompt.requireAnyFlag || prompt.requireAnyFlag.some((flag) => state.decisionFlags.has(flag));
  const excludePass = !prompt.excludeFlags || prompt.excludeFlags.every((flag) => !state.decisionFlags.has(flag));

  return anyTagPass && allFlagsPass && anyFlagPass && excludePass;
}

function promptStoryFit(prompt) {
  let score = Math.random() * 0.3;
  if (prompt.phase === getPhaseIndex()) {
    score += 5;
  }
  if (prompt.requireFlagsAll || prompt.requireAnyFlag || prompt.requireAnyTag) {
    score += 1.4;
  }
  if (prompt.thread === state.narrativeFocus) {
    score += 2.4;
  }
  if (state.previousPrompt && prompt.thread === state.previousPrompt.thread) {
    score += 1.1;
  }
  if (state.activeTags.has("hotline_open") && prompt.thread === "diplomacy") {
    score += 1.5;
  }
  if (state.activeTags.has("strike_ready") && prompt.thread === "military") {
    score += 1.6;
  }
  if (state.activeTags.has("verification") && prompt.thread === "intelligence") {
    score += 1.3;
  }
  if (state.activeTags.has("allies_reassured") && prompt.thread === "alliance") {
    score += 1.1;
  }
  if (state.stability < 45 && prompt.thread === "civilian") {
    score += 1.3;
  }
  if (state.commandPressure >= 65 && prompt.thread === "military") {
    score += 1.2;
  }
  if (state.intelTrust >= 65 && prompt.thread === "intelligence") {
    score += 1.1;
  }
  if (state.publicCredibility <= 40 && prompt.thread === "public") {
    score += 1.1;
  }
  if (state.escalationMomentum >= 65 && (prompt.thread === "military" || prompt.thread === "civilian")) {
    score += 0.9;
  }
  return score;
}

function getAvailablePrompts() {
  return PROMPTS.filter(promptAvailable);
}

function choosePrompt() {
  const available = getAvailablePrompts();
  if (!available.length) {
    return null;
  }

  const phase = getPhaseIndex();
  let filtered = available.filter((prompt) => prompt.phase === phase);
  if (!filtered.length) {
    filtered = available.filter((prompt) => Math.abs(prompt.phase - phase) <= 1);
  }
  if (!filtered.length) {
    filtered = available;
  }

  return [...filtered].sort((a, b) => promptStoryFit(b) - promptStoryFit(a))[0];
}

function describeTrend(key) {
  if (key === "relations") {
    if (state.relations >= 70) return "Relations with Vesper are strained but still salvageable through direct diplomacy.";
    if (state.relations >= 45) return "Relations remain fragile, with both governments still testing whether the other wants a way out.";
    return "Relations have deteriorated sharply, and Vesper is increasingly likely to read pressure as preparation for conflict.";
  }

  if (key === "readiness") {
    if (state.readiness >= 75) return "Military readiness is now highly visible, which may deter an attack but also compress everyone's decision time.";
    if (state.readiness >= 50) return "The armed forces are alert and capable, but not yet at the most dangerous threshold.";
    return "You have avoided the most dramatic force signals so far, preserving some room for political decisions to matter.";
  }

  if (key === "stability") {
    if (state.stability >= 70) return "Public order is holding, giving you more freedom to act deliberately instead of reacting to panic.";
    if (state.stability >= 45) return "The public is uneasy, and every new signal from your government is shaping whether fear spreads or settles.";
    return "Domestic anxiety is becoming a strategic factor of its own, increasing pressure for visible action.";
  }

  if (state.intel >= 70) return "Intelligence confidence is relatively strong, which lowers the risk of stumbling into escalation on bad information.";
  if (state.intel >= 45) return "Intelligence is useful but incomplete, forcing you to lead under uncertainty.";
  return "Confidence in the intelligence picture is weak, making this a dangerous time for dramatic moves.";
}

function describeHiddenTrend() {
  const lines = [];

  if (state.intelTrust >= 65) {
    lines.push("Analysts trust the verification culture in the room, making it easier for dissenting voices to slow a rush to judgment.");
  } else if (state.intelTrust <= 35) {
    lines.push("Analysts feel pressure to deliver certainty quickly, even when the data does not justify it.");
  }

  if (state.commandPressure >= 65) {
    lines.push("Command pressure is rising, and operational leaders are increasingly focused on reaction speed over ambiguity.");
  } else if (state.commandPressure <= 35) {
    lines.push("Military commanders still feel that civilian leadership is setting a disciplined tempo for the crisis.");
  }

  if (state.publicCredibility >= 65) {
    lines.push("Public credibility is helping your messages land as stabilizing signals rather than spin.");
  } else if (state.publicCredibility <= 35) {
    lines.push("Public credibility is fraying, which means even accurate messages may struggle to calm the country.");
  }

  if (state.escalationMomentum >= 68) {
    lines.push("Escalation momentum is now carrying events forward on its own, making each new move harder to contain.");
  } else if (state.escalationMomentum <= 32) {
    lines.push("Escalation momentum has slowed enough that deliberate choices can still redirect the crisis.");
  }

  return lines.slice(0, 2).join(" ");
}

function getLeadStat() {
  const stats = [
    ["relations", Math.abs(state.relations - 50)],
    ["readiness", Math.abs(state.readiness - 50)],
    ["stability", Math.abs(state.stability - 50)],
    ["intel", Math.abs(state.intel - 50)],
  ];
  return stats.sort((a, b) => b[1] - a[1])[0][0];
}

function getLeadSystem() {
  const systems = [
    ["intelTrust", Math.abs(state.intelTrust - 50)],
    ["commandPressure", Math.abs(state.commandPressure - 50)],
    ["publicCredibility", Math.abs(state.publicCredibility - 50)],
    ["escalationMomentum", Math.abs(state.escalationMomentum - 50)],
  ];
  return systems.sort((a, b) => b[1] - a[1])[0][0];
}

function recentDecisionSummary() {
  if (!state.history.length) {
    return "The first reports are still coming in, and every advisor in the room knows the opening decision will shape the entire night.";
  }

  const recent = state.history[state.history.length - 1];
  return `Your last order was to ${recent.choice.charAt(0).toLowerCase()}${recent.choice.slice(1)}. ${state.lastOutcomeText}`;
}

function narrativeTimeframe() {
  if (state.history.length <= 1) {
    return "early";
  }
  if (state.history.length <= 4) {
    return "middle";
  }
  return "late";
}

function adaptNarrativeText(text) {
  if (!text) {
    return text;
  }

  if (narrativeTimeframe() !== "early") {
    return text;
  }

  return text
    .replaceAll("earlier choices", "earlier decision")
    .replaceAll("previous choices", "previous decision")
    .replaceAll("earlier decisions", "earlier decision")
    .replaceAll("your decisions", "your decision")
    .replaceAll("your previous decisions", "your previous decision")
    .replaceAll("your previous choices", "your previous decision")
    .replaceAll("Messages sent earlier are now returning with consequences", "The message you sent earlier is already returning with consequences")
    .replaceAll("Analysts are trying to separate signal from noise, but your earlier choices already changed what data is trusted and how quickly the system wants to act on it.", "Analysts are trying to separate signal from noise, and your first decision already changed what data is trusted and how urgently the system wants to act on it.")
    .replaceAll("The civilian side of the crisis is catching up. Markets, schools, hospitals, and local governments are reacting to the atmosphere created by your previous decisions.", "The civilian side of the crisis is catching up. Markets, schools, hospitals, and local governments are already reacting to the atmosphere created by your first decision.")
    .replaceAll("Allies are responding not just to Vesper, but to you. The credibility and restraint you showed earlier are now influencing how much support they are willing to offer.", "Allies are responding not just to Vesper, but to you. The credibility and restraint you showed in your first move are already influencing how much support they are willing to offer.")
    .replaceAll("Whether this summit feels like weakness or leadership depends almost entirely on the road that got you here.", "Whether this summit feels like weakness or leadership already depends heavily on the path opened by your first decision.")
    .replaceAll("By now, uncertainty itself has become one of the main engines of danger. This proposal is an attempt to answer the questions your earlier choices left unresolved.", "Uncertainty is already becoming one of the main engines of danger. This proposal is an attempt to answer the questions your earlier decision left unresolved.")
    .replaceAll("This is a rare path. It only appears when your earlier choices created both communication and credibility.", "This is a rare path. It only appears when your early decisions created both communication and credibility.")
    .replaceAll("This is a rare negative branch created by a particularly dangerous mix of earlier choices.", "This is a rare negative branch created by a particularly dangerous mix of early decisions.")
    .replaceAll("This is a rare positive branch built from multiple earlier choices lining up well.", "This is a rare positive branch built from several early decisions lining up well.")
    .replaceAll("This split did not appear from nowhere. It is a delayed reaction to the tone, clarity, and discipline of your earlier decisions, and allies are now asking whether your strategy actually has an ending.", "This split did not appear from nowhere. It is a delayed reaction to the tone and discipline of your first decision, and allies are already asking whether your strategy actually has an ending.")
    .replaceAll("Because earlier decisions have already shaped your credibility, the leak will not land the same way in every run.", "Because your first decision has already shaped your credibility, the leak will not land the same way in every run.")
    .replaceAll("This is no longer just a military or diplomatic problem. Your earlier choices have changed how much the public trusts you, how much secrecy is still possible, and whether visible calm would feel believable.", "This is no longer just a military or diplomatic problem. Your first decision has already changed how much the public trusts you, how much secrecy is still possible, and whether visible calm would feel believable.")
    .replaceAll(`${ADVISORS.hawke} says the forces in the field are now acting on your earlier posture and need a clear signal, not a mixed one.`, `${ADVISORS.hawke} says the forces in the field are already reacting to the posture set by your first decision and need a clear signal, not a mixed one.`)
    .replaceAll(`${ADVISORS.vale} warns that the messages you sent earlier have created expectations, and Vesper will notice instantly if your tone changes now.`, `${ADVISORS.vale} warns that the message you sent earlier has already created expectations, and Vesper will notice instantly if your tone changes now.`)
    .replaceAll(`${ADVISORS.vale} says allied capitals are treating your previous choices as evidence of the kind of coalition leader you will be under pressure.`, `${ADVISORS.vale} says allied capitals are already treating your first decision as evidence of the kind of coalition leader you will be under pressure.`)
    .replaceAll("Because of everything that came before", "Because of what has already happened")
    .replaceAll("the road that got you here", "the path that has already opened");
}

function advisorCommentary(prompt) {
  const comments = [];

  if (prompt.thread === "military") {
    comments.push(
      `${ADVISORS.hawke} says the forces in the field are now acting on your earlier posture and need a clear signal, not a mixed one.`
    );
  }
  if (prompt.thread === "diplomacy") {
    comments.push(
      `${ADVISORS.vale} warns that the messages you sent earlier have created expectations, and Vesper will notice instantly if your tone changes now.`
    );
  }
  if (prompt.thread === "intelligence") {
    comments.push(
      `${ADVISORS.sora} reminds the room that crisis data becomes less trustworthy when leaders reward speed over scrutiny.`
    );
  }
  if (prompt.thread === "civilian") {
    comments.push(
      `${ADVISORS.ortiz} notes that the public is no longer watching from a distance; families and local leaders are starting to react to your decisions in real time.`
    );
  }
  if (prompt.thread === "alliance") {
    comments.push(
      `${ADVISORS.vale} says allied capitals are treating your previous choices as evidence of the kind of coalition leader you will be under pressure.`
    );
  }

  if (state.activeTags.has("hotline_open")) {
    comments.push("The hotline remains available, which means words still have a chance to compete with military signals.");
  }
  if (state.activeTags.has("hotline_cut")) {
    comments.push("Direct communication is weak right now, so any move in the field is more likely to be interpreted through fear.");
  }
  if (state.activeTags.has("media_leak")) {
    comments.push("Leaks are still shaping the narrative, making credibility almost as important as raw power.");
  }
  if (state.activeTags.has("strike_ready")) {
    comments.push("Strategic forces are visibly closer to action than they were at the start of the crisis.");
  }

  return comments.slice(0, 2).join(" ");
}

function buildPromptNarrative(prompt) {
  const bridge = adaptNarrativeText(THREAD_BRIDGES[prompt.thread]);
  const statLine = describeTrend(getLeadStat());
  const hiddenLine = describeHiddenTrend();
  const carryover = recentDecisionSummary();
  const advisorLine = adaptNarrativeText(advisorCommentary(prompt));
  const segments = [carryover, bridge, prompt.body];

  if (prompt.followup) {
    segments.push(adaptNarrativeText(prompt.followup));
  }
  segments.push(statLine);
  if (hiddenLine) {
    segments.push(hiddenLine);
  }
  if (advisorLine) {
    segments.push(advisorLine);
  }

  return segments.join("\n\n");
}

function renderNarrative(title, body, phaseText) {
  elements.screenTitle.textContent = title;
  elements.phaseBadge.textContent = `Phase: ${phaseText}`;
  elements.screenBody.innerHTML = body
    .split("\n")
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");
}

function renderChoices(prompt) {
  elements.choices.innerHTML = "";
  const options = prompt.options.filter(optionAvailable);

  options.forEach((option) => {
    const fragment = elements.choiceTemplate.content.cloneNode(true);
    const button = fragment.querySelector(".choice-card");
    fragment.querySelector(".choice-label").textContent = option.label;
    fragment.querySelector(".choice-effect").textContent = option.effect;
    button.addEventListener("click", () => applyChoice(prompt, option));
    elements.choices.appendChild(fragment);
  });
}

function updateMeters() {
  const stats = [
    ["relations", elements.relationsValue, elements.relationsMeter],
    ["readiness", elements.readinessValue, elements.readinessMeter],
    ["stability", elements.stabilityValue, elements.stabilityMeter],
    ["intel", elements.intelValue, elements.intelMeter],
  ];

  stats.forEach(([key, valueEl, meterEl]) => {
    valueEl.textContent = state[key];
    meterEl.style.width = `${state[key]}%`;
    if (key === "readiness" && state[key] > 75) {
      meterEl.style.background = "linear-gradient(90deg, #ff9f55, #ff5d6b)";
    } else if ((key === "relations" || key === "stability") && state[key] > 65) {
      meterEl.style.background = "linear-gradient(90deg, #57f29d, #abffd1)";
    } else {
      meterEl.style.background = "linear-gradient(90deg, #57d7ff, #9ff7ff)";
    }
  });
}

function renderDefcon() {
  elements.defconValue.textContent = state.defcon;
  elements.defconLabel.textContent = DEFCON_LABELS[state.defcon];
  elements.turnBadge.textContent = `Decision ${state.turn} / ${state.totalTurns}`;
  [...elements.defconTrack.children].forEach((row) => {
    const level = Number(row.dataset.level);
    row.classList.toggle("active", level === state.defcon);
  });
}

function renderLog() {
  elements.eventLog.innerHTML = "";
  state.eventLog.slice(-8).forEach((entry) => {
    const item = document.createElement("li");
    item.textContent = entry;
    elements.eventLog.appendChild(item);
  });
}

function renderTags() {
  elements.tagList.innerHTML = "";
  if (!state.activeTags.size) {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = "No special conditions";
    elements.tagList.appendChild(tag);
    return;
  }

  [...state.activeTags]
    .sort()
    .forEach((name) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = TAG_LABELS[name] || name.replaceAll("_", " ");
      elements.tagList.appendChild(tag);
    });
}

function refreshDashboard() {
  updateMeters();
  renderDefcon();
  renderLog();
  renderTags();
}

function nextTurn() {
  if (state.turn >= state.totalTurns) {
    renderEnding();
    return;
  }

  const prompt = choosePrompt();
  if (!prompt) {
    renderEnding();
    return;
  }

  state.currentPrompt = prompt;
  state.usedPrompts.add(prompt.id);
  const phaseName = PHASES[prompt.phase];
  renderNarrative(prompt.title, buildPromptNarrative(prompt), phaseName);
  renderChoices(prompt);
  refreshDashboard();
}

function summarizeImpact(deltas) {
  const parts = [];
  if ((deltas.relations || 0) >= 5) parts.push("Diplomatic space widened");
  if ((deltas.relations || 0) <= -5) parts.push("Relations hardened");
  if ((deltas.readiness || 0) >= 5) parts.push("Military alert levels visibly rose");
  if ((deltas.readiness || 0) <= -3) parts.push("Military posture relaxed slightly");
  if ((deltas.stability || 0) >= 4) parts.push("Public confidence steadied");
  if ((deltas.stability || 0) <= -4) parts.push("Public anxiety deepened");
  if ((deltas.intel || 0) >= 4) parts.push("Decision-makers gained clearer information");
  if ((deltas.intel || 0) <= -3) parts.push("The intelligence picture became murkier");
  if ((deltas.defcon || 0) >= 1) parts.push("The immediate nuclear risk eased");
  if ((deltas.defcon || 0) <= -1) parts.push("DEFCON pressure intensified");
  return parts.join(". ") || "The room absorbed the decision and waited to see how the next pressure point would hit.";
}

function choicePosture(option) {
  const text = `${option.label} ${option.effect}`.toLowerCase();

  const reasonableTerms = [
    "calm",
    "investigation",
    "joint",
    "diplomatic",
    "backchannel",
    "hotline",
    "verify",
    "verification",
    "technical review",
    "inspection",
    "summit",
    "ceasefire",
    "withdraw",
    "pullback",
    "reassure",
    "stay calm",
    "address the nation",
    "de-escalation",
  ];
  const hardlineTerms = [
    "strike",
    "aggressive",
    "maximum-force",
    "dispersal",
    "retaliatory",
    "pressure",
    "sanctions",
    "deploy",
    "war footing",
    "alert moves",
    "prepare",
    "mirror",
  ];

  if (reasonableTerms.some((term) => text.includes(term))) {
    return "reasonable";
  }
  if (hardlineTerms.some((term) => text.includes(term))) {
    return "hardline";
  }
  return "mixed";
}

function applyDirectDeltas(extraDeltas) {
  state.defcon = clamp(state.defcon + (extraDeltas.defcon || 0), 1, 5);
  state.relations = clamp(state.relations + (extraDeltas.relations || 0), 0, 100);
  state.readiness = clamp(state.readiness + (extraDeltas.readiness || 0), 0, 100);
  state.stability = clamp(state.stability + (extraDeltas.stability || 0), 0, 100);
  state.intel = clamp(state.intel + (extraDeltas.intel || 0), 0, 100);
}

function maybeApplyContextualComplication(prompt, option) {
  const posture = choicePosture(option);
  const twistRoll = Math.random();

  if (posture === "reasonable") {
    let complicationChance = 0.04;
    if (state.relations <= 40) complicationChance += 0.08;
    if (state.commandPressure >= 65) complicationChance += 0.08;
    if (state.publicCredibility <= 40) complicationChance += 0.06;
    if (state.activeTags.has("media_leak")) complicationChance += 0.07;
    if (state.activeTags.has("hotline_cut")) complicationChance += 0.08;
    if (state.escalationMomentum >= 65) complicationChance += 0.07;

    if (twistRoll < complicationChance) {
      let message = "The move was reasonable, but the crisis context twisted its effect.";
      let extraDeltas = { relations: -3, stability: -2, readiness: 2, intel: -1, defcon: -1 };

      if (state.activeTags.has("media_leak")) {
        message = "A leak reframed your restraint as weakness before the public could hear the full explanation.";
        extraDeltas = { stability: -4, relations: -2, intel: -1, defcon: -1 };
      } else if (state.activeTags.has("hotline_cut") || state.relations <= 35) {
        message = "Vesper misread your restraint as a cover for military preparation, and mistrust deepened anyway.";
        extraDeltas = { relations: -4, readiness: 3, defcon: -1 };
      } else if (state.commandPressure >= 65) {
        message = "Senior commanders interpreted the delay as dangerous hesitation, increasing pressure inside your own government.";
        extraDeltas = { readiness: 3, stability: -1, intel: -1 };
      } else if (state.stability <= 40) {
        message = "Public anxiety outran the calm signal, and panic spread faster than your message did.";
        extraDeltas = { stability: -4 };
      }

      applyDirectDeltas(extraDeltas);
      state.commandPressure = clamp(state.commandPressure + 6, 0, 100);
      state.publicCredibility = clamp(state.publicCredibility - 4, 0, 100);
      state.escalationMomentum = clamp(state.escalationMomentum + 8, 0, 100);
      state.complicationCount += 1;
      state.lastOutcomeText = `${state.lastOutcomeText} ${message}`;
      state.eventLog.push(message);
      return;
    }
  }

  if (posture === "hardline") {
    let stabilizationChance = 0.02;
    if (state.stability <= 40) stabilizationChance += 0.08;
    if (state.publicCredibility <= 40) stabilizationChance += 0.05;
    if (state.relations <= 35) stabilizationChance += 0.04;

    if (twistRoll < stabilizationChance) {
      const message =
        "The hardline move steadied the room in the short term, even though it also made the crisis more dangerous overall.";
      applyDirectDeltas({ stability: 3, relations: 1 });
      state.publicCredibility = clamp(state.publicCredibility + 4, 0, 100);
      state.hardlineStabilizations += 1;
      state.lastOutcomeText = `${state.lastOutcomeText} ${message}`;
      state.eventLog.push(message);
    }
  }
}

function applyHiddenConsequences(prompt, option, deltas) {
  let intelTrustDelta = 0;
  let commandPressureDelta = 0;
  let publicCredibilityDelta = 0;
  let escalationMomentumDelta = 0;

  if (prompt.thread === "intelligence") {
    intelTrustDelta += 2;
  }
  if (prompt.thread === "military") {
    commandPressureDelta += 2;
  }
  if (prompt.thread === "public" || prompt.thread === "civilian") {
    publicCredibilityDelta += 1;
  }

  if ((deltas.intel || 0) >= 4) {
    intelTrustDelta += 5;
  }
  if ((deltas.intel || 0) <= -3) {
    intelTrustDelta -= 6;
  }
  if ((deltas.readiness || 0) >= 5) {
    commandPressureDelta += 6;
    escalationMomentumDelta += 5;
  }
  if ((deltas.readiness || 0) <= -3) {
    commandPressureDelta -= 5;
    escalationMomentumDelta -= 3;
  }
  if ((deltas.stability || 0) >= 4) {
    publicCredibilityDelta += 5;
  }
  if ((deltas.stability || 0) <= -4) {
    publicCredibilityDelta -= 6;
  }
  if ((deltas.relations || 0) >= 5) {
    escalationMomentumDelta -= 4;
  }
  if ((deltas.relations || 0) <= -5) {
    escalationMomentumDelta += 5;
  }
  if ((deltas.defcon || 0) >= 1) {
    commandPressureDelta -= 3;
    escalationMomentumDelta -= 5;
  }
  if ((deltas.defcon || 0) <= -1) {
    commandPressureDelta += 5;
    escalationMomentumDelta += 7;
  }

  const labels = `${option.label} ${option.effect}`.toLowerCase();
  if (labels.includes("verify") || labels.includes("inspection") || labels.includes("technical review")) {
    intelTrustDelta += 7;
  }
  if (labels.includes("leak") || labels.includes("deny")) {
    publicCredibilityDelta -= 4;
  }
  if (labels.includes("address the nation") || labels.includes("stay calm") || labels.includes("reassure")) {
    publicCredibilityDelta += 5;
  }
  if (labels.includes("summit") || labels.includes("backchannel") || labels.includes("hotline")) {
    escalationMomentumDelta -= 4;
  }
  if (labels.includes("strike") || labels.includes("dispersal") || labels.includes("maximum-force")) {
    commandPressureDelta += 5;
    escalationMomentumDelta += 6;
  }

  if (state.activeTags.has("media_leak")) {
    publicCredibilityDelta -= 2;
  }
  if (state.activeTags.has("hotline_open")) {
    escalationMomentumDelta -= 2;
  }
  if (state.activeTags.has("hotline_cut")) {
    escalationMomentumDelta += 3;
    commandPressureDelta += 2;
  }
  if (state.activeTags.has("verification")) {
    intelTrustDelta += 2;
  }
  if (state.activeTags.has("strike_ready")) {
    commandPressureDelta += 3;
  }

  state.intelTrust = clamp(state.intelTrust + intelTrustDelta, 0, 100);
  state.commandPressure = clamp(state.commandPressure + commandPressureDelta, 0, 100);
  state.publicCredibility = clamp(state.publicCredibility + publicCredibilityDelta, 0, 100);
  state.escalationMomentum = clamp(state.escalationMomentum + escalationMomentumDelta, 0, 100);
}

function updateNarrativeFocus(prompt, option) {
  if (option.addTags?.includes("backchannel") || option.addTags?.includes("hotline_open")) {
    state.narrativeFocus = "diplomacy";
    return;
  }
  if (option.addTags?.includes("strike_ready") || prompt.thread === "military") {
    state.narrativeFocus = "military";
    return;
  }
  if (option.addTags?.includes("verification") || prompt.thread === "intelligence") {
    state.narrativeFocus = "intelligence";
    return;
  }
  if (option.addTags?.includes("allies_reassured") || prompt.thread === "alliance") {
    state.narrativeFocus = "alliance";
    return;
  }
  if (option.addTags?.includes("evacuation") || prompt.thread === "civilian") {
    state.narrativeFocus = "civilian";
    return;
  }
  state.narrativeFocus = "public";
}

function applyChoice(prompt, option) {
  const deltas = option.deltas || {};
  state.turn += 1;
  state.defcon = clamp(state.defcon + (deltas.defcon || 0), 1, 5);
  state.relations = clamp(state.relations + (deltas.relations || 0), 0, 100);
  state.readiness = clamp(state.readiness + (deltas.readiness || 0), 0, 100);
  state.stability = clamp(state.stability + (deltas.stability || 0), 0, 100);
  state.intel = clamp(state.intel + (deltas.intel || 0), 0, 100);

  (option.addTags || []).forEach((tag) => state.activeTags.add(tag));
  (option.removeTags || []).forEach((tag) => state.activeTags.delete(tag));
  (option.addFlags || []).forEach((flag) => state.decisionFlags.add(flag));
  (option.removeFlags || []).forEach((flag) => state.decisionFlags.delete(flag));
  applyHiddenConsequences(prompt, option, deltas);

  state.lastImpact = deltas;
  state.lastOutcomeText = summarizeImpact(deltas);
  maybeApplyContextualComplication(prompt, option);
  state.previousPrompt = prompt;
  updateNarrativeFocus(prompt, option);

  state.history.push({
    turn: state.turn,
    prompt: prompt.title,
    choice: option.label,
    effect: option.effect,
    outcome: state.lastOutcomeText,
  });

  if (option.log) {
    state.eventLog.push(`${option.log} ${state.lastOutcomeText}.`);
  }

  if (state.defcon <= 2 && state.readiness > 70) {
    state.activeTags.add("strike_ready");
  }
  if (state.relations >= 65) {
    state.activeTags.add("summit_path");
  }
  if (state.intel >= 70) {
    state.activeTags.add("verification");
  }
  if (state.stability <= 35) {
    state.activeTags.add("evacuation");
  }
  if (state.intelTrust >= 68) {
    state.decisionFlags.add("analysts_empowered");
  }
  if (state.commandPressure >= 70) {
    state.decisionFlags.add("command_tense");
  }
  if (state.publicCredibility <= 35) {
    state.decisionFlags.add("credibility_crisis");
  }
  if (state.escalationMomentum >= 72) {
    state.decisionFlags.add("momentum_runaway");
  }

  nextTurn();
}

const ENDINGS = [
  {
    title: "Reykjavik Moment",
    tone: "Rare positive",
    rarity: "rare",
    summary:
      "A rare convergence of verification, diplomacy, and allied discipline produces a genuine breakthrough. The crisis ends not only with de-escalation, but with the foundations of a new stability framework.",
    when: () =>
      state.decisionFlags.has("midnight_package_accepted") &&
      state.decisionFlags.has("shared_warning_center") &&
      state.defcon >= 4 &&
      state.relations >= 75 &&
      state.complicationCount <= 1,
  },
  {
    title: "Verified Peace Accord",
    tone: "Positive",
    summary:
      "Norhaven and Vesper sign a monitored accord that stabilizes the Gray Strait, restores communication channels, and creates enough inspection capacity to lower the near-term nuclear risk dramatically.",
    when: () =>
      state.decisionFlags.has("ceasefire_signed") &&
      state.decisionFlags.has("inspections_accepted") &&
      state.defcon >= 4 &&
      state.complicationCount <= 2,
  },
  {
    title: "Summit Breakthrough",
    tone: "Positive",
    summary:
      "The summit succeeds. Both governments step back publicly, and your willingness to pair firmness with restraint gives each side room to claim dignity while lowering the temperature.",
    when: () =>
      state.decisionFlags.has("summit_held_under_pressure") &&
      state.relations >= 68 &&
      state.defcon >= 4 &&
      state.complicationCount <= 2,
  },
  {
    title: "Alliance-Led Stabilization",
    tone: "Positive",
    summary:
      "Your coalition stays together long enough to steady the crisis. Allied coordination, shared transparency, and disciplined messaging create a path out of the most dangerous phase.",
    when: () =>
      state.decisionFlags.has("allied_call_held") &&
      state.activeTags.has("allies_reassured") &&
      state.defcon >= 4 &&
      state.complicationCount <= 2,
  },
  {
    title: "Quiet Strategic Reset",
    tone: "Positive",
    summary:
      "No grand handshake defines the ending, but your government quietly restores predictability to the crisis. Better verification, lower readiness, and careful messaging keep the danger from returning overnight.",
    when: () =>
      state.activeTags.has("verification") &&
      state.readiness <= 52 &&
      state.defcon >= 4 &&
      state.intel >= 70 &&
      state.intelTrust >= 65 &&
      state.escalationMomentum <= 40 &&
      state.complicationCount <= 1,
  },
  {
    title: "Public Calm, Private Compromise",
    tone: "Positive",
    summary:
      "You stabilize the domestic picture while negotiators do the real work offstage. The public sees calm, the military sees discipline, and Vesper sees enough seriousness to compromise.",
    when: () =>
      state.stability >= 72 &&
      state.decisionFlags.has("deescalation_speech") &&
      state.publicCredibility >= 65 &&
      state.complicationCount <= 2 &&
      (state.decisionFlags.has("quiet_assurances") || state.decisionFlags.has("quiet_inspections")),
  },
  {
    title: "Shared Warning Center Pilot",
    tone: "Rare neutral",
    rarity: "rare",
    summary:
      "The crisis ends in a tense draw, but the false-alarm scare leaves both sides shaken enough to begin a joint warning-system pilot. It is not peace, but it may prevent the next crisis from being worse.",
    when: () =>
      state.decisionFlags.has("shared_warning_center") &&
      state.defcon >= 3 &&
      state.relations >= 50 &&
      state.complicationCount >= 1,
  },
  {
    title: "Armed Truce",
    tone: "Neutral",
    summary:
      "The shooting never starts, but neither side truly backs down. A practical truce emerges in the strait while military forces stay visibly ready and mistrust remains high.",
    when: () =>
      state.activeTags.has("ceasefire") &&
      state.readiness >= 55 &&
      state.defcon >= 3 &&
      state.complicationCount >= 1,
  },
  {
    title: "Frozen Strait",
    tone: "Neutral",
    summary:
      "The crisis cools into a hard-edged maritime standoff. Patrols remain heavy, communication is limited, and everyone leaves the table believing the next confrontation could come soon.",
    when: () =>
      state.activeTags.has("naval_standoff") &&
      state.defcon >= 3 &&
      state.relations < 60 &&
      state.relations >= 40 &&
      state.complicationCount >= 1,
  },
  {
    title: "Summit Without Trust",
    tone: "Neutral",
    summary:
      "Talks happen, but they produce process more than trust. The summit prevents immediate disaster without resolving the deeper strategic rivalry driving the crisis.",
    when: () =>
      (state.decisionFlags.has("summit_accepted") || state.decisionFlags.has("envoy_first")) &&
      state.relations >= 50 &&
      state.relations < 68 &&
      state.complicationCount >= 1,
  },
  {
    title: "Coalition Friction, Crisis Contained",
    tone: "Neutral",
    summary:
      "Your allies do not leave you, but they do leave the crisis differently. The immediate danger passes, yet the coalition emerges more brittle and less trusting than before.",
    when: () =>
      (state.decisionFlags.has("allied_fracture_deepened") || state.decisionFlags.has("allied_frustration")) &&
      state.defcon >= 3 &&
      state.complicationCount <= 2,
  },
  {
    title: "Domestic Calm, International Chill",
    tone: "Neutral",
    summary:
      "You restore public confidence at home, but the international confrontation hardens into something colder and longer. Citizens sleep easier than diplomats do.",
    when: () => state.stability >= 70 && state.relations < 50 && state.defcon >= 3 && state.complicationCount >= 1,
  },
  {
    title: "Technical Lessons, Political Scars",
    tone: "Neutral",
    summary:
      "The crisis forces improvements in warning procedures and command discipline, but it also leaves deep political scars in both capitals. The machinery learns faster than the politics do.",
    when: () =>
      state.activeTags.has("ai_false_alarm") &&
      state.intel >= 68 &&
      state.intelTrust >= 60 &&
      state.stability < 65 &&
      state.complicationCount >= 1,
  },
  {
    title: "Escalatory Spiral",
    tone: "Negative",
    summary:
      "Each side answers pressure with more pressure. The region settles into an unstable military confrontation with elevated readiness, weak trust, and a high chance of future crisis.",
    when: () =>
      (state.readiness >= 72 && state.relations < 45 && state.defcon <= 2) ||
      (state.escalationMomentum >= 72 && state.complicationCount >= 2 && state.defcon <= 3),
  },
  {
    title: "Regional Conventional War",
    tone: "Negative",
    summary:
      "Nuclear weapons are not used, but the crisis spills into open conventional combat. Airfields, ships, and infrastructure are hit across the region, and no one believes the line will hold for long.",
    when: () =>
      state.decisionFlags.has("field_flexibility_granted") &&
      state.readiness >= 78 &&
      state.defcon <= 2,
  },
  {
    title: "Naval Misfire Crisis",
    tone: "Negative",
    summary:
      "A maritime confrontation remains unresolved, and a dangerous incident at sea becomes the symbol of a crisis neither capital truly controls. The next spark may come from the deck of a ship, not a presidential speech.",
    when: () =>
      (state.decisionFlags.has("naval_incident_public") || state.decisionFlags.has("aggressive_shadow")) &&
      state.defcon <= 2,
  },
  {
    title: "Cyber Panic Doctrine",
    tone: "Negative",
    summary:
      "The crisis ends with a damaging lesson: cyber pressure is now seen as normal in nuclear brinkmanship. Civilian systems remain vulnerable, and both sides emerge more fearful and more trigger-ready.",
    when: () =>
      state.decisionFlags.has("cyber_escalation_doubled") &&
      state.activeTags.has("cyber_disruption") &&
      state.escalationMomentum >= 58,
  },
  {
    title: "Alliance Split and Rearmament",
    tone: "Negative",
    summary:
      "The immediate crisis passes, but your coalition splinters over how you handled it. Several states begin rearming independently, convinced collective discipline cannot be trusted next time.",
    when: () =>
      state.decisionFlags.has("allied_fracture_deepened") &&
      state.readiness >= 58,
  },
  {
    title: "Martial Calm, Democratic Strain",
    tone: "Negative",
    summary:
      "You restore a kind of order, but only through visible control, relocation, and emergency messaging that leave democratic trust weakened. The state looks calm from above and brittle underneath.",
    when: () =>
      state.activeTags.has("evacuation") &&
      state.stability < 45 &&
      state.publicCredibility < 45 &&
      state.defcon >= 2,
  },
  {
    title: "Decapitation Scare",
    tone: "Rare negative",
    rarity: "rare",
    summary:
      "A particularly dangerous mix of strike planning and broken communication convinces Vesper that its leadership may be targeted. The crisis survives, but only barely, and future leaders study this episode as a warning.",
    when: () => state.decisionFlags.has("decapitation_scare_uncontained") || (state.complicationCount >= 3 && state.commandPressure >= 75),
  },
  {
    title: "Edge of Nuclear Exchange",
    tone: "Negative",
    summary:
      "Your choices push both states to the lip of catastrophe. Nuclear weapons are not launched in this timeline, but command systems, public messaging, and military posture are all strained to the breaking point.",
    when: () =>
      state.defcon === 1 &&
      state.readiness >= 82 &&
      state.relations <= 25 &&
      state.escalationMomentum >= 68 &&
      !state.decisionFlags.has("authentication_crisis_ignored"),
  },
  {
    title: "World After Midnight",
    tone: "Catastrophic",
    summary:
      "A chain of failures collapses restraint on both sides. Nuclear exchange spreads beyond the original crisis, allied commitments trigger wider launches, and the simulation ends with the destruction of the world students knew.",
    when: () =>
      state.defcon <= 1 &&
      state.readiness >= 90 &&
      state.relations <= 18 &&
      state.decisionFlags.has("authentication_crisis_ignored") &&
      state.decisionFlags.has("field_flexibility_granted") &&
      state.escalationMomentum >= 82 &&
      state.commandPressure >= 78,
  },
  {
    title: "Limited Nuclear Exchange",
    tone: "Catastrophic",
    summary:
      "Miscalculation and compressed decision time lead to nuclear use on a limited scale. The world survives, but cities do not, and the political order that follows will be shaped by trauma, ash, and permanent fear.",
    when: () =>
      state.defcon <= 1 &&
      state.readiness >= 84 &&
      state.relations <= 24 &&
      state.escalationMomentum >= 72 &&
      (state.decisionFlags.has("decapitation_scare_uncontained") ||
        state.decisionFlags.has("authentication_crisis_ignored") ||
        (state.complicationCount >= 4 && state.commandPressure >= 74)),
  },
  {
    title: "Fragile Off-Ramp",
    tone: "Neutral",
    summary:
      "The crisis cools, but not cleanly. Some channels reopen and the immediate danger passes, yet your government will need follow-up diplomacy to keep this from becoming the first scene of a second crisis.",
    when: () => true,
  },
];

function endingCategory() {
  return ENDINGS.find((ending) => ending.when()) || ENDINGS[ENDINGS.length - 1];
}

function educatorDebrief(ending) {
  const notes = [];

  if (state.activeTags.has("verification")) {
    notes.push(
      "You repeatedly prioritized verified information. That matters in nuclear crises because false alarms and incomplete data can create catastrophic pressure to act too quickly."
    );
  } else {
    notes.push(
      "Verification stayed weak in your run. A key classroom takeaway is that nuclear crises become far more dangerous when leaders act on uncertain or politicized information."
    );
  }

  if (state.activeTags.has("hotline_open") || state.activeTags.has("backchannel")) {
    notes.push(
      "Communication channels helped shape your outcome. Hotlines, ambassadors, and backchannels can slow escalation by replacing assumptions with direct signals."
    );
  } else {
    notes.push(
      "Your government had limited direct communication with Vesper. That often increases the odds that ordinary military moves are interpreted in the worst possible way."
    );
  }

  if (state.readiness > 75) {
    notes.push(
      "You leaned heavily on military readiness. Deterrence can prevent attacks, but in nuclear contexts visible readiness can also convince the other side that time is running out."
    );
  } else {
    notes.push(
      "You avoided the most extreme military postures. That reduced immediate danger, though it sometimes made domestic politics and alliance management harder."
    );
  }

  if (ending.tone.includes("Positive")) {
    notes.push(
      "This path highlights how diplomacy, verification, and public reassurance can work together. De-escalation is rarely one heroic moment; it is usually a series of disciplined decisions."
    );
  } else if (ending.tone === "Catastrophic" || ending.title === "Edge of Nuclear Exchange") {
    notes.push(
      "This outcome is a reminder that nuclear war does not require anyone to want apocalypse. Misperception, pressure, pride, and fear can be enough to bring leaders to the brink."
    );
  } else {
    notes.push(
      "This mixed ending is useful for discussion because most real crises do not end neatly. Leaders often succeed in one area while making riskier choices elsewhere."
    );
  }

  return notes;
}

function renderEnding() {
  const ending = endingCategory();
  const reflections = state.history
    .map(
      (entry) =>
        `<li><strong>Decision ${entry.turn}:</strong> ${entry.prompt} - ${entry.choice}. ${entry.outcome}.</li>`
    )
    .join("");
  const debrief = educatorDebrief(ending)
    .map((note) => `<p>${note}</p>`)
    .join("");

  renderNarrative(
    ending.title,
    `${ending.summary}\n\nThe crisis that began with a collision in the Gray Strait ended after ${state.turn} presidential decisions. Final posture: DEFCON ${state.defcon}, diplomatic relations ${state.relations}, military readiness ${state.readiness}, public stability ${state.stability}, intelligence confidence ${state.intel}.`,
    "Simulation Complete"
  );

  elements.choices.innerHTML = `
    <section class="ending-grid">
      <div class="ending-card">
        <h3>${ending.tone}</h3>
        <p>${ending.summary}</p>
      </div>
      <div class="ending-card">
        <h3>Educator Debrief</h3>
        ${debrief}
      </div>
      <div class="ending-card">
        <h3>Decision Reflection</h3>
        <ol class="reflection-list">${reflections}</ol>
      </div>
      <button class="primary-button" id="restartButton">Run simulation again</button>
    </section>
  `;

  document
    .getElementById("restartButton")
    .addEventListener("click", initializeSimulation);
  elements.phaseBadge.textContent = "Phase: Simulation Complete";
  refreshDashboard();
}

function initializeSimulation() {
  state.started = true;
  state.turn = 0;
  state.totalTurns = 15 + Math.floor(Math.random() * 6);
  state.defcon = 4;
  state.relations = 50;
  state.readiness = 50;
  state.stability = 55;
  state.intel = 50;
  state.intelTrust = 50;
  state.commandPressure = 45;
  state.publicCredibility = 50;
  state.escalationMomentum = 40;
  state.complicationCount = 0;
  state.hardlineStabilizations = 0;
  state.usedPrompts = new Set();
  state.activeTags = new Set();
  state.decisionFlags = new Set();
  state.history = [];
  state.previousPrompt = null;
  state.currentPrompt = null;
  state.narrativeFocus = "public";
  state.lastOutcomeText =
    "Advisors are still piecing together what happened in the strait, and everyone in the room knows your first instinct will set the tone.";
  state.lastImpact = null;
  state.eventLog = [
    "Crisis monitor initialized.",
    "Naval collision reported in the Gray Strait.",
    `Simulation length locked at ${state.totalTurns} decisions.`,
  ];

  elements.startWrap.hidden = true;
  refreshDashboard();
  nextTurn();
}

buildDefconTrack();
refreshDashboard();
elements.startButton.addEventListener("click", initializeSimulation);
