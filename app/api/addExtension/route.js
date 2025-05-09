import connectToDatabase from "@/lib/db";
import Extension from "@/models/extensionSchema";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new Response(JSON.stringify({ message: "Extension name is required." }), {
        status: 400,
      });
    }

    const trimmedName = name.trim();

    // ✅ Regex: starts with . and no spaces allowed
    const isValid = /^\.[^\s.]+$/.test(trimmedName);

    if (!isValid) {
      return new Response(
        JSON.stringify({
          message:
            "Invalid extension format. It must start with a dot (.) and contain no spaces.",
        }),
        { status: 400 }
      );
    }

    await connectToDatabase();

    const exists = await Extension.findOne({ name: trimmedName });
    if (exists) {
      return new Response(
        JSON.stringify({ message: `Extension "${trimmedName}" already exists.` }),
        { status: 409 }
      );
    }

    const newExtension = new Extension({ name: trimmedName });
    await newExtension.save();

    return new Response(
      JSON.stringify({
        message: "Extension added successfully.",
        newExtension,
      }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: "Server error", error }), {
      status: 500,
    });
  }
}