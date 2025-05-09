import connectToDatabase from "@/lib/db";
import Extension from "@/models/extensionSchema";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, newName } = body;

    if (!id || !newName) {
      return new Response(
        JSON.stringify({ message: "ID and new name are required." }),
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updated = await Extension.findByIdAndUpdate(
      id,
      { name: newName },
      { new: true }
    );

    if (!updated) {
      return new Response(JSON.stringify({ message: "Extension not found." }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Extension updated successfully", extension: updated }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error updating extension", error }),
      { status: 500 }
    );
  }
}