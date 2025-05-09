import connectToDatabase from "@/lib/db";
import Extension from "@/models/extensionSchema";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ message: "Extension ID is required" }),
        { status: 400 }
      );
    }

    await connectToDatabase();

    // ✅ Check if extension exists
    const extension = await Extension.findById(id);
    if (!extension) {
      return new Response(
        JSON.stringify({ message: "Extension not found" }),
        { status: 404 }
      );
    }

    // ✅ Delete extension
    await Extension.deleteOne({ _id: id });

    return new Response(
      JSON.stringify({ message: "Extension deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error deleting extension", error }),
      { status: 500 }
    );
  }
}