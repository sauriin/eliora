export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { password } = req.body;

  // Compare with env variable
  if (password === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({ success: true });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Incorrect password" });
  }
}
