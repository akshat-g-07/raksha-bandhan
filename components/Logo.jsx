export default function Logo() {
  return (
    <picture>
      {/* md (768px) and up -> lg logo, below -> sm logo */}
      <source media="(min-width: 768px)" srcSet="/webp/lg/logo.svg" />
      <img
        src="/webp/sm/logo.svg"
        alt="Raksha Bandhan"
        className="h-auto w-80 md:w-125 2xl:w-200"
      />
    </picture>
  );
}
