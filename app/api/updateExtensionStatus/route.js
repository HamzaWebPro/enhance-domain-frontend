import connectToDatabase from "@/lib/db";
import Extension from "@/models/extensionSchema";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ message: "Extension ID is required." }),
        { status: 400 }
      );
    }

    await connectToDatabase();

    const extension = await Extension.findById(id);

    if (!extension) {
      return new Response(JSON.stringify({ message: "Extension not found." }), {
        status: 404,
      });
    }

    // Toggle the status
    extension.isActive = !extension.isActive;
    await extension.save();

    return new Response(
      JSON.stringify({
        message: `Extension status set to ${
          extension.isActive ? "active" : "inactive"
        }.`,
        extension,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error toggling status", error }),
      { status: 500 }
    );
  }
}
