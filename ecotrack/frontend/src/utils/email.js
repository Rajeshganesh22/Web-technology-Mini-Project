// EmailJS — works on ANY network including college WiFi
const SERVICE_ID  = "service_ecotrack";
const TEMPLATE_ID = "template_ecotrack";
const PUBLIC_KEY  = "YOUR_EMAILJS_PUBLIC_KEY";

async function send(toEmail, toName, subject, message) {
  try {
    await window.emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      to_email: toEmail,
      to_name:  toName,
      subject,
      message,
    }, PUBLIC_KEY);
    console.log(`📧 Email sent to ${toEmail}`);
  } catch (err) {
    console.error("Email error:", err.text || err.message);
  }
}

export async function sendWelcomeEmail(toEmail, toName) {
  await send(toEmail, toName,
    "🌿 Welcome to EcoTrack!",
    `Hi ${toName},\n\nWelcome to EcoTrack! Your account has been created.\n\n📸 Report issues · ▲ Upvote · 🏆 Earn Green Points\n\n🌿 EcoTrack Team`
  );
}

export async function sendIssueEmail(toEmail, toName, issue) {
  await send(toEmail, toName,
    `📋 Issue Reported: ${issue.title}`,
    `Hi ${toName},\n\nYour issue was reported!\n\nTitle: ${issue.title}\nType: ${issue.type}\nSeverity: ${issue.severity}\nLocation: ${issue.location}\n\nYou earned +10 Green Points!\n\n🌿 EcoTrack Team`
  );
}

export async function sendStatusEmail(toEmail, toName, issue, newStatus) {
  const emoji = newStatus === "Resolved" ? "✅" : "🔧";
  const bonus = newStatus === "Resolved" ? "\n\nYou earned +20 Bonus Green Points! 🎉" : "";
  await send(toEmail, toName,
    `${emoji} Issue ${newStatus}: ${issue.title}`,
    `Hi ${toName},\n\nYour issue status changed to: ${newStatus}\n\nIssue: ${issue.title}\nLocation: ${issue.location}${bonus}\n\n🌿 EcoTrack Team`
  );
}
