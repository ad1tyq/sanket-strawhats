import { NextRequest, NextResponse } from 'next/server';
import { twiml } from 'twilio';

const diseaseMap: { [key: string]: string } = {
  '1': 'cholera', '2': 'typhoid', '3': 'diarrhea', '4': 'jaundice', '5': 'dysentery',
};

export async function POST(request: NextRequest) {
  try {
    const body = new URLSearchParams(await request.text());
    const diseaseDigit = body.get('Digits[0]') as string;
    const caseCount = body.get('Digits') as string;
    const fromNumber = body.get('From') as string;
    const diseaseType = diseaseMap[diseaseDigit];

    console.log(`✅ IVR Report Received from ${fromNumber}: Disease: ${diseaseType}, Cases: ${caseCount}`);

    // In the future, you'll save this to your Prisma database here.
    
    const voiceResponse = new twiml.VoiceResponse();
    voiceResponse.say({ voice: 'alice', language: 'en-IN' }, 'Thank you. Your report is submitted. Goodbye.');

    return new NextResponse(voiceResponse.toString(), { headers: { 'Content-Type': 'text/xml' } });
  } catch (error) {
    console.error("Error processing IVR report:", error);
    const voiceResponse = new twiml.VoiceResponse();
    voiceResponse.say({ voice: 'alice', language: 'en-IN' }, 'Sorry, an error occurred.');
    return new NextResponse(voiceResponse.toString(), { status: 500, headers: { 'Content-Type': 'text/xml' } });
  }
}
