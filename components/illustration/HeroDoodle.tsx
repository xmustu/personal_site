type HeroDoodleProps = {
  className?: string;
};

export function HeroDoodle({ className = "" }: HeroDoodleProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 560 180"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="#FFF7ED" height="180" rx="24" width="560" />
      <circle cx="82" cy="64" fill="#FDBA74" r="30" />
      <circle cx="128" cy="118" fill="#FED7AA" r="18" />
      <circle cx="456" cy="52" fill="#FDBA74" r="22" />
      <circle cx="420" cy="118" fill="#FED7AA" r="14" />
      <path
        d="M38 132C86 106 138 152 190 132C242 112 286 66 342 78C398 90 446 146 522 122"
        stroke="#EA580C"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M84 44C124 18 172 56 214 44"
        stroke="#FB923C"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <path
        d="M344 34C376 20 412 50 448 36"
        stroke="#FB923C"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <rect fill="#FFFFFF" height="56" rx="14" width="120" x="222" y="92" />
      <path
        d="M244 116H320"
        stroke="#FDBA74"
        strokeLinecap="round"
        strokeWidth="6"
      />
      <path
        d="M244 132H296"
        stroke="#FED7AA"
        strokeLinecap="round"
        strokeWidth="6"
      />
    </svg>
  );
}
