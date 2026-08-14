import Groq from "groq-sdk";
import connectDB from "@/lib/db";
import Product from "@/models/product";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSearchQuery(keywords) {
    const words = new Set();

    keywords.forEach((phrase) => {
        phrase
            .split(/\s+/)
            .map((w) => w.trim())
            .filter((w) => w.length > 1)
            .forEach((w) => words.add(w.toLowerCase()));
    });

    const terms = [...words];

    return {
        $or: terms.flatMap((k) => [
            { title: { $regex: escapeRegex(k), $options: "i" } },
            { description: { $regex: escapeRegex(k), $options: "i" } },
            { category: { $regex: escapeRegex(k), $options: "i" } },
        ]),
    };
}

// Cache persists across requests while the server stays running
const cache = {};

async function getKeywords(query) {
    const normalizedQuery = query.trim().toLowerCase();

    if (cache[normalizedQuery]) {
        return cache[normalizedQuery];
    }

    const aiRes = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
            {
                role: "user",
                content: `Query: "${query}"\n\nReturn 2-4 short search keywords for this exact product on a shopping site. Rules: same product/category only, no unrelated items, no sentences, no labels, no quotes, no explanation — just comma-separated keywords.`,
            },
        ],
        temperature: 0.2,
    });

    const raw = aiRes.choices[0].message.content.trim();
    console.log("RAW Groq response:", raw);

    const keywords = raw
        .split("\n")[0]
        .replace(/["""]/g, "")
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0 && k.length < 30);

    const finalKeywords = keywords.length > 0 ? keywords : [query.trim()];
    finalKeywords.push(query.trim());

    cache[normalizedQuery] = finalKeywords;
    return finalKeywords;
}

export async function POST(req) {
    let query;

    try {
        const body = await req.json();
        query = body.query;

        await connectDB();

        if (!query || query.trim() === "") {
            const allProducts = await Product.find({});
            return Response.json({ products: allProducts });
        }

        const keywords = await getKeywords(query);
        console.log("Keywords:", keywords);

        const products = await Product.find(buildSearchQuery(keywords));
        return Response.json({ products });
    } catch (err) {
        console.error("Search API error (falling back to basic search):", err);

        try {
            const products = await Product.find(buildSearchQuery([query || ""]));
            return Response.json({
                products,
                notice: "AI credits finished, basic search enabled.",
            });
        } catch (fallbackErr) {
            console.error("Fallback search also failed:", fallbackErr);
            return Response.json({ error: "server_error", message: "Something went wrong" }, { status: 500 });
        }
    }
}