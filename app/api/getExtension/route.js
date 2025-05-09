import connectToDatabase from "@/lib/db";
import Extension from "@/models/extensionSchema";

export async function GET() {
  try {
    await connectToDatabase();

    const extensions = await Extension.find().sort({ createdAt: -1 });

    return new Response(JSON.stringify({ extensions }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error fetching extensions", error }),
      { status: 500 }
    );
  }
}