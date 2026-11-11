import React, { useState } from 'react';
import { Copy, Link as LinkIcon, MessageSquareText } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { WEDDING } from './config';
import { PREFIXES, Prefix, buildDisplayName, buildInviteLink } from './guest';

function buildMessage(displayName: string, link: string): string {
  return `Dear ${displayName} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${WEDDING.groom} & ${WEDDING.bride}`;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers / non-secure contexts
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  }
}

export function AdminPage() {
  const [prefix, setPrefix] = useState<Prefix>('Mr.');
  const [guestName, setGuestName] = useState('');
  const [generated, setGenerated] = useState<{ displayName: string; link: string; message: string } | null>(null);

  const handleGenerate = (e?: React.FormEvent) => {
    e?.preventDefault();
    const displayName = buildDisplayName(prefix, guestName);
    if (!displayName) {
      toast.error('Please enter a guest name.');
      return;
    }
    const link = buildInviteLink(window.location.origin, displayName);
    setGenerated({ displayName, link, message: buildMessage(displayName, link) });
  };

  const handleCopy = async (text: string, label: string) => {
    if (await copyText(text)) toast.success(label);
    else toast.error('Could not copy. Please copy it manually.');
  };

  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-brand-beige focus:ring-2 focus:ring-brand-beige-deep focus:border-transparent outline-none transition-all bg-white font-sans';

  return (
    <div className="min-h-screen bg-brand-ivory py-12 px-4 sm:px-6 font-sans text-stone-800 flex items-start sm:items-center justify-center">
      <Toaster position="top-center" />
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-[0_8px_30px_rgba(176,137,104,0.15)] border border-brand-beige/50">
        <div className="px-6 py-8 sm:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-2 text-stone-800">Invitation Link Generator</h2>
            <p className="text-stone-500 text-xs uppercase tracking-[0.2em]">
              {WEDDING.groom} &amp; {WEDDING.bride}
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label htmlFor="prefix" className="block text-sm font-medium text-stone-700 mb-1">
                Select Prefix
              </label>
              <select
                id="prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value as Prefix)}
                className={inputClass}
              >
                {PREFIXES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="guestName" className="block text-sm font-medium text-stone-700 mb-1">
                Guest Name
              </label>
              <input
                type="text"
                id="guestName"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Sanjaya"
                maxLength={80}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={!guestName.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-beige-deep text-white text-sm tracking-[0.2em] uppercase shadow-lg hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LinkIcon className="w-5 h-5" />
              Generate Link
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <button
              type="button"
              disabled={!generated}
              onClick={() => generated && handleCopy(generated.link, 'Link copied!')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-brand-beige-deep text-brand-beige-deep text-xs tracking-[0.15em] uppercase hover:bg-brand-beige/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Copy className="w-4 h-4" />
              Copy Link Only
            </button>
            <button
              type="button"
              disabled={!generated}
              onClick={() => generated && handleCopy(generated.message, 'Message copied!')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-brand-beige-deep text-brand-beige-deep text-xs tracking-[0.15em] uppercase hover:bg-brand-beige/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <MessageSquareText className="w-4 h-4" />
              Copy Full Message
            </button>
          </div>

          {generated && (
            <div className="mt-8 space-y-4">
              <div className="p-4 bg-brand-ivory rounded-xl border border-brand-beige/50">
                <p className="text-xs uppercase tracking-[0.15em] text-stone-500 mb-1">Greeting</p>
                <p className="font-serif text-lg text-stone-800">Dear {generated.displayName} ❤️</p>
              </div>

              <div className="p-4 bg-brand-ivory rounded-xl border border-brand-beige/50">
                <p className="text-xs uppercase tracking-[0.15em] text-stone-500 mb-2">Generated Link</p>
                <a
                  href={generated.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block break-all text-sm text-brand-beige-deep underline underline-offset-2"
                >
                  {generated.link}
                </a>
              </div>

              <div className="p-4 bg-brand-ivory rounded-xl border border-brand-beige/50">
                <p className="text-xs uppercase tracking-[0.15em] text-stone-500 mb-2">Message Preview</p>
                <pre className="whitespace-pre-wrap break-words font-sans text-sm text-stone-700 leading-relaxed">
                  {generated.message}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
