export const sha256 = async (target: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(target);

  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}
