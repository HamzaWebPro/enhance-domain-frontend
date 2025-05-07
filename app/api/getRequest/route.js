import connectToDatabase from "@/lib/db";
import Domain from "@/models/domainSchema";

export async function GET(req) {
  try {
    await connectToDatabase(); // Ensure we are connected to DB

    // Fetch all domains
    const domains = await Domain.find();

    return new Response(JSON.stringify({ domains }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error fetching domains", error }),
      { status: 500 }
    );
  }
}
