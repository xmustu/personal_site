import { NextResponse } from "next/server";

type ContactPayload = {
  name: string;
  email: string;
  message: string;
  website?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const body = (await request.json()) as ContactPayload;
  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();
  const website = body.website?.trim();

  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (!name || !email || !message || !isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid form payload." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();

  if (!apiKey || !to || !from) {
    return NextResponse.json(
      { error: "Email provider is not configured yet." },
      { status: 503 },
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `[Personal Site] New message from ${name}`,
      reply_to: email,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to send email with Resend." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
