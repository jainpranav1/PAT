/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode prevents useEffect from running twice on initial render
  // https://rishabhsharma.bio/next-js-issue-useeffect-hook-running-twice-in-client-9fb6712f6362
  reactStrictMode: false,
};

export default nextConfig;
