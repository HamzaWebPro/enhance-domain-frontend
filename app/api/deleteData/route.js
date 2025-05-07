import connectToDatabase from "@/lib/db";
import Domain from "@/models/domainSchema";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id } = body;

    
    await connectToDatabase();

    const deletedDomain = await Domain.findByIdAndDelete(id);

    if (!deletedDomain) {
      return new Response(
        JSON.stringify({ message: "Domain not found or already deleted" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Domain deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error deleting domain", error }),
      { status: 500 }
    );
  }
}
