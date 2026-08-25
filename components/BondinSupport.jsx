import Script from "next/script";

export default function BondinSupport() {
  return (
    <>
      <Script src="https://bondin.io/embed/v1.js" strategy="afterInteractive" />
      <bondin-support
        username="pixelventurers"
        label="Support me"
      ></bondin-support>
    </>
  );
}
