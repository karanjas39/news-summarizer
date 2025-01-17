# News Summarizer

**News Summarizer** is a lightweight, TypeScript-based library for summarizing news articles. It processes long-form content into concise summaries by analyzing sentence structure, key metrics, and contextual relevance.

## Features

- Extracts meaningful sentences from lengthy text.
- Scores sentences based on content patterns and metrics.
- Optimized for news articles with support for financial, analytical, and action-related text patterns.
- Easy-to-use API with customizable summary lengths.

## Installation

Install the library via npm:

```bash
npm install news-summarizer
```

## Usage

Import and use the `NewsSummarizer` class in your TypeScript or JavaScript project:

```typescript
import { NewsSummarizer } from "news-summarizer";

const summarizer = new NewsSummarizer();
const text = `
The global economy is expected to grow by 3.5% this year, according to the latest IMF report. Key sectors such as technology and healthcare are projected to see significant gains, while challenges remain in addressing climate change and geopolitical tensions. 
  Governments around the world are introducing new policies to support sustainable development. 
  These measures include investments in renewable energy and incentives for green technologies.
  Companies like Tesla and Apple are leading the charge in innovation, with new products 
  targeting both developed and emerging markets. Market analysts predict robust growth 
  for renewable energy stocks, citing strong demand and favorable policies.
  Despite global uncertainties, the overall outlook remains positive.
  The report also highlights the importance of international cooperation to achieve long-term goals.
`;

const summary = summarizer.summarize(text, 3); // Summarize to 3 sentences
console.log(summary);
```

### Example Output

```
The global economy is expected to grow by 3.5% this year, according to the latest IMF report. Key sectors such as technology and healthcare are projected to see significant gains, while challenges remain in addressing climate change and geopolitical tensions. Companies like Tesla and Apple are leading the charge in innovation, with new products targeting both developed and emerging markets. Market analysts predict robust growth for renewable energy stocks, citing strong demand and favorable policies. Despite global uncertainties, the overall outlook remains positive.
```

## Methods

### `summarize(text: string, numSentences: number = 3): string`

Generates a summary for the given text.

- **Parameters**:
  - `text` (string): The input text to summarize.
  - `numSentences` (number, optional): The number of sentences to include in the summary (default: 3).
- **Returns**:
  - A string containing the summarized content.

### Example

```typescript
const text = "Your article or content here...";
const summary = summarizer.summarize(text, 5); // Summarize to 5 sentences
console.log(summary);
```

## Development

### Local Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/karanjas39/news-summarizer.git
cd news-summarizer
npm install
```

Build the project:

```bash
npm run build
```

## Contribution

Contributions are welcome! Feel free to fork the repository and submit pull requests.

## Contact

- **Email**: [dhillonjaskaran4486@gmail.com](mailto:dhillonjaskaran4486@gmail.com)
- **LinkedIn**: [Jaskaran Singh](https://www.linkedin.com/in/singhjaskaran/)

---

### License

This project is licensed under the MIT License.
