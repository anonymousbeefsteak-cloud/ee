export default function handler(req, res) {
  res.status(200).json({
    liffId: process.env.NEXT_PUBLIC_LIFF_ID,
    apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT,
    allEnv: process.env
  });
}
