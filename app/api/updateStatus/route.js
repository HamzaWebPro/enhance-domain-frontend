import connectToDatabase from "@/lib/db";
import Domain from "@/models/domainSchema";

export async function PUT(req) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { id, status } = body;

    // Validate input
    if (!id || !status) {
      return new Response(
        JSON.stringify({ message: "ID and status are required" }),
        { status: 400 }
      );
    }


    
    // Find and update the domain by ID
    const updatedDomain = await Domain.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedDomain) {
      return new Response(
        JSON.stringify({ message: "Domain not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Status updated", domain: updatedDomain }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Update error:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error", error }),
      { status: 500 }
    );
  }
}
