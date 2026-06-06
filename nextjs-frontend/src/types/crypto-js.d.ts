// Minimal TypeScript declaration for crypto-js
// This avoids needing @types/crypto-js when installing dev deps fails.

declare module "crypto-js" {
  const CryptoJS: any;
  export default CryptoJS;
}
