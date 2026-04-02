export async function sendEmailNotification({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  const response = await fetch("/api/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ to, subject, text }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || "Unable to send email");
  }

  return data;
}
