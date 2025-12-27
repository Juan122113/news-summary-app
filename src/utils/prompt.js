export function buildPrompt(newsText, readingMinutes = 5) {
  return `
Act as a professional journalist.

Write a clear, neutral, and well-structured summary of today's most important news,
relevant to Argentina.

The summary should be readable in approximately ${readingMinutes} minutes.

Guidelines:
- Informative and neutral tone
- Continuous text, no bullet points
- Do not invent information
- Use only the facts present in the news provided
- If there is uncertainty, state it clearly
- No personal opinions

Today's news (titles and summaries):

${newsText}
`;
}
