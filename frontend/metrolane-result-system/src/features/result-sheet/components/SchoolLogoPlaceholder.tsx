import logoImage from "@/assets/metrolane-logo.png";

export function SchoolLogoPlaceholder() {
  return (
    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-gray-200 bg-white">
      <img
        src={logoImage}
        alt="Metrolane logo"
        className="h-full w-full object-contain"
      />
      <span className="sr-only">Official School Logo</span>
    </div>
  );
}
