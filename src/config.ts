// Central wedding details — edit here and every section updates.

// Google Apps Script Web App URL (see code.ts / google-apps-script/SETUP.md).
// Set VITE_GOOGLE_APPS_SCRIPT_URL in .env (or Vercel env vars), or paste the URL below.
export const GOOGLE_SCRIPT_URL: string =
  (import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL as string | undefined) ||
  'PASTE_YOUR_WEB_APP_URL_HERE';

export const isScriptConfigured = () => GOOGLE_SCRIPT_URL.startsWith('https://script.google.com/');

export const WEDDING = {
  groom: 'Subes',
  bride: 'Neomilie',
  groomParents: 'Son of Mr. Sahayadevarajah and Mrs. Jeyarani',
  brideParents: 'Daughter of Mr. Hilary Speck and Mrs. Diliniya Ann Speck',
  dateISO: '2027-01-27T09:30:00+05:30',
  dateShort: '27 . 01 . 2027',
  dateLong: 'Wednesday, 27th January 2027',
  time: '9:30 AM',
  ceremony: {
    title: 'Holy Mass',
    venue: "St. Mary's Cathedral",
    city: 'Trincomalee',
    mapLink: 'https://maps.app.goo.gl/mhQrmzdMKcyUa5Q98',
    embed: "https://maps.google.com/maps?q=St.+Mary's+Cathedral+Trincomalee&t=&z=15&ie=UTF8&iwloc=&output=embed",
  },
  reception: {
    title: 'Reception',
    venue: 'Sunshine Wedding Hall',
    address: 'No: 45, Green Road, Trincomalee',
    city: 'Trincomalee',
    mapLink: 'https://maps.app.goo.gl/RQNZtdAt8CofStpS9',
    embed: 'https://maps.google.com/maps?q=Sunshine+Wedding+Hall+Trincomalee&t=&z=15&ie=UTF8&iwloc=&output=embed',
  },
  verses: {
    main: {
      text: 'This is the day the Lord has made; let us rejoice and be glad in it.',
      ref: 'Psalm 118:24',
    },
    card: {
      text: 'The Lord has done this, and it is marvelous in our eyes.',
      ref: 'Psalm 118:23',
    },
  },
  closing: 'We look forward to celebrating this blessed union with you and your family.',
};
