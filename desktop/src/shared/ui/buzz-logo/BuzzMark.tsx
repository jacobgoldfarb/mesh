/**
 * Superhuman Mesh mark — a circular node network with an "M" through the
 * center, rendered in `currentColor` so it tints per-theme.
 */
export function BuzzMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={["buzz-mark", className].filter(Boolean).join(" ")}
      viewBox="0 0 512 512"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g>
        <line x1="256.0" y1="256.0" x2="297.6" y2="214.4" strokeWidth="1.35" />
        <line x1="256.0" y1="256.0" x2="214.4" y2="297.6" strokeWidth="1.35" />
        <line x1="256.0" y1="256.0" x2="256.0" y2="302.2" strokeWidth="1.35" />
        <line x1="256.0" y1="197.2" x2="297.6" y2="214.4" strokeWidth="1.35" />
        <line x1="256.0" y1="197.2" x2="214.4" y2="214.4" strokeWidth="1.35" />
        <line x1="256.0" y1="197.2" x2="256.0" y2="151.0" strokeWidth="1.35" />
        <line x1="297.6" y1="214.4" x2="314.8" y2="256.0" strokeWidth="1.35" />
        <line x1="297.6" y1="214.4" x2="308.5" y2="165.1" strokeWidth="1.35" />
        <line x1="297.6" y1="214.4" x2="323.2" y2="218.2" strokeWidth="1.35" />
        <line x1="314.8" y1="256.0" x2="297.6" y2="297.6" strokeWidth="1.35" />
        <line x1="314.8" y1="256.0" x2="361.0" y2="256.0" strokeWidth="1.35" />
        <line x1="314.8" y1="256.0" x2="323.2" y2="218.2" strokeWidth="1.35" />
        <line x1="297.6" y1="297.6" x2="256.0" y2="314.8" strokeWidth="1.35" />
        <line x1="297.6" y1="297.6" x2="346.9" y2="308.5" strokeWidth="1.35" />
        <line x1="297.6" y1="297.6" x2="308.5" y2="346.9" strokeWidth="1.35" />
        <line x1="297.6" y1="297.6" x2="256.0" y2="302.2" strokeWidth="1.35" />
        <line x1="256.0" y1="314.8" x2="214.4" y2="297.6" strokeWidth="1.35" />
        <line x1="256.0" y1="314.8" x2="256.0" y2="361.0" strokeWidth="1.35" />
        <line x1="256.0" y1="314.8" x2="256.0" y2="302.2" strokeWidth="1.35" />
        <line x1="214.4" y1="297.6" x2="197.2" y2="256.0" strokeWidth="1.35" />
        <line x1="214.4" y1="297.6" x2="203.5" y2="346.9" strokeWidth="1.35" />
        <line x1="214.4" y1="297.6" x2="165.1" y2="308.5" strokeWidth="1.35" />
        <line x1="214.4" y1="297.6" x2="256.0" y2="302.2" strokeWidth="1.35" />
        <line x1="197.2" y1="256.0" x2="214.4" y2="214.4" strokeWidth="1.35" />
        <line x1="197.2" y1="256.0" x2="151.0" y2="256.0" strokeWidth="1.35" />
        <line x1="197.2" y1="256.0" x2="188.8" y2="218.2" strokeWidth="1.35" />
        <line x1="214.4" y1="214.4" x2="203.5" y2="165.1" strokeWidth="1.35" />
        <line x1="214.4" y1="214.4" x2="188.8" y2="218.2" strokeWidth="1.35" />
        <line x1="256.0" y1="151.0" x2="256.0" y2="104.8" strokeWidth="1.35" />
        <line x1="256.0" y1="151.0" x2="214.0" y2="125.8" strokeWidth="1.35" />
        <line x1="308.5" y1="165.1" x2="313.9" y2="116.3" strokeWidth="1.35" />
        <line x1="308.5" y1="165.1" x2="298.0" y2="125.8" strokeWidth="1.35" />
        <line x1="346.9" y1="203.5" x2="395.7" y2="198.1" strokeWidth="1.35" />
        <line x1="346.9" y1="203.5" x2="323.2" y2="218.2" strokeWidth="1.35" />
        <line x1="346.9" y1="203.5" x2="377.8" y2="209.8" strokeWidth="1.35" />
        <line x1="361.0" y1="256.0" x2="407.2" y2="256.0" strokeWidth="1.35" />
        <line x1="361.0" y1="256.0" x2="377.8" y2="209.8" strokeWidth="1.35" />
        <line x1="361.0" y1="256.0" x2="377.8" y2="298.0" strokeWidth="1.35" />
        <line x1="346.9" y1="308.5" x2="395.7" y2="313.9" strokeWidth="1.35" />
        <line x1="346.9" y1="308.5" x2="377.8" y2="298.0" strokeWidth="1.35" />
        <line x1="308.5" y1="346.9" x2="256.0" y2="361.0" strokeWidth="1.35" />
        <line x1="308.5" y1="346.9" x2="313.9" y2="395.7" strokeWidth="1.35" />
        <line x1="308.5" y1="346.9" x2="335.8" y2="386.2" strokeWidth="1.35" />
        <line x1="256.0" y1="361.0" x2="256.0" y2="407.2" strokeWidth="1.35" />
        <line x1="203.5" y1="346.9" x2="198.1" y2="395.7" strokeWidth="1.35" />
        <line x1="203.5" y1="346.9" x2="176.2" y2="386.2" strokeWidth="1.35" />
        <line x1="165.1" y1="308.5" x2="116.3" y2="313.9" strokeWidth="1.35" />
        <line x1="165.1" y1="308.5" x2="134.2" y2="298.0" strokeWidth="1.35" />
        <line x1="151.0" y1="256.0" x2="104.8" y2="256.0" strokeWidth="1.35" />
        <line x1="151.0" y1="256.0" x2="134.2" y2="298.0" strokeWidth="1.35" />
        <line x1="151.0" y1="256.0" x2="134.2" y2="209.8" strokeWidth="1.35" />
        <line x1="165.1" y1="203.5" x2="116.3" y2="198.1" strokeWidth="1.35" />
        <line x1="165.1" y1="203.5" x2="134.2" y2="209.8" strokeWidth="1.35" />
        <line x1="165.1" y1="203.5" x2="188.8" y2="218.2" strokeWidth="1.35" />
        <line x1="203.5" y1="165.1" x2="198.1" y2="116.3" strokeWidth="1.35" />
        <line x1="203.5" y1="165.1" x2="214.0" y2="125.8" strokeWidth="1.35" />
        <line x1="256.0" y1="104.8" x2="256.0" y2="62.8" strokeWidth="1.35" />
        <line x1="256.0" y1="104.8" x2="256.0" y2="46.0" strokeWidth="1.35" />
        <line x1="256.0" y1="104.8" x2="214.0" y2="125.8" strokeWidth="1.35" />
        <line x1="256.0" y1="104.8" x2="298.0" y2="125.8" strokeWidth="1.35" />
        <line x1="313.9" y1="116.3" x2="315.7" y2="72.3" strokeWidth="1.35" />
        <line x1="313.9" y1="116.3" x2="336.4" y2="62.0" strokeWidth="1.35" />
        <line x1="313.9" y1="116.3" x2="298.0" y2="125.8" strokeWidth="1.35" />
        <line x1="362.9" y1="149.1" x2="369.6" y2="99.7" strokeWidth="1.35" />
        <line x1="362.9" y1="149.1" x2="412.3" y2="142.4" strokeWidth="1.35" />
        <line x1="362.9" y1="149.1" x2="377.8" y2="125.8" strokeWidth="1.35" />
        <line x1="395.7" y1="198.1" x2="439.7" y2="196.3" strokeWidth="1.35" />
        <line x1="395.7" y1="198.1" x2="450.0" y2="175.6" strokeWidth="1.35" />
        <line x1="395.7" y1="198.1" x2="377.8" y2="209.8" strokeWidth="1.35" />
        <line x1="407.2" y1="256.0" x2="449.2" y2="256.0" strokeWidth="1.35" />
        <line x1="407.2" y1="256.0" x2="466.0" y2="256.0" strokeWidth="1.35" />
        <line x1="407.2" y1="256.0" x2="377.8" y2="298.0" strokeWidth="1.35" />
        <line x1="395.7" y1="313.9" x2="439.7" y2="315.7" strokeWidth="1.35" />
        <line x1="395.7" y1="313.9" x2="450.0" y2="336.4" strokeWidth="1.35" />
        <line x1="395.7" y1="313.9" x2="377.8" y2="298.0" strokeWidth="1.35" />
        <line x1="362.9" y1="362.9" x2="412.3" y2="369.6" strokeWidth="1.35" />
        <line x1="362.9" y1="362.9" x2="377.8" y2="386.2" strokeWidth="1.35" />
        <line x1="362.9" y1="362.9" x2="335.8" y2="386.2" strokeWidth="1.35" />
        <line x1="313.9" y1="395.7" x2="315.7" y2="439.7" strokeWidth="1.35" />
        <line x1="313.9" y1="395.7" x2="336.4" y2="450.0" strokeWidth="1.35" />
        <line x1="313.9" y1="395.7" x2="335.8" y2="386.2" strokeWidth="1.35" />
        <line x1="256.0" y1="407.2" x2="256.0" y2="449.2" strokeWidth="1.35" />
        <line x1="256.0" y1="407.2" x2="256.0" y2="466.0" strokeWidth="1.35" />
        <line x1="198.1" y1="395.7" x2="196.3" y2="439.7" strokeWidth="1.35" />
        <line x1="198.1" y1="395.7" x2="175.6" y2="450.0" strokeWidth="1.35" />
        <line x1="198.1" y1="395.7" x2="176.2" y2="386.2" strokeWidth="1.35" />
        <line x1="149.1" y1="362.9" x2="142.4" y2="412.3" strokeWidth="1.35" />
        <line x1="149.1" y1="362.9" x2="99.7" y2="369.6" strokeWidth="1.35" />
        <line x1="149.1" y1="362.9" x2="134.2" y2="386.2" strokeWidth="1.35" />
        <line x1="149.1" y1="362.9" x2="176.2" y2="386.2" strokeWidth="1.35" />
        <line x1="116.3" y1="313.9" x2="72.3" y2="315.7" strokeWidth="1.35" />
        <line x1="116.3" y1="313.9" x2="62.0" y2="336.4" strokeWidth="1.35" />
        <line x1="116.3" y1="313.9" x2="134.2" y2="298.0" strokeWidth="1.35" />
        <line x1="104.8" y1="256.0" x2="62.8" y2="256.0" strokeWidth="1.35" />
        <line x1="104.8" y1="256.0" x2="46.0" y2="256.0" strokeWidth="1.35" />
        <line x1="104.8" y1="256.0" x2="134.2" y2="298.0" strokeWidth="1.35" />
        <line x1="116.3" y1="198.1" x2="72.3" y2="196.3" strokeWidth="1.35" />
        <line x1="116.3" y1="198.1" x2="62.0" y2="175.6" strokeWidth="1.35" />
        <line x1="116.3" y1="198.1" x2="134.2" y2="209.8" strokeWidth="1.35" />
        <line x1="149.1" y1="149.1" x2="99.7" y2="142.4" strokeWidth="1.35" />
        <line x1="149.1" y1="149.1" x2="142.4" y2="99.7" strokeWidth="1.35" />
        <line x1="149.1" y1="149.1" x2="134.2" y2="125.8" strokeWidth="1.35" />
        <line x1="198.1" y1="116.3" x2="196.3" y2="72.3" strokeWidth="1.35" />
        <line x1="198.1" y1="116.3" x2="175.6" y2="62.0" strokeWidth="1.35" />
        <line x1="198.1" y1="116.3" x2="214.0" y2="125.8" strokeWidth="1.35" />
        <line x1="256.0" y1="62.8" x2="315.7" y2="72.3" strokeWidth="1.35" />
        <line x1="256.0" y1="62.8" x2="256.0" y2="46.0" strokeWidth="1.35" />
        <line x1="315.7" y1="72.3" x2="256.0" y2="46.0" strokeWidth="1.35" />
        <line x1="315.7" y1="72.3" x2="336.4" y2="62.0" strokeWidth="1.35" />
        <line x1="315.7" y1="72.3" x2="298.0" y2="125.8" strokeWidth="1.35" />
        <line x1="369.6" y1="99.7" x2="336.4" y2="62.0" strokeWidth="1.35" />
        <line x1="369.6" y1="99.7" x2="404.5" y2="107.5" strokeWidth="1.35" />
        <line x1="369.6" y1="99.7" x2="377.8" y2="125.8" strokeWidth="1.35" />
        <line x1="412.3" y1="142.4" x2="404.5" y2="107.5" strokeWidth="1.35" />
        <line x1="412.3" y1="142.4" x2="450.0" y2="175.6" strokeWidth="1.35" />
        <line x1="412.3" y1="142.4" x2="377.8" y2="125.8" strokeWidth="1.35" />
        <line x1="439.7" y1="196.3" x2="449.2" y2="256.0" strokeWidth="1.35" />
        <line x1="439.7" y1="196.3" x2="450.0" y2="175.6" strokeWidth="1.35" />
        <line x1="439.7" y1="196.3" x2="466.0" y2="256.0" strokeWidth="1.35" />
        <line x1="449.2" y1="256.0" x2="439.7" y2="315.7" strokeWidth="1.35" />
        <line x1="449.2" y1="256.0" x2="466.0" y2="256.0" strokeWidth="1.35" />
        <line x1="439.7" y1="315.7" x2="450.0" y2="336.4" strokeWidth="1.35" />
        <line x1="412.3" y1="369.6" x2="450.0" y2="336.4" strokeWidth="1.35" />
        <line x1="412.3" y1="369.6" x2="404.5" y2="404.5" strokeWidth="1.35" />
        <line x1="412.3" y1="369.6" x2="377.8" y2="386.2" strokeWidth="1.35" />
        <line x1="369.6" y1="412.3" x2="404.5" y2="404.5" strokeWidth="1.35" />
        <line x1="369.6" y1="412.3" x2="336.4" y2="450.0" strokeWidth="1.35" />
        <line x1="369.6" y1="412.3" x2="377.8" y2="386.2" strokeWidth="1.35" />
        <line x1="369.6" y1="412.3" x2="335.8" y2="386.2" strokeWidth="1.35" />
        <line x1="315.7" y1="439.7" x2="336.4" y2="450.0" strokeWidth="1.35" />
        <line x1="315.7" y1="439.7" x2="335.8" y2="386.2" strokeWidth="1.35" />
        <line x1="256.0" y1="449.2" x2="196.3" y2="439.7" strokeWidth="1.35" />
        <line x1="256.0" y1="449.2" x2="256.0" y2="466.0" strokeWidth="1.35" />
        <line x1="196.3" y1="439.7" x2="256.0" y2="466.0" strokeWidth="1.35" />
        <line x1="196.3" y1="439.7" x2="175.6" y2="450.0" strokeWidth="1.35" />
        <line x1="196.3" y1="439.7" x2="176.2" y2="386.2" strokeWidth="1.35" />
        <line x1="142.4" y1="412.3" x2="175.6" y2="450.0" strokeWidth="1.35" />
        <line x1="142.4" y1="412.3" x2="107.5" y2="404.5" strokeWidth="1.35" />
        <line x1="142.4" y1="412.3" x2="134.2" y2="386.2" strokeWidth="1.35" />
        <line x1="142.4" y1="412.3" x2="176.2" y2="386.2" strokeWidth="1.35" />
        <line x1="99.7" y1="369.6" x2="72.3" y2="315.7" strokeWidth="1.35" />
        <line x1="99.7" y1="369.6" x2="107.5" y2="404.5" strokeWidth="1.35" />
        <line x1="99.7" y1="369.6" x2="62.0" y2="336.4" strokeWidth="1.35" />
        <line x1="99.7" y1="369.6" x2="134.2" y2="386.2" strokeWidth="1.35" />
        <line x1="72.3" y1="315.7" x2="62.0" y2="336.4" strokeWidth="1.35" />
        <line x1="62.8" y1="256.0" x2="72.3" y2="196.3" strokeWidth="1.35" />
        <line x1="62.8" y1="256.0" x2="46.0" y2="256.0" strokeWidth="1.35" />
        <line x1="72.3" y1="196.3" x2="46.0" y2="256.0" strokeWidth="1.35" />
        <line x1="72.3" y1="196.3" x2="62.0" y2="175.6" strokeWidth="1.35" />
        <line x1="99.7" y1="142.4" x2="62.0" y2="175.6" strokeWidth="1.35" />
        <line x1="99.7" y1="142.4" x2="107.5" y2="107.5" strokeWidth="1.35" />
        <line x1="99.7" y1="142.4" x2="134.2" y2="125.8" strokeWidth="1.35" />
        <line x1="142.4" y1="99.7" x2="107.5" y2="107.5" strokeWidth="1.35" />
        <line x1="142.4" y1="99.7" x2="175.6" y2="62.0" strokeWidth="1.35" />
        <line x1="142.4" y1="99.7" x2="134.2" y2="125.8" strokeWidth="1.35" />
        <line x1="196.3" y1="72.3" x2="175.6" y2="62.0" strokeWidth="1.35" />
        <line x1="196.3" y1="72.3" x2="214.0" y2="125.8" strokeWidth="1.35" />
        <line x1="404.5" y1="107.5" x2="377.8" y2="125.8" strokeWidth="1.35" />
        <line x1="404.5" y1="404.5" x2="377.8" y2="386.2" strokeWidth="1.35" />
        <line x1="107.5" y1="404.5" x2="134.2" y2="386.2" strokeWidth="1.35" />
        <line x1="107.5" y1="107.5" x2="134.2" y2="125.8" strokeWidth="1.35" />
        <line x1="134.2" y1="386.2" x2="134.2" y2="298.0" strokeWidth="2.6" />
        <line x1="134.2" y1="386.2" x2="176.2" y2="386.2" strokeWidth="2.6" />
        <line x1="134.2" y1="298.0" x2="134.2" y2="209.8" strokeWidth="2.6" />
        <line x1="134.2" y1="209.8" x2="134.2" y2="125.8" strokeWidth="2.6" />
        <line x1="134.2" y1="125.8" x2="188.8" y2="218.2" strokeWidth="2.6" />
        <line x1="134.2" y1="125.8" x2="214.0" y2="125.8" strokeWidth="2.6" />
        <line x1="188.8" y1="218.2" x2="256.0" y2="302.2" strokeWidth="2.6" />
        <line x1="256.0" y1="302.2" x2="323.2" y2="218.2" strokeWidth="2.6" />
        <line x1="323.2" y1="218.2" x2="377.8" y2="125.8" strokeWidth="2.6" />
        <line x1="377.8" y1="125.8" x2="377.8" y2="209.8" strokeWidth="2.6" />
        <line x1="377.8" y1="125.8" x2="298.0" y2="125.8" strokeWidth="2.6" />
        <line x1="377.8" y1="209.8" x2="377.8" y2="298.0" strokeWidth="2.6" />
        <line x1="377.8" y1="298.0" x2="377.8" y2="386.2" strokeWidth="2.6" />
        <line x1="377.8" y1="386.2" x2="335.8" y2="386.2" strokeWidth="2.6" />
        <line x1="214.0" y1="125.8" x2="298.0" y2="125.8" strokeWidth="2.6" />
      </g>
        <circle cx="256.0" cy="256.0" r="3.4" fill="currentColor" />
        <circle cx="256.0" cy="197.2" r="3.4" fill="currentColor" />
        <circle cx="297.6" cy="214.4" r="3.4" fill="currentColor" />
        <circle cx="314.8" cy="256.0" r="3.4" fill="currentColor" />
        <circle cx="297.6" cy="297.6" r="3.4" fill="currentColor" />
        <circle cx="256.0" cy="314.8" r="3.4" fill="currentColor" />
        <circle cx="214.4" cy="297.6" r="3.4" fill="currentColor" />
        <circle cx="197.2" cy="256.0" r="3.4" fill="currentColor" />
        <circle cx="214.4" cy="214.4" r="3.4" fill="currentColor" />
        <circle cx="256.0" cy="151.0" r="3.4" fill="currentColor" />
        <circle cx="308.5" cy="165.1" r="3.4" fill="currentColor" />
        <circle cx="346.9" cy="203.5" r="3.4" fill="currentColor" />
        <circle cx="361.0" cy="256.0" r="3.4" fill="currentColor" />
        <circle cx="346.9" cy="308.5" r="3.4" fill="currentColor" />
        <circle cx="308.5" cy="346.9" r="3.4" fill="currentColor" />
        <circle cx="256.0" cy="361.0" r="3.4" fill="currentColor" />
        <circle cx="203.5" cy="346.9" r="3.4" fill="currentColor" />
        <circle cx="165.1" cy="308.5" r="3.4" fill="currentColor" />
        <circle cx="151.0" cy="256.0" r="3.4" fill="currentColor" />
        <circle cx="165.1" cy="203.5" r="3.4" fill="currentColor" />
        <circle cx="203.5" cy="165.1" r="3.4" fill="currentColor" />
        <circle cx="256.0" cy="104.8" r="3.4" fill="currentColor" />
        <circle cx="313.9" cy="116.3" r="3.4" fill="currentColor" />
        <circle cx="362.9" cy="149.1" r="3.4" fill="currentColor" />
        <circle cx="395.7" cy="198.1" r="3.4" fill="currentColor" />
        <circle cx="407.2" cy="256.0" r="3.4" fill="currentColor" />
        <circle cx="395.7" cy="313.9" r="3.4" fill="currentColor" />
        <circle cx="362.9" cy="362.9" r="3.4" fill="currentColor" />
        <circle cx="313.9" cy="395.7" r="3.4" fill="currentColor" />
        <circle cx="256.0" cy="407.2" r="3.4" fill="currentColor" />
        <circle cx="198.1" cy="395.7" r="3.4" fill="currentColor" />
        <circle cx="149.1" cy="362.9" r="3.4" fill="currentColor" />
        <circle cx="116.3" cy="313.9" r="3.4" fill="currentColor" />
        <circle cx="104.8" cy="256.0" r="3.4" fill="currentColor" />
        <circle cx="116.3" cy="198.1" r="3.4" fill="currentColor" />
        <circle cx="149.1" cy="149.1" r="3.4" fill="currentColor" />
        <circle cx="198.1" cy="116.3" r="3.4" fill="currentColor" />
        <circle cx="256.0" cy="62.8" r="3.4" fill="currentColor" />
        <circle cx="315.7" cy="72.3" r="3.4" fill="currentColor" />
        <circle cx="369.6" cy="99.7" r="3.4" fill="currentColor" />
        <circle cx="412.3" cy="142.4" r="3.4" fill="currentColor" />
        <circle cx="439.7" cy="196.3" r="3.4" fill="currentColor" />
        <circle cx="449.2" cy="256.0" r="3.4" fill="currentColor" />
        <circle cx="439.7" cy="315.7" r="3.4" fill="currentColor" />
        <circle cx="412.3" cy="369.6" r="3.4" fill="currentColor" />
        <circle cx="369.6" cy="412.3" r="3.4" fill="currentColor" />
        <circle cx="315.7" cy="439.7" r="3.4" fill="currentColor" />
        <circle cx="256.0" cy="449.2" r="3.4" fill="currentColor" />
        <circle cx="196.3" cy="439.7" r="3.4" fill="currentColor" />
        <circle cx="142.4" cy="412.3" r="3.4" fill="currentColor" />
        <circle cx="99.7" cy="369.6" r="3.4" fill="currentColor" />
        <circle cx="72.3" cy="315.7" r="3.4" fill="currentColor" />
        <circle cx="62.8" cy="256.0" r="3.4" fill="currentColor" />
        <circle cx="72.3" cy="196.3" r="3.4" fill="currentColor" />
        <circle cx="99.7" cy="142.4" r="3.4" fill="currentColor" />
        <circle cx="142.4" cy="99.7" r="3.4" fill="currentColor" />
        <circle cx="196.3" cy="72.3" r="3.4" fill="currentColor" />
        <circle cx="256.0" cy="46.0" r="3.4" fill="currentColor" />
        <circle cx="336.4" cy="62.0" r="3.4" fill="currentColor" />
        <circle cx="404.5" cy="107.5" r="3.4" fill="currentColor" />
        <circle cx="450.0" cy="175.6" r="3.4" fill="currentColor" />
        <circle cx="466.0" cy="256.0" r="3.4" fill="currentColor" />
        <circle cx="450.0" cy="336.4" r="3.4" fill="currentColor" />
        <circle cx="404.5" cy="404.5" r="3.4" fill="currentColor" />
        <circle cx="336.4" cy="450.0" r="3.4" fill="currentColor" />
        <circle cx="256.0" cy="466.0" r="3.4" fill="currentColor" />
        <circle cx="175.6" cy="450.0" r="3.4" fill="currentColor" />
        <circle cx="107.5" cy="404.5" r="3.4" fill="currentColor" />
        <circle cx="62.0" cy="336.4" r="3.4" fill="currentColor" />
        <circle cx="46.0" cy="256.0" r="3.4" fill="currentColor" />
        <circle cx="62.0" cy="175.6" r="3.4" fill="currentColor" />
        <circle cx="107.5" cy="107.5" r="3.4" fill="currentColor" />
        <circle cx="175.6" cy="62.0" r="3.4" fill="currentColor" />
        <circle cx="134.2" cy="386.2" r="5.4" fill="currentColor" />
        <circle cx="134.2" cy="298.0" r="5.4" fill="currentColor" />
        <circle cx="134.2" cy="209.8" r="5.4" fill="currentColor" />
        <circle cx="134.2" cy="125.8" r="5.4" fill="currentColor" />
        <circle cx="188.8" cy="218.2" r="5.4" fill="currentColor" />
        <circle cx="256.0" cy="302.2" r="5.4" fill="currentColor" />
        <circle cx="323.2" cy="218.2" r="5.4" fill="currentColor" />
        <circle cx="377.8" cy="125.8" r="5.4" fill="currentColor" />
        <circle cx="377.8" cy="209.8" r="5.4" fill="currentColor" />
        <circle cx="377.8" cy="298.0" r="5.4" fill="currentColor" />
        <circle cx="377.8" cy="386.2" r="5.4" fill="currentColor" />
        <circle cx="176.2" cy="386.2" r="5.4" fill="currentColor" />
        <circle cx="335.8" cy="386.2" r="5.4" fill="currentColor" />
        <circle cx="214.0" cy="125.8" r="5.4" fill="currentColor" />
        <circle cx="298.0" cy="125.8" r="5.4" fill="currentColor" />
    </svg>
  );
}
