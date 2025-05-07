import connectToDatabase from "@/lib/db";
import Domain from "@/models/domainSchema";

export async function POST(req) {
  try {
    const body = await req.json();
    const { domain, email, amount } = body;

    if (!domain || !email || !amount) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 }
      );
    }

    await connectToDatabase();

    // ✅ Check if domain already exists
    const existingDomain = await Domain.findOne({ domain });
    if (existingDomain) {
      return new Response(
        JSON.stringify({ message: `This domain "${domain}" is not available.` })
      );
    }

    // ✅ Save new domain if not exists
    const newDomain = new Domain({
      domain,
      email,
      amount,
      status: "Pending",
    });

    await newDomain.save();

    return new Response(
      JSON.stringify({
        message:
          "Domain claim request submitted successfully! We will contact through email soon!",
        newDomain,
      }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error submitting domain", error }),
      { status: 500 }
    );
  }
}
