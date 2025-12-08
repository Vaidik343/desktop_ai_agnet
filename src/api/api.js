// export async function fetchViolations() {
//   const res = await fetch("/api/violations");
//   return res.json();
// }

export async function reportViolation(agentId, filePath, reason) {
  const res = await fetch("/api/violations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agentId, filePath, reason })
  });
  return res.json();
}

export async function fetchViolations() {
  const res = await fetch("http://localhost:7000/api/violations");
  console.log("🚀 ~ fetchViolations ~ res:", res)
  if (!res.ok) throw new Error("Failed to fetch violations");
  return res.json();
}
